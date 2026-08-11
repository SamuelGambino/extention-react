import browser from "webextension-polyfill";
import { BaseParser } from "./BaseParser";
import type { ParserState } from "../../globalTypes/parsing_state";
import type { PresetCustom } from "../../globalTypes/parser_сonfig";
import { StepExecutor } from "../StepExecutor";
import type { BackgroundToContentPayload } from "../../globalTypes/messages";

export class Custom extends BaseParser {
  // Если в цикле есть действие получения данных категории/товара/группы/модификатора - количество перебираемых элементов циакла = метаданные + уже сохраненные
  // принадлежность сущностей: каетгория -> товар -> группа модификаторов -> модификатор
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
            if (step.params.mode === "timeout") await this.sleep(step.params.duration);
            // if (step.params.mode === "element") this.sleep(step.params.duration);
            // if (step.params.mode === "navigation") await StepExecutor.execute(this.tabId, step);
            break;

          case "action":
            // const result = await StepExecutor.execute(this.tabId, step);
            // if (result.status === "success") break;
            // if (result.status !== "success") throw new Error('Ошибка при клике');
        }
      }
    } catch (e) {
      await this.setLog({ status: "danger", title: "[Custom]:Check", value: "Ошибка:" + e });
      this.stop();
    }
    await this.setLog({ status: "success", title: "[Custom]:Check", value: "Получены метаданные" });
  }

  async parseRest() {
    // логика парсинга остальных категорий
    // для каждой категории:
    // await this.setParsingState({ step: 'parsing_category', currentCategory: 1 });
    await this.waitForNextStep();
  }

  async execute(tabId: number, payload: BackgroundToContentPayload): Promise<any> {

    let isReady = false;
    for (let i = 0; i < 10; i++) { // 10 попыток с паузой
      try {
        await browser.tabs.sendMessage(tabId, { action: "PING" });
        isReady = true;
        break; // Если ответил — выходим из цикла
      } catch {
        // Если упало с ошибкой "Receiving end does not exist", ждем 50мс и повторяем
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    }

    if (!isReady) {
      throw new Error("Контент-скрипт не ответил вовремя");
    }

    switch (payload.data.step) {
      case 'wait':
        // await waitForTabComplete(tabId);
        // await waitUntilContentReady(tabId);
        return;

      case 'action':
        // const resp = await sendMessage(tabId, {
        //   source: {
        //     selector: data.
        //   }
        // });
        return;

      case 'collect':
        // return await executeCollect(tabId, step.payload as CollectPayload);
        throw new Error('Модуль collect еще не реализован');

      case 'condition':
        // return await executeCondition(tabId, step.payload as ConditionPayload);
        throw new Error('Модуль condition еще не реализован');

      case 'loop':
        // Логика циклов может обрабатываться здесь же, рекурсивно вызывая execute
        throw new Error('Модуль loop еще не реализован');

      default:
        throw new Error(`[StepExecutor] Неизвестный тип шага`);
    }
  }
}