import browser from "webextension-polyfill";

export const waitForTabComplete = async (tabId: number, timeoutMs: number = 10000): Promise<void> => {
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

export const waitUntilContentReady = async (tabId: number) => {
  const sleep = async (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  while (true) {
    try {
      const result = await browser.tabs.sendMessage(tabId, {
        action: "PING"
      }) as { status: "READY" };

      if (result.status === "READY") return;
    } catch {
      // Content script can be unavailable while the tab is loading.
    }

    await sleep(100);
  }
}