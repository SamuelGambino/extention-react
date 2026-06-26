import { BaseParser } from "./BaseParser";
import type { ParserState } from "../../globalTypes/parsing_state";
import type { Product } from "../types/ExportTypes";
import type { PresetByApi } from "../../globalTypes/parser_сonfig";
import type { KuperResp } from "../types/KuperParserTypes";

export class Kuper extends BaseParser {
  private response: KuperResp | null = null;

  async checkAvailability() {
    await this.setLog({ status: "warn", title: "[Kuper]:Check", value: "Получение метаданных..." });

    try {
      await this.setLog({ status: "warn", title: "[Kuper]:Check", value: "Запрос на api..." });
      const configData = this.config.data as PresetByApi;
      const response = await fetch(configData.apiUrl);
      if (!response.ok) throw new Error('запрос к api не удался');
      this.response = await response.json();
    } catch (e) {
      await this.setLog({ status: "danger", title: "[Kuper]:Check", value: "Ошибка при запросе - " + e });
    }
    const meta = {
      categoriesTotal: this.response?.departments.length,
      productsTotal: 0,
    };
    this.response?.departments.forEach(cat => meta.productsTotal += cat.products.length);
    await this.setDataState(meta as Partial<ParserState['data']>);

    await this.setLog({ status: "success", title: "[Kuper]:Check", value: "Получены метаданные" });
  }

  async parseRest() {
  }
}