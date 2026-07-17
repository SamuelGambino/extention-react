import browser from "webextension-polyfill";
import type { IStep, StepAction } from "../globalTypes/parser_сonfig";
import { handleAction } from "./handlers/action";

interface ExtensionMessage {
  module: 'action' | 'collect' | 'condition';
  data: IStep;
}

browser.runtime.onMessage.addListener((rawMessage: any) => {
  const message = rawMessage as ExtensionMessage;
  console.log('[Content Script] Получено сообщение:', message);

  try {
    switch (message.module) {
      case 'action': {
        const result = handleAction(message.data as StepAction);
        // Возвращаем успешный ответ обратно в background
        return Promise.resolve(result);
      }

      case 'collect':
        // Здесь будет логика сбора данных
        return Promise.reject(new Error('Модуль collect еще не реализован в контент-скрипте'));

      case 'condition':
        // Здесь будет проверка условий (например, есть ли элемент на странице)
        return Promise.reject(new Error('Модуль condition еще не реализован в контент-скрипте'));

      default:
        return Promise.reject(new Error(`Неизвестный модуль: ${message.module}`));
    }
  } catch (error: any) {
    console.error('[Content Script] Ошибка при выполнении задачи:', error);
    // Возвращаем ошибку в background, чтобы там сработал блок catch
    return Promise.resolve({ status: 'error', message: error.message });
  }
});