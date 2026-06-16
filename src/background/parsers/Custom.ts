import browser from "webextension-polyfill";
import { BaseParser } from "./BaseParser";
import type { ParserState } from "../../popup/types/parsing_state";

export class Custom extends BaseParser {
  async checkAvailability() {
    await this.setLog({ status: "warn", title: "[Custom]:Check", value: "Получение метаданных..." });

    await this.setDataState({ categories: 0, products: 0 });

    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });

    await this.setLog({ status: "warn", title: "[Custom]:Check", value: "Отправлен запрос в content" });
    const response = await browser.tabs.sendMessage(tab.id!, {
      type: 'COUNT_ELEMENTS',
      config: this.config
    });


    await this.setDataState(response as Partial<ParserState['data']>);
    await this.setLog({ status: "success", title: "[Custom]:Check", value: "Получены метаданные" });
  }

  async parseRest() {
    // логика парсинга остальных категорий
    // для каждой категории:
    // await this.setParsingState({ step: 'parsing_category', currentCategory: 1 });
    await this.waitForNextStep();
  }

  async exportData() {
    await this.setLog({ status: "warn", title: "[Custom]:Export", value: "Экспорт данных..." });
    // логика экспорта
  }
}