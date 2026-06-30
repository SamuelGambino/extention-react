import { BaseParser } from "./BaseParser";
import type { ParserState } from "../../globalTypes/parsing_state";
import type { Product } from "../types/ExportTypes";
import type { PresetByApi } from "../../globalTypes/parser_сonfig";
import type { SearchProperties, FlowwowCategoryResp, FlowwowProductsResp, FlowwowProductInfoResp } from "../types/FlowwowParserTypes";
import browser from "webextension-polyfill";

export class Flowwow extends BaseParser {
  private response: { categories: FlowwowCategoryResp[] } | null = null;
  private reqOptions: SearchProperties | null = null;

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
      await this.setLog({ status: "success", title: "[Flowwow]:Check", value: "Правила подмены заголовков успешно установлены!" });
    } catch (e) {
      await this.setLog({ status: "danger", title: "[Flowwow]:Check", value: "Ошибка при установке правил подмены заголовков: " + e });
    }
  }

  async checkAvailability() {
    await this.setLog({ status: "warn", title: "[Flowwow]:Check", value: "Получение метаданных..." });
    await this.setupRequestRules();

    try {
      await this.setLog({ status: "warn", title: "[Flowwow]:Check", value: "Запрос на api..." });
      const configData = this.config.data as PresetByApi;
      const urlObject = new URL(configData.apiUrl);
      
      const rawParams = Object.fromEntries(urlObject.searchParams.entries());
      this.reqOptions = JSON.parse(rawParams.property) as SearchProperties;

      if (!this.reqOptions.owner_shop_ids[0]) throw new Error('В параметрах api ссылки не найден owner_shop_ids[0]');
      const responseCategories = await fetch(`https://clientweb.flowwow.com/apiuser/shop/categories/?shopId=${this.reqOptions.owner_shop_ids[0]}&lang=ru`, {
        credentials: 'include'
      });

      if (!responseCategories.ok) throw new Error('Запрос к api не удался');
      const responseCategoriesJson = await responseCategories.json() as { data: FlowwowCategoryResp[] };
      if (!responseCategoriesJson.data.length) throw new Error('В ответе нет категорий');
      
      for (const cat of responseCategoriesJson.data) {
        let actualPage = 1;
        let hasMore = true;
        this.reqOptions.range_type_ids = [cat.id];
        cat.products ??= [];

        do {
          const params = new URLSearchParams({
            property: JSON.stringify(this.reqOptions),
            lang: "ru",
            currency: this.reqOptions.currency || "RUB",
            limit: "60",
            filters: "{}",
            page: String(actualPage),
          });

          const responseProducts = await fetch(
            `https://clientweb.flowwow.com/apiuser/products/search/?${params}`,
            {
              credentials: "include",
            }
          );

          if (!responseProducts.ok) throw new Error('Запрос к api не удался');
          const responseProductsJson = await responseProducts.json() as { data: FlowwowProductsResp };
          if (!responseProductsJson.data.items.length && responseProductsJson.data.total !== 0) throw new Error('В ответе нет товаров');
          if (responseProductsJson.data.total === 0) break;

          cat.products?.push(...responseProductsJson.data.items);

          hasMore = responseProductsJson.data.total !== cat.products.length;
          actualPage++;
        } while (hasMore);
      }

      this.response = { categories: responseCategoriesJson.data.filter(cat => cat.products && cat.products?.length > 0), ...this.response };
    } catch (e) {
      await this.setLog({ status: "danger", title: "[Flowwow]:Check", value: "Ошибка при запросе - " + e });
      this.stop();
    }

    const meta = {
      categoriesTotal: this.response?.categories.length || 0,
      categories: 0,
      productsTotal: 0,
      products: 0,
      groupsModifiersTotal: 0,
      groupsModifiers: 0,
      modifiersTotal: 0,
      modifiers: 0
    };
    this.response?.categories.forEach(cat => meta.productsTotal += cat.products?.length || 0);
    await this.setDataState(meta as Partial<ParserState['data']>);

    await this.setLog({ status: "success", title: "[Flowwow]:Check", value: "Получены метаданные" });
  }

  async parseRest() {
    try {
      if (!this.response?.categories.length) throw new Error('В ответе нет категорий');
      for (const category of this.response?.categories) {
        this.categories.push({
          id: category.id,
          name: category.name,
          parent: 0,
        });
        if (!category.products || !category?.products.length) throw new Error('В категории нет товаров');
        for (const product of category.products) {
          await this.getProductData(product, category.id);
        }
        await this.setDataState({ categories: this.categories.length } as Partial<ParserState['data']>);
        await this.setLog({ status: "success", title: "[Flowwow]:Parse", value: `Обработана категория ${category.name}` });
        await this.waitForNextStep();
        this.sleep(1000 + Math.floor(Math.random() * 500));
      }
    } catch (e) {
      await this.setLog({ status: "danger", title: "[Flowwow]:Parse", value: "Ошибка при запросе - " + e });
      this.stop();
    }
  }

  async getProductData(prod: { id: number, price: number }, catId: number) {
    this.sleep(1000 + Math.floor(Math.random() * 500));
    const reqParams = new URLSearchParams({
      id: prod.id.toString(),
      city_id: this.reqOptions?.city.toString() ?? "",
      lang: "ru",
      currency: this.reqOptions?.currency ?? "",
      locale: "ru"
    }).toString();
    const url = `https://clientweb.flowwow.com/apiuser/products/info/?${reqParams}`;

    const response = await fetch(url, {
      credentials: 'include'
    });

    if (!response.ok) throw new Error('Ошибка при получении данных товара');
    const productData = await response.json() as FlowwowProductInfoResp;

    const product: Product = {
      product_id: prod.id,
      name: productData.data.name,
      picture: productData.data.photo,
      description: this.getDescription(productData),
      price: [{
        id: prod.id,
        price: prod.price,
        index: [productData.data.size.height, 5],
      }],
      category: catId,
      modifiers: [],
    }

    this.products.push(product);
    if (this.products.length === 1) {
      await this.setLog({ status: "success", title: "[Flowwow]:Parse", value: `Обработан первый товар ${product.name}` });
      await this.waitForNextStep();
    }
    await this.setDataState({ products: this.products.length } as Partial<ParserState['data']>);
  }

  getDescription(productData: FlowwowProductInfoResp): string {
    if (productData.data.description.show !== "") {
      return productData.data.description.show + productData.data.description.hide;
    } else if (productData.data.rangeProperties.length) {
      let desc = "";
      for (const prop of productData.data.rangeProperties) {
        if (prop.type === "description") continue;
        let text = "";
        prop.items.forEach(item => text += `${item}, `);
        desc += `${prop.title}: ${text}\n`
      }
      return desc.trim();
    } else return "";
  }
}