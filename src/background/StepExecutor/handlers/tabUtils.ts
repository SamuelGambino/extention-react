import browser from "webextension-polyfill";

export async function waitForTabComplete(tabId: number, timeoutMs: number = 30000): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      browser.tabs.onUpdated.removeListener(listener);
      reject(new Error(`[Timeout] Вкладка ${tabId} не загрузилась за ${timeoutMs}мс`));
    }, timeoutMs);

    const listener = (updatedTabId: number, changeInfo: browser.Tabs.OnUpdatedChangeInfoType) => {
      if (updatedTabId === tabId && changeInfo.status === 'complete') {
        clearTimeout(timeoutId);
        browser.tabs.onUpdated.removeListener(listener);
        resolve();
      }
    };

    browser.tabs.onUpdated.addListener(listener);

    browser.tabs.get(tabId)
      .then((tab) => {
        if (tab.status === 'complete') {
          clearTimeout(timeoutId);
          browser.tabs.onUpdated.removeListener(listener);
          resolve();
        }
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        browser.tabs.onUpdated.removeListener(listener);
        reject(error);
      });
  });
}