import { BaseParser } from "./BaseParser";
import type { ParserState } from "../../globalTypes/parsing_state";
import type { ChibbisModGroupResp, ChibbisProductResp, ChibbisResp } from "../types/ChibbisParserTypes";
import type { PresetByApi } from "../../globalTypes/parser_сonfig";
import type { ModGroups, Product } from "../types/ExportTypes";

export class Chibbis extends BaseParser {
  private response: ChibbisResp | null = null;

  async checkAvailability() {
    await this.setLog({ status: "warn", title: "[Chibbis]:Check", value: "Получение метаданных..." });
    const configData = this.config.data as PresetByApi;

    try {
      await this.setLog({ status: "warn", title: "[Chibbis]:Check", value: "Запрос к api..." });
      const resp = await fetch(configData.apiUrl);
      this.response = await resp.json();
      if (!resp.ok) {
        throw new Error(`HTTP error ${resp.status}: ${resp.statusText}`);
      }
    } catch (e) {
      await this.setLog({ status: "danger", title: "[Chibbis]:Check", value: "Ошибка  при запросе - " + e });
    }
    await this.setLog({ status: "warn", title: "[Chibbis]:Check", value: "Обработка ответа..." });
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
      const categories = this.response?.menu;
      if (!Array.isArray(categories)) throw Error("Response menu is not an array");

      let categoriesTotal = 0;
      const modifierGroups = [];
      let modifiers = 0;
      for (const category of categories) {
        if (category.name === "За баллы" || category.name === "Хиты продаж" || category.name === "Стоит попробовать") continue;
        categoriesTotal++;
        if (Array.isArray(category.products)) {
          meta.productsTotal += category.products.length;
          for (const item of category.products) {
            if (item.modifierGroups.length) {
              for (const group of item.modifierGroups) {
                modifierGroups.push(group);
              }
            }
          }
        }
      }
      meta.categoriesTotal = categoriesTotal;
      const groupIds = new Set();
      const uniqGroups = modifierGroups.filter(group => {
        if (groupIds.has(group.id)) return false;
        groupIds.add(group.id);
        modifiers += group.modifiers.length;
        return true;
      });
      meta.groupsModifiersTotal = uniqGroups.length;
      meta.modifiersTotal = modifiers;

      await this.setDataState(meta as Partial<ParserState['data']>);
      await this.setLog({ status: "success", title: "[Chibbis]:Check", value: "Получены метаданные" });
    } catch (e) {
      await this.setLog({ status: "danger", title: "[Chibbis]:Check", value: "Ошибка при обработке данных - " + e });
      throw e;
    }
  }

  async parseRest() {
    await this.setLog({ status: "warn", title: "[Chibbis]:Parse", value: "Парсинг данных..." });
    const categories = this.response?.menu;
    if (!Array.isArray(categories)) throw Error("Response menu is not an array");

    for (const category of categories) {
      if (category.name === "За баллы" || category.name === "Хиты продаж" || category.name === "Стоит попробовать") continue;
      this.categories.push({
        id: category.id,
        name: category.name,
        parent: 0,
      });

      if (Array.isArray(category.products)) {
        for (const item of category.products) {
          await this.getProductData(item, category.id);
          await this.setDataState({ products: this.products.length } as Partial<ParserState['data']>);
        }
      }

      await this.setDataState({ categories: this.categories.length } as Partial<ParserState['data']>);
      await this.setLog({ status: "success", title: "[Chibbis]:Parse", value: `Обработана категория ${category.name}` });
      await this.waitForNextStep();
    }
    await this.setLog({ status: "success", title: "[Chibbis]:Parse", value: "Обработка завершена!" });
  }

  async getProductData(product: ChibbisProductResp, categoryId: string) {
    const product_data: Product = {
      product_id: product.id,
      name: product.name,
      picture: product.imageUrls[0],
      description: product.description || '',
      price: [{
        id: product.id,
        price: product.price,
        index: this.getWeightData(product.weight),
      }],
      category: categoryId,
      modifiers: []
    };

    if (product.modifierGroups.length) {
      for (const group of product.modifierGroups) {
        this.getModifiers(product_data, group);
      }
    }

    this.products.push(product_data);
    if (this.products.length === 1) {
      await this.setDataState({ products: 1 } as Partial<ParserState['data']>);
      await this.setLog({ status: "success", title: "[Chibbis]:Parse", value: `Обработан первый товар ${product_data.name}` });
      await this.waitForNextStep();
    }
  }

  async getModifiers(product_data: Product, group: ChibbisModGroupResp) {
    const isDublicate = this.modifiers_groups.find(modGroup => modGroup.id === group.id);
    if (isDublicate) {
      product_data.modifiers?.push(group.id);
      return;
    };

    const group_modifiers: ModGroups = {
      id: group.id,
      name: group.name,
      type: 'one_one',
      required: group.required,
      minimum: group.minSelectedModifiers,
      maximum: group.maxSelectedModifiers,
      modifiers: [],
    };

    if (Array.isArray(group.modifiers)) {
      for (const mod of group.modifiers) {
        const modifier = {
          id: mod.id + (this.modifiers_groups.length + 1),
          name: mod.name,
          price: mod.price,
          group_id: group.id,
        };
        group_modifiers.modifiers.push(modifier);
        this.modifiers.push(modifier);
        await this.setDataState({ modifiers: this.modifiers.length } as Partial<ParserState['data']>);
        if (this.modifiers.length === 1) {
          await this.setLog({ status: "success", title: "[Chibbis]:Parse", value: `Обработан первый модификатор ${mod.name}` });
          await this.waitForNextStep();
        }
      };
    }

    this.modifiers_groups.push(group_modifiers);
    await this.setDataState({ groupsModifiers: this.modifiers_groups.length } as Partial<ParserState['data']>);
    if (this.modifiers_groups.length === 1) {
      await this.setLog({ status: "success", title: "[Chibbis]:Parse", value: `Обработана группа модификаторов ${group.name}` });
      await this.waitForNextStep();
    }
    product_data.modifiers?.push(group.id);
  }

  getWeightData(weight: ChibbisProductResp["weight"]) {
    if (!weight) return [1, 10];
    if (weight.value == 0 && weight.measure == 0) return [1, 10];
    return [
      weight.value ?? 1,
      weight.measure ?? 10
    ];
  }
}