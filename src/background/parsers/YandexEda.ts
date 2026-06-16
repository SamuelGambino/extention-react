import { BaseParser } from "./BaseParser";
import type { ParserState } from "../../popup/types/parsing_state";
import type { PresetByApi } from "../../popup/types/parser_сonfig";
import type { Categories, ModGroups, Mods, Product, YandexEdaResp, YandexEdaRespGroup, YandexEdaRespItem } from "../types/YandexEdaParser";

export class YandexEda extends BaseParser {
  private categories: Categories[] = [];
  private modifiers_groups: ModGroups[] = [];
  private modifiers: Mods[] = [];
  private products: Product[] = [];
  private response: YandexEdaResp | null = null;

  async checkAvailability() {
    await this.setLog({ status: "warn", title: "[YandexEda]:Check", value: "Получение метаданных..." });
    const configData = this.config.data as PresetByApi;

    try {
      await this.setLog({ status: "warn", title: "[YandexEda]:Check", value: "Запрос на api..." });
      const resp = await fetch(configData.apiUrl);
      this.response = await resp.json();
    } catch (e) {
      await this.setLog({ status: "danger", title: "[YandexEda]:Check", value: "Ошиюка при запросе - " + e });
    }
    await this.setLog({ status: "warn", title: "[YandexEda]:Check", value: "Отбработка ответа..." });
    const meta = {
      categoriesTotal: 0,
      productsTotal: 0,
      groupsModifiersTotal: 0,
      modifiersTotal: 0
    };

    try {
      if (!this.response) throw Error("Response is null");
      meta.categoriesTotal = this.response.payload.categories.length;
      for (const category of this.response.payload.categories) {
        if (Array.isArray(category.items)) {
          meta.productsTotal += category.items.length;
          for (const item of category.items) {
            if (item.optionsGroups && item.optionsGroups.length) {
              meta.groupsModifiersTotal += item.optionsGroups.length;
              for (const group of item.optionsGroups) {
                if (Array.isArray(group.options)) {
                  meta.modifiersTotal += group.options.length;
                }
              }
            }
          }
        }
      }
      await this.setDataState(meta as Partial<ParserState['data']>);
    } catch (e) {
      await this.setLog({ status: "danger", title: "[YandexEda]:Check", value: "Ошиюка при обработке данных - " + e });
    }

    await this.setLog({ status: "success", title: "[YandexEda]:Check", value: "Получены метаданные" });
  }

  async parseRest() {
    await this.setLog({ status: "warn", title: "[YandexEda]:Parse", value: "Парсинг первого товара..." });
    if (!this.response) throw Error("Response is null");

    for (const category of this.response.payload.categories) {
      if (category.name === "Выбор пользователей") return;
      this.categories.push({
        id: category.id,
        name: category.name,
        parent: 0,
      });

      if (Array.isArray(category.items)) {
        for (const item of category.items) {
          await this.getProductData(item, category.id);
        }
      }

      await this.setLog({ status: "success", title: "[YandexEda]:Parse", value: `Обработана категория ${category.name}` });
      await this.waitForNextStep();
    }
    await this.setLog({ status: "success", title: "[YandexEda]:Parse", value: "Обработка завершена!" });
    await this.waitForNextStep();
  }

  async exportData() {
    await this.setLog({ status: "warn", title: "[YandexEda]:Export", value: "Экспорт данных..." });
    // логика экспорта
  }

  async getProductData(product: YandexEdaRespItem, categoryId: number) {
    const product_data: Product = {
      product_id: product.id,
      name: product.name,
      picture: '',
      description: product.description || '',
      price: [],
      category: categoryId,
      modifiers: []
    };

    // Обработка изображения
    if (product.picture && product.picture.uri) {
      const uriImage = product.picture.uri.replace('-{w}x{h}', '');
      product_data.picture = `https://eda.yandex${uriImage}`;
    }

    // Обработка веса и цены — используем более надёжный extractor
    let index = [1, 10]; // дефолт
    if (product.weight) {
      // убираем все пробельные символы
      const normalized = String(product.weight).replace(/\s/g, '');
      const weightMatch = this.matchIndex(normalized);

      if (weightMatch && weightMatch.length > 0 && Array.isArray(weightMatch[0])) {
        // возвращаем первые два числа, если есть; если второе отсутствует — ставим 1
        const first = Number(weightMatch[0][0]) || 0;
        const second = (typeof weightMatch[0][1] !== 'undefined') ? Number(weightMatch[0][1]) : 1;
        index = [first, second];
      } else {
        index = [1, 10];
      }
    }

    product_data.price = [{
      id: product.id,
      price: product.price,
      index: index
    }];

    if (product.optionsGroups && product.optionsGroups.length) {
      for (const group of product.optionsGroups) {
        this.getModifiers(product_data, group);
      }
    }

    this.products.push(product_data);
    if (this.products.length === 1) {
      await this.setLog({ status: "success", title: "[YandexEda]:Parse", value: `Обработан первый товар ${this.products[0]}` });
      await this.waitForNextStep();
    }
  }

  async getModifiers(product_data: Product, group: YandexEdaRespGroup) {
    const group_modifiers: ModGroups = {
      id: 0,
      name: group.name,
      type: 'one_one',
      required: false,
      minimum: 1,
      maximum: 10,
      modifiers: [],
    };

    if (Array.isArray(group.options)) {
      group.options.forEach((option: { id: number, name: string, price: number }) => {
        group_modifiers.modifiers.push({
          id: option.id,
          name: option.name,
          price: option.price,
          group_id: 0,
        });
      });
    }

    const group_id = await this.importModifiersGroup(group_modifiers);
    product_data.modifiers.push(group_id);
  }

  async importModifiersGroup(group_modifiers: ModGroups) {
    const group_id = this.modifiers_groups.length + 1;

    group_modifiers.id = group_id;
    this.modifiers_groups.push({ ...group_modifiers });

    if (this.modifiers_groups.length === 1) {
      await this.setLog({ status: "success", title: "[YandexEda]:Parse", value: `Обработана первая группа модификаторов ${this.modifiers_groups[0]}` });
      await this.waitForNextStep();
    }

    group_modifiers.modifiers.forEach(modifier => {
      modifier.group_id = group_id;
      this.modifiers.push({ ...modifier });
    });

    if (this.modifiers.length === 1) {
      await this.setLog({ status: "success", title: "[YandexEda]:Parse", value: `Обработана первый модификатор ${this.modifiers[0]}` });
      await this.waitForNextStep();
    }

    return group_id;
  }

  matchIndex(weightString: string) {
    if (!weightString || typeof weightString !== 'string') return null;

    const numRegex = /(\d+)/g;
    const matches = [];
    let m;
    while ((m = numRegex.exec(weightString)) !== null) {
      matches.push(parseInt(m[1], 10));
      // Защита от бесконечных циклов — regex.exec продвигается автоматически
    }

    if (matches.length >= 2) {
      return [[matches[0], matches[1]]];
    }
    if (matches.length === 1) {
      return [[matches[0], 1]]; // второе — 1 по дефолту
    }
    return null;
  }
}