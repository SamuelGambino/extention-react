import browser from "webextension-polyfill";

export const waitForTabComplete = async (tabId: number, timeoutMs: number = 10000): Promise<void> => {
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

export const waitUntilContentReady = async (tabId: number) => {
  const sleep = async (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  while (true) {
    try {
      const result = await browser.tabs.sendMessage(tabId, {
        action: "PING"
      }) as { status: "READY" };

      if (result.status === "READY") {
        console.log("Content say READY!");
        return;
      }
    } catch { }

    await sleep(100);
  }
}