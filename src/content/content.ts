import browser from "webextension-polyfill";
import type { IStep, StepAction } from "../globalTypes/parser_сonfig";
import { handleAction } from "./handlers/action";

browser.runtime.onMessage.addListener((rawMessage: any) => {
  const messagePing = rawMessage as { action: "PING" };
  if (messagePing.action === "PING") {
    return Promise.resolve({ status: "READY" });
  };
  
  const message = rawMessage as IStep;
  if (!message.type) return;

  try {
    switch (message.type) {
      case 'action': {
        const result = handleAction(message as StepAction);
        return Promise.resolve(result);
      }

      case 'collect':
        // Здесь будет логика сбора данныхы
        return Promise.reject(new Error('Модуль collect еще не реализован в контент-скрипте'));

      case 'condition':
        // Здесь будет проверка условий (например, есть ли элемент на странице)
        return Promise.reject(new Error('Модуль condition еще не реализован в контент-скрипте'));

      default:
        return Promise.reject(new Error(`Неизвестный тип шага: ${message.type}`));
    }
  } catch (error: any) {
    console.error('[Content Script] Ошибка при выполнении задачи:', error);
    // Возвращаем ошибку в background, чтобы там сработал блок catch
    return Promise.resolve({ status: 'error', message: error.message });
  }
});