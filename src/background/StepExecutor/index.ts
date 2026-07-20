import type { IStep, StepAction } from '../../globalTypes/parser_сonfig';
import { executeAction } from './handlers/action';
import { waitForTabComplete, waitUntilContentReady } from './handlers/wait';
import browser from "webextension-polyfill";
// import { executeCollect, CollectPayload } from './handlers/collect';
// import { executeCondition, ConditionPayload } from './handlers/condition';

export class StepExecutor {
  static async execute(tabId: number, step: IStep): Promise<any> {

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

    switch (step.type) {
      case 'wait':
        await waitForTabComplete(tabId);
        await waitUntilContentReady(tabId);
        return;

      case 'action':
        return await executeAction(tabId, step as StepAction);

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