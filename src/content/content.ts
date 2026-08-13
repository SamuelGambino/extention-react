import browser from "webextension-polyfill";
import { handleAction } from "./handlers/action";
import { handleCollect } from "./handlers/collect";
import { handleCondition } from "./handlers/condition";
import { queryElementsCount } from "./handlers/dom";
import { handleWait } from "./handlers/wait";
import type { BackgroundToContentPayload } from "../globalTypes/messages";

browser.runtime.onMessage.addListener((rawMessage: unknown) => {
  const messagePing = rawMessage as { action: "PING" };
  if (messagePing.action === "PING") {
    return Promise.resolve({ status: "READY" });
  };

  const message = rawMessage as BackgroundToContentPayload;
  if (!message.type) return;

  try {
    switch (message.type) {
      case 'action':
        return Promise.resolve(handleAction(message.step, message.context));

      case 'collect':
        return Promise.resolve(handleCollect(message.step, message.context));

      case 'condition':
        return Promise.resolve(handleCondition(message.step, message.context));

      case 'wait':
        return handleWait(message.step, message.context);

      case 'loop-items':
        return Promise.resolve({
          status: "success",
          data: queryElementsCount(message.selector, message.source, message.context),
        });

      default:
        return Promise.reject(new Error(`Неизвестный тип шага`));
    }
  } catch (error: unknown) {
    console.error('[Content Script] Ошибка при выполнении задачи:', error);
    return Promise.resolve({ status: 'error', message: error instanceof Error ? error.message : String(error) });
  }
});