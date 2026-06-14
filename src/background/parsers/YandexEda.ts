import browser from "webextension-polyfill";
import { BaseParser } from "./BaseParser";
import type { ParserState } from "../../types/parsing_state";
import type { PresetByApi } from "../../types/parser_сonfig";

export class YandexEda extends BaseParser {
  private categories = [];
  private modifiers_groups = [];
  private modifiers = [];
  private products = [];
  private response = Response || null;

  async checkAvailability() {
    await this.setLog({ status: "warn", title: "[YandexEda]:Check", value: "Получение метаданных..." });
    const configData = this.config.data as PresetByApi;

    try {
      await this.setLog({ status: "warn", title: "[YandexEda]:Check", value: "Запрос на api..." });
      const resp = await fetch(configData.apiUrl);
      this.response = resp.json();
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

  async parseFirst() {
    await this.setLog({ status: "warn", title: "[YandexEda]:Parse", value: "Парсинг первого товара..." });
    // логика парсинга первой категории/товара
  }

  async parseRest() {
    // логика парсинга остальных категорий
    // для каждой категории:
    // await this.setParsingState({ step: 'parsing_category', currentCategory: 1 });
    await this.waitForNextStep();
  }

  async exportData() {
    await this.setLog({ status: "warn", title: "[YandexEda]:Export", value: "Экспорт данных..." });
    // логика экспорта
  }

  async getProducts() {
    try {
      await this.importCategories();
      return {
        categories: this.categories,
        products: this.products,
        modifiers_groups: this.modifiers_groups,
        modifiers: this.modifiers
      };
    } catch (error) {
      console.error('YandexEdaParser error:', error);
      throw error;
    }
  }

  // Обработка категорий — делаем последовательно, чтобы сохранить порядок
  async importCategories() {
    const configData = this.config?.data as PresetByApi || "";

    try {
      console.log('Fetching API URL:', configData.apiUrl);
      const response = await fetch(configData.apiUrl);
      const data = await response.json();

      // Обрабатываем категории последовательно (for...of + await), чтобы продукты шли в том же порядке
      for (const category of data.payload.categories) {
        this.categories.push({
          id: category.id,
          name: category.name,
          parent: 0,
        });

        // обработка товаров категории тоже последовательно (чтобы сохранить порядок внутри категории)
        if (Array.isArray(category.items)) {
          for (const item of category.items) {
            // await — гарантируем последовательность
            await this.getProductData(item, category.id);
          }
        }
      }

    } catch (error) {
      console.error('Error importing categories:', error);
      throw error;
    }
  }

  async getProductData(product, categoryId) {
    const product_data = {
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
        // fallback
        index = [1, 10];
      }
    }

    if (Array.isArray(product.weights) && product.weights.length) {
      product_data.price = product.weights.map((w, idx) => ({
        id: w.id || `${product.id}_${idx + 1}`, // берем реальный id или генерируем уникальный
        price: w.price ?? product.price,
        index: [w.amount ?? index[0], w.multiplier ?? index[1]]
      }));
    } else {
      // Один параметр по умолчанию
      product_data.price = [{
        id: product.id,       // один параметр — используем id продукта
        price: product.price,
        index: index
      }];
    }

    // Обработка модификаторов
    if (product.optionsGroups && product.optionsGroups.length) {
      for (const group of product.optionsGroups) {
        this.getModifiers(product_data, group);
      }
    }

    // Сохраняем продукт (в порядке вызова importCategories -> for..of)
    this.products.push(product_data);
  }

  getModifiers(product_data, group) {
    const group_modifiers = {
      name: group.name,
      type: 'one_one',
      required: false,
      minimum: 1,
      maximum: 10,
      modifiers: [],
    };

    if (Array.isArray(group.options)) {
      group.options.forEach((option) => {
        group_modifiers.modifiers.push({
          id: option.id,
          name: option.name,
          price: option.price,
        });
      });
    }

    const group_id = this.importModifiersGroup(group_modifiers);
    product_data.modifiers.push(group_id);
  }

  importModifiersGroup(group_modifiers) {
    const group_id = this.modifiers_groups.length + 1;

    this.modifiers_groups.push({
      id: group_id,
      ...group_modifiers
    });

    // Добавляем модификаторы в общий список
    group_modifiers.modifiers.forEach(modifier => {
      this.modifiers.push({
        ...modifier,
        group_id: group_id
      });
    });

    return group_id;
  }

  matchIndex(weightString) {
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