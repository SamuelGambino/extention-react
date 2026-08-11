import type { BackgroundToContentPayload } from '../../globalTypes/messages';
import { sendMessage } from './handlers/utils';
import browser from "webextension-polyfill";
// import { executeCollect, CollectPayload } from './handlers/collect';
// import { executeCondition, ConditionPayload } from './handlers/condition';

export class StepExecutor {
  static async execute(tabId: number, payload: BackgroundToContentPayload): Promise<any> {

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
        // await this.waitForTabComplete(tabId);
        // await this.waitUntilContentReady(tabId);
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

  async waitForTabComplete(tabId: number, timeoutMs: number = 10000): Promise<void> {
    return new Promise((resolve, reject) => {
      let isNavigating = false;

      const timeoutId = setTimeout(() => {
        cleanup();
        reject(new Error(`[Timeout] Вкладка ${tabId} не загрузилась за ${timeoutMs}мс`));
      }, timeoutMs);

      const cleanup = () => {
        clearTimeout(timeoutId);
        browser.tabs.onUpdated.removeListener(listener);
      };

      const listener = (updatedTabId: number, changeInfo: browser.Tabs.OnUpdatedChangeInfoType) => {
        if (updatedTabId !== tabId) return;

        // Фиксируем, что вкладка ушла на перезагрузку
        if (changeInfo.status === 'loading') {
          isNavigating = true;
        }

        // Разрешаем промис только если мы видели этап загрузки, либо если статус complete
        if (changeInfo.status === 'complete') {
          cleanup();
          resolve();
        }
      };

      browser.tabs.onUpdated.addListener(listener);

      // Принудительно проверяем текущий статус. 
      // Если вкладка УЖЕ в состоянии loading, значит мы успели вовремя.
      browser.tabs.get(tabId)
        .then((tab) => {
          if (tab.status === 'loading') {
            isNavigating = true;
          }
        })
        .catch((error) => {
          cleanup();
          reject(error);
        });
    });
  }

  waitUntilContentReady = async (tabId: number) => {
    const sleep = async (ms: number) => {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    while (true) {
      try {
        const result = await browser.tabs.sendMessage(tabId, {
          action: "PING"
        }) as { status: "READY" };

        if (result.status === "READY") return;
      } catch { }

      await sleep(100);
    }
  }
}