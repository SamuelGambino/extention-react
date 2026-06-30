import { BaseParser } from "./BaseParser";
import type { ParserState } from "../../globalTypes/parsing_state";
import type { ModGroups, Product } from "../types/ExportTypes";
import type { PresetByApi } from "../../globalTypes/parser_сonfig";
import type { KuperOptionsResp, KuperProductResp, KuperResp } from "../types/KuperParserTypes";
import { getState } from "../storage";
import browser from "webextension-polyfill";

export class Kuper extends BaseParser {
  private response: KuperResp | null = null;
  private reqOptions: { [k: string]: string; } | null = null;
  private meta = {
      categoriesTotal: 0,
      categories: 0,
      productsTotal: 0,
      products: 0,
      groupsModifiersTotal: 0,
      groupsModifiers: 0,
      modifiersTotal: 0,
      modifiers: 0
    };

  setupRequestRules = async () => {
    try {
      await browser.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [1],
        addRules: [{
          id: 1,
          priority: 1,
          action: {
            type: "modifyHeaders",
            requestHeaders: [
              { header: "origin", operation: "set", value: "https://kuper.ru" },
              { header: "referer", operation: "set", value: "https://kuper.ru/" }
            ]
          },
          condition: {
            urlFilter: "https://kuper.ru/api/*",
            resourceTypes: ["xmlhttprequest"]
          }
        }]
      });
      await this.setLog({ status: "success", title: "[Kuper]:Check", value: "Правила подмены заголовков успешно установлены!" });
    } catch (e) {
      await this.setLog({ status: "danger", title: "[Kuper]:Check", value: "Ошибка при установке правил подмены заголовков: " + e });
    }
  }

  async checkAvailability() {
    await this.setLog({ status: "warn", title: "[Kuper]:Check", value: "Получение метаданных..." });
    await this.setupRequestRules();

    try {
      await this.setLog({ status: "warn", title: "[Kuper]:Check", value: "Запрос на api..." });
      const configData = this.config.data as PresetByApi;
      const urlObject = new URL(configData.apiUrl);
      this.reqOptions = Object.fromEntries(urlObject.searchParams.entries());
      delete this.reqOptions.permalink;

      if (!this.reqOptions.store_id) throw new Error('В параметрах api ссылки не найден store_id');
      const response = await fetch(`https://kuper.ru/api/v3/stores/${this.reqOptions.store_id}/departments`, {
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Запрос к api не удался');
      const responseJson = await response.json() as KuperResp;
      if (!responseJson.departments.length) throw new Error('В ответе нет departments');
      this.response = responseJson;
    } catch (e) {
      await this.setLog({ status: "danger", title: "[Kuper]:Check", value: "Ошибка при запросе - " + e });
      this.stop();
    }
    this.meta.categoriesTotal = this.response?.departments.filter(cat => cat.name !== "Популярное").length ?? 0;

    this.response?.departments.forEach(cat => this.meta.productsTotal += cat.products.length);
    await this.setDataState(this.meta as Partial<ParserState['data']>);

    await this.setLog({ status: "success", title: "[Kuper]:Check", value: "Получены метаданные" });
  }

  async parseRest() {
    try {
      if (!this.response?.departments.length) throw new Error('В ответе нет departments');
      for (const category of this.response?.departments) {
        if (category.name === "Популярное") continue;
        this.categories.push({
          id: category.id,
          name: category.name,
          parent: 0,
        });
        for (const product of category.products) {
          await this.getProductData(product.slug, category.id);
        }
        await this.setDataState({ categories: this.categories.length } as Partial<ParserState['data']>);
        await this.setLog({ status: "success", title: "[Kuper]:Parse", value: `Обработана категория ${category.name}` });
        await this.waitForNextStep();
        await this.sleep(2000 + Math.floor(Math.random() * 1000));
      }
    } catch (e) {
      await this.setLog({ status: "danger", title: "[Kuper]:Parse", value: "Ошибка при запросе - " + e });
      this.stop();
    }
  }

  async getProductData(slug: string, catId: string) {
    await this.sleep(1500 + Math.floor(Math.random() * 1000));
    const reqParams = new URLSearchParams(this.reqOptions ?? { slug }).toString();
    const response = await fetch(`https://kuper.ru/api/v3/multicards?permalink=${slug}&${reqParams}`, {
      credentials: 'include'
    });

    if (!response.ok) throw new Error('Ошибка при получении данных товара');
    const productData = await response.json() as KuperProductResp;

    const product: Product = {
      product_id: productData.data.product.id,
      name: productData.data.product.name,
      picture: productData.data.product.images[0].original_url,
      description: productData.data.product.description,
      price: [{
        id: productData.data.product.offer.id,
        price: productData.data.product.offer.unit_price,
        proteins: undefined,
        fats: undefined,
        carbohydrates: undefined,
        calories: undefined,
        index: [productData.data.product.volume, this.getDescIndex(productData.data.product.volume_type)],
      }],
      category: catId,
      modifiers: [],
    }

    if (productData.data.product_properties) {
      for (const property of productData.data.product_properties) {
        if (property.name === "protein") product.price[0].proteins = Number(property.value.split(" ")[0]);
        if (property.name === "fat") product.price[0].fats = Number(property.value.split(" ")[0]);
        if (property.name === "carbohydrate") product.price[0].carbohydrates = Number(property.value.split(" ")[0]);
        if (property.name === "energy_value") product.price[0].calories = Number(property.value.split(" ")[0]);
      }
    }

    if (productData.data.product.offer.options.length) {
      this.meta.groupsModifiersTotal += productData.data.product.offer.options.length;
      await this.setDataState({ groupsModifiersTotal: this.meta.groupsModifiersTotal  } as Partial<ParserState['data']>);

      for (const option of productData.data.product.offer.options) {
        this.meta.modifiersTotal += option.items.length;
        await this.setDataState({ modifiersTotal: this.meta.modifiersTotal } as Partial<ParserState['data']>);
        this.getModifiersGroup(option);
        product.modifiers?.push(option.id);
        await this.setDataState({ groupsModifiers: this.modifiers_groups.length } as Partial<ParserState['data']>);
      }
    }
    this.products.push(product);
    if (this.products.length === 1) {
      await this.setLog({ status: "success", title: "[Kuper]:Parse", value: `Обработан первый товар ${product.name}` });
      await this.waitForNextStep();
    }
    await this.setDataState({ products: this.products.length } as Partial<ParserState['data']>);
  }

  async getModifiersGroup(options: KuperOptionsResp) {
    const group_modifiers: ModGroups = {
      id: options.id,
      name: options.title,
      type: 'one_one',
      required: false,
      minimum: options.min_items,
      maximum: options.max_items,
      modifiers: [],
    };

    if (options.min_items >= 1) group_modifiers.required = true;
    if (options.max_items === options.items.length) group_modifiers.type = 'all_one';
    if (options.max_items > options.items.length) group_modifiers.type = 'all_unlimited';
    if (options.max_items === 1) group_modifiers.type = 'one_one';
    if (options.max_items < options.items.length && options.max_items !== 1) group_modifiers.type = 'all_one';


    if (Array.isArray(options.items)) {
      for (const option of options.items) {
        const modifier = {
          id: options.id + option.sku,
          name: option.name,
          price: option.price,
          group_id: options.id,
        };
        group_modifiers.modifiers.push({ ...modifier });
        this.modifiers.push({ ...modifier });
        if (this.modifiers.length === 1) {
          await this.setLog({ status: "success", title: "[Kuper]:Parse", value: `Обработан первый модификатор ${modifier.name}` });
          await this.waitForNextStep();
        }
        await this.setDataState({ modifiers: this.modifiers.length } as Partial<ParserState['data']>);
      };
    }

    this.modifiers_groups.push({ ...group_modifiers });

    if (this.modifiers_groups.length === 1) {
      await this.setLog({ status: "success", title: "[Kuper]:Parse", value: `Обработана первая группа модификаторов ${group_modifiers.name}` });
      await this.waitForNextStep();
    }
  }

  getDescIndex(tag: string | undefined | null): number {
    if (!tag || tag === '') {
      return 10;
    } else {
      if (tag === 'g') {
        return 1;
      } else if (tag === 'kg') {
        return 2;
      }
    }

    return 10;
  }
}