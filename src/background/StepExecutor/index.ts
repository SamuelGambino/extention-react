import type { BackgroundToContentPayload, ContentResponse } from '../../globalTypes/messages';
import browser from "webextension-polyfill";

export class StepExecutor {
  static async execute<T = unknown>(tabId: number, payload: BackgroundToContentPayload): Promise<T> {
    await this.waitUntilContentReady(tabId);

    const response = await browser.tabs.sendMessage(tabId, payload) as ContentResponse<T>;
    if (response?.status === "error") throw new Error(response.message);

    return response?.data as T;
  }

  static async waitForTabComplete(tabId: number, timeoutMs: number = 10000): Promise<void> {
    return new Promise((resolve, reject) => {
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
        if (changeInfo.status === 'complete') {
          cleanup();
          resolve();
        }
      };

      browser.tabs.onUpdated.addListener(listener);
      browser.tabs.get(tabId)
        .then((tab) => {
          if (tab.status === 'complete') {
            cleanup();
            resolve();
          }
        })
        .catch((error) => {
          cleanup();
          reject(error);
        });
    });
  }

  static waitUntilContentReady = async (tabId: number) => {
    const sleep = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    for (let i = 0; i < 10; i++) {
      try {
        const result = await browser.tabs.sendMessage(tabId, { action: "PING" }) as { status: "READY" };
        if (result.status === "READY") return;
      } catch {
        // Content script may not be injected yet.
      }

      await sleep(50);
    }

    throw new Error("Контент-скрипт не ответил вовремя");
  }
}