import { BaseParser } from "./BaseParser";
import type { ParserState } from "../../globalTypes/parsing_state";
import type { WhatsAppRespCategories, WhatsAppRespProducts, WhatsAppPayloadCatalogs, WhatsAppNomenclature, WhatsAppPayloadProducts } from "../types/WhatsAppParserTypes";
import type { PresetWhatsApp } from "../../globalTypes/parser_сonfig";
import type { ModGroups, Product } from "../types/ExportTypes";

export class WhatsApp extends BaseParser {
  private fullNomenclature: WhatsAppNomenclature | null = null;
  private inputPayloadCatalogs: WhatsAppPayloadCatalogs | null = null;
  private inputPayloadProducts: WhatsAppPayloadProducts | null = null;

  async checkAvailability() {
    await this.setLog({ status: "warn", title: "[WhatsApp]:Check", value: "Получение метаданных..." });
    const payloadRaw = this.config.data as PresetWhatsApp;
    this.inputPayloadCatalogs = JSON.parse(payloadRaw.paylodCatalogs);
    this.inputPayloadProducts = JSON.parse(payloadRaw.paylodProducts);

    try {
      await this.setLog({ status: "warn", title: "[WhatsApp]:Check", value: "Запрос к api..." });
      const resp = await fetch("https://graph.whatsapp.com/graphql/catalog", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.inputPayloadCatalogs),
      });
      if (!resp.ok) {
        throw new Error(`HTTP error ${resp.status}: ${resp.statusText}`);
      }
      const response = await resp.json() as WhatsAppRespCategories;
      if (!response || !Array.isArray(response.data.xwa_product_catalog_get_collections.collections)) {
        throw new Error("Api вернул не то, что ожидалось, проверьте актуальность модуля или корректность данных в input поле");
      } else {
        this.fullNomenclature = response.data.xwa_product_catalog_get_collections;
      }
    } catch (e) {
      await this.setLog({ status: "danger", title: "[WhatsApp]:Check", value: "Ошибка  при запросе - " + e });
    }

    await this.setLog({ status: "warn", title: "[WhatsApp]:Check", value: "Запросы к api для получения товаров..." });
    if (!this.fullNomenclature?.collections) return;
    for (const category of this.fullNomenclature?.collections) {
      this.sleep(1000);
      try {
        const resp = await fetch("https://graph.whatsapp.com/graphql/catalog", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...this.inputPayloadProducts,
            variables: {
              request: {
                collection: {
                  biz_jid: this.inputPayloadProducts?.variables.request.collection.biz_jid,
                  id: category.id,
                  limit: "100",
                  width: "100",
                  height: "100",
                  variant_thumbnail_height: null,
                  variant_thumbnail_width: null
                }
              }
            }
          }),
        });
        if (!resp.ok) {
          throw new Error(`HTTP error ${resp.status}: ${resp.statusText}`);
        }
        const response = await resp.json() as WhatsAppRespProducts;
        if (!response || !Array.isArray(response.data.xwa_product_catalog_get_single_collection.collection.products)) {
          throw new Error("Api вернул не то, что ожидалось, проверьте актуальность модуля или корректность данных в input поле");
        } else {
          category.products = response.data.xwa_product_catalog_get_single_collection.collection.products;
        }
      } catch (e) {
        await this.setLog({ status: "danger", title: "[WhatsApp]:Check", value: "Ошибка  при запросе - " + e });
      }
    }

    await this.setLog({ status: "warn", title: "[WhatsApp]:Check", value: "Обработка ответа..." });
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
      const categories = this.fullNomenclature?.collections;
      if (!Array.isArray(categories)) throw Error("Response collections is not an array");

      for (const category of categories) {
        if (Array.isArray(category.products)) {
          meta.productsTotal += category.products.length;
        }
      }
      meta.categoriesTotal = categories.length;

      await this.setDataState(meta as Partial<ParserState['data']>);
      await this.setLog({ status: "success", title: "[WhatsApp]:Check", value: "Получены метаданные" });
    } catch (e) {
      await this.setLog({ status: "danger", title: "[WhatsApp]:Check", value: "Ошибка при обработке данных - " + e });
      throw e;
    }
  }

  async parseRest() {
    await this.setLog({ status: "warn", title: "[WhatsApp]:Parse", value: "Парсинг данных..." });
    const categories = this.fullNomenclature?.collections;
    if (!Array.isArray(categories)) throw Error("Response menu is not an array");

    for (const category of categories) {
      this.categories.push({
        id: category.id,
        name: category.name,
        parent: 0,
      });

      if (Array.isArray(category.products)) {
        for (const item of category.products) {
          const product_data: Product = {
            product_id: item.id,
            name: item.name,
            picture: '',
            description: item.description || '',
            price: [{
              id: item.id,
              price: item.price / 1000,
              index: [1, 10],
            }],
            category: category.id,
            modifiers: []
          };

          this.products.push(product_data);
          if (this.products.length === 1) {
            await this.setDataState({ products: 1 } as Partial<ParserState['data']>);
            await this.setLog({ status: "success", title: "[WhatsApp]:Parse", value: `Обработан первый товар ${product_data.name}` });
            await this.waitForNextStep();
          }
          await this.setDataState({ products: this.products.length } as Partial<ParserState['data']>);
        }
      }

      await this.setDataState({ categories: this.categories.length } as Partial<ParserState['data']>);
      await this.setLog({ status: "success", title: "[WhatsApp]:Parse", value: `Обработана категория ${category.name}` });
      await this.waitForNextStep();
    }
    await this.setLog({ status: "success", title: "[WhatsApp]:Parse", value: "Обработка завершена!" });
  }
}