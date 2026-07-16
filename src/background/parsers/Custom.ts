import browser from "webextension-polyfill";
import { BaseParser } from "./BaseParser";
import type { ParserState } from "../../globalTypes/parsing_state";
import type { PresetCustom } from "../../globalTypes/parser_сonfig";
import { StepExecutor } from "../StepExecutor";

export class Custom extends BaseParser {
  // Если в цикле есть действие получения данных категории/товара/группы/модификатора - количество перебираемых элементов циакла = метаданные + уже сохраненные
  private parseContext: { category: { id: string, name: string }, product: { id: string, name: string }, modifierGroup: { id: string, name: string } } | null = null;
  private tabId: number | undefined;

  async checkAvailability() { // Воспроизвести сценарий действий игнорируя действия получения данных, при этом в циклах выполнить только 1ю итерацию
    await this.setLog({ status: "warn", title: "[Custom]:Check", value: "Проверка работы сценария..." });
    await this.setDataState({
      categoriesTotal: 0,
      categories: 0,
      productsTotal: 0,
      products: 0,
      groupsModifiersTotal: 0,
      groupsModifiers: 0,
      modifiersTotal: 0,
      modifiers: 0
    });

    try {
      const tabs = await browser.tabs.query({
        active: true,
        currentWindow: true
      });

      const activeTab = tabs[0];

      if (!activeTab || activeTab.id === undefined) {
        await this.setLog({ status: "danger", title: "[Custom]:Check", value: "Не удалось найти активную вкладку" });
      }

      this.tabId = activeTab.id;
    } catch (error) {
      await this.setLog({ status: "danger", title: "[Custom]:Check", value: "Ошибка при получении активной вкладки:" + error });
      throw error;
    }

    const data = this.config.data as PresetCustom;

    try {
      for (const step of data.steps) {
        if (!this.tabId) throw new Error("tabId is undefined :(");

        switch (step.type) {
          case "wait":
            this.sleep(step.params.duration);
            return;

          case "action":
            const result = await StepExecutor.execute(this.tabId, step);
            if(result.status === "success") return;
            if(result.status !== "success") throw new Error('Ошибка при клике');
        }
      }
    } catch (e) {
      await this.setLog({ status: "danger", title: "[Custom]:Check", value: "Ошибка:" + e });
      this.stop();
    }

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
}