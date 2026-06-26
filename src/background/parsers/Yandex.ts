import { BaseParser } from "./BaseParser";
import type { ParserState } from "../../globalTypes/parsing_state";
import type { PresetByApi } from "../../globalTypes/parser_сonfig";
import type { YandexResp, YandexRespGroup, YandexRespItem } from "../types/YandexParserTypes";
import type { ModGroups, Product } from "../types/ExportTypes";

export class Yandex extends BaseParser {
  private response: YandexResp | null = null;

  async checkAvailability() {
    await this.setLog({ status: "warn", title: "[Yandex]:Check", value: "Получение метаданных..." });
    const configData = this.config.data as PresetByApi;

    try {
      await this.setLog({ status: "warn", title: "[Yandex]:Check", value: "Запрос к api..." });
      const resp = await fetch(configData.apiUrl);
      if (!resp.ok) {
        throw new Error(`HTTP error ${resp.status}: ${resp.statusText}`);
      } else this.response = await resp.json();
    } catch (e) {
      await this.setLog({ status: "danger", title: "[Yandex]:Check", value: "Ошибка  при запросе - " + e });
    }
    await this.setLog({ status: "warn", title: "[Yandex]:Check", value: "Обработка ответа..." });
    const meta = {
      categoriesTotal: 0,
      categories: 0,
      productsTotal: 0,
      products: 0,
      groupsModifiersTotal: 0,
      groupsModifiers: 0,
      modifiersTotal: 0,
      modifiers: 0
    };

    try {
      const categories = this.response?.payload?.categories;
      if (!Array.isArray(categories)) throw Error("Response payload.categories is not an array");

      let categoriesTotal = 0;
      for (const category of categories) {
        if (!category.id) continue;
        categoriesTotal++;
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
      meta.categoriesTotal = categoriesTotal;

      await this.setDataState(meta as Partial<ParserState['data']>);
      await this.setLog({ status: "success", title: "[Yandex]:Check", value: "Получены метаданные" });
    } catch (e) {
      await this.setLog({ status: "danger", title: "[Yandex]:Check", value: "Ошибка при обработке данных - " + e });
      throw e;
    }
  }

  async parseRest() {
    await this.setLog({ status: "warn", title: "[Yandex]:Parse", value: "Парсинг данных..." });
    const categories = this.response?.payload?.categories;
    if (!Array.isArray(categories)) throw Error("Response payload.categories is not an array");

    for (const category of categories) {
      if (!category.id) continue;
      this.categories.push({
        id: category.id,
        name: category.name,
        parent: 0,
      });

      if (Array.isArray(category.items)) {
        for (const item of category.items) {
          await this.getProductData(item, category.id);
          await this.setDataState({ products: this.products.length } as Partial<ParserState['data']>);
        }
      }

      await this.setDataState({ categories: this.categories.length } as Partial<ParserState['data']>);
      await this.setLog({ status: "success", title: "[Yandex]:Parse", value: `Обработана категория ${category.name}` });
      await this.waitForNextStep();
    }
    await this.setLog({ status: "success", title: "[Yandex]:Parse", value: "Обработка завершена!" });
  }

  async getProductData(product: YandexRespItem, categoryId: number) {
    const product_data: Product = {
      product_id: product.id,
      name: product.name,
      picture: '',
      description: product.description || '',
      price: [],
      category: categoryId,
      modifiers: []
    };

    if (product.picture && product.picture.uri) {
      const uriImage = product.picture.uri.replace('-{w}x{h}', '');
      product_data.picture = `https://eda.yandex${uriImage}`;
    }

    let index = [1, 10];
    if (product.weight) {
      const normalized = String(product.weight).replace(/\s/g, '');
      const weightMatch = this.matchIndex(normalized);

      if (weightMatch && weightMatch.length > 0 && Array.isArray(weightMatch[0])) {
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
      proteins: product.nutrients?.proteins.value || undefined,
      fats: product.nutrients?.fats.value || undefined,
      carbohydrates: product.nutrients?.carbohydrates.value || undefined,
      calories: product.nutrients?.calories.value || undefined,
      index: index
    }];

    if (product.optionsGroups && product.optionsGroups.length) {
      for (const group of product.optionsGroups) {
        this.getModifiers(product_data, group);
      }
    }

    this.products.push(product_data);
    if (this.products.length === 1) {
      await this.setDataState({ products: 1 } as Partial<ParserState['data']>);
      await this.setLog({ status: "success", title: "[Yandex]:Parse", value: `Обработан первый товар ${product_data.name}` });
      await this.waitForNextStep();
    }
  }

  async getModifiers(product_data: Product, group: YandexRespGroup) {
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
    product_data.modifiers?.push(group_id);
  }

  async importModifiersGroup(group_modifiers: ModGroups) {
    const group_id = this.modifiers_groups.length + 1;

    group_modifiers.id = group_id;
    this.modifiers_groups.push({ ...group_modifiers });

    if (this.modifiers_groups.length === 1) {
      await this.setLog({ status: "success", title: "[Yandex]:Parse", value: `Обработана первая группа модификаторов ${group_modifiers.name}` });
      await this.waitForNextStep();
    }

    for (const modifier of group_modifiers.modifiers) {
      modifier.group_id = group_id;
      this.modifiers.push({ ...modifier });
      await this.setDataState({ modifiers: this.modifiers.length } as Partial<ParserState['data']>);
    };

    if (this.modifiers.length === 1) {
      await this.setLog({ status: "success", title: "[Yandex]:Parse", value: `Обработана первый модификатор ${this.modifiers[0].name}` });
      await this.waitForNextStep();
    }

    await this.setDataState({ groupsModifiers: this.modifiers_groups.length } as Partial<ParserState['data']>);
    return group_id;
  }

  matchIndex(weightString: string) {
    if (!weightString || typeof weightString !== 'string') return null;

    const numRegex = /(\d+)/g;
    const matches = [];
    let m;
    while ((m = numRegex.exec(weightString)) !== null) {
      matches.push(parseInt(m[1], 10));
    }

    if (matches.length >= 2) {
      return [[matches[0], matches[1]]];
    }
    if (matches.length === 1) {
      return [[matches[0], 1]];
    }
    return null;
  }
}