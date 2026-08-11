console.log("CONTENT LOADED", location.href);

import browser from "webextension-polyfill";
import type { IStep, StepAction, StepCollect, StepCondition, StepLoop, StepWait } from "../globalTypes/parser_сonfig";
import { handleAction } from "./handlers/action";
import { handleCollect } from "./handlers/collect";
import { handleCondition } from "./handlers/condition";
import { handleLoop } from "./handlers/loop";
import { queryScopedElement } from "./handlers/dom";

export interface ContentStepContext {
  loopStack: { selector: string; index: number }[];
}

type ContentStepMessage = IStep & { context?: ContentStepContext };

const waitForElement = async (selector: string, context?: ContentStepContext, timeoutMs = 10000) => {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    if (queryScopedElement(selector, context)) return { status: 'success' };
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  throw new Error(`Элемент по селектору "${selector}" не найден за ${timeoutMs}мс`);
}

browser.runtime.onMessage.addListener((rawMessage: unknown) => {
  const messagePing = rawMessage as { action: "PING" };
  if (messagePing.action === "PING") {
    return Promise.resolve({ status: "READY" });
  };
  
  const message = rawMessage as ContentStepMessage;
  if (!message.type) return;

  try {
    switch (message.type) {
      case 'action': {
        const result = handleAction(message as StepAction & { context?: ContentStepContext });
        return Promise.resolve(result);
      }

      case 'collect':
        return Promise.resolve(handleCollect(message as StepCollect & { context?: ContentStepContext }));

      case 'condition':
        return Promise.resolve(handleCondition(message as StepCondition & { context?: ContentStepContext }));

      case 'loop':
        return Promise.resolve(handleLoop(message as StepLoop & { context?: ContentStepContext }));

      case 'wait': {
        const waitStep = message as StepWait & { context?: ContentStepContext };
        if (waitStep.params.mode === 'element') return waitForElement(waitStep.params.selector, waitStep.context);
        return Promise.resolve({ status: 'success' });
      }

      default:
        return Promise.reject(new Error(`Неизвестный тип шага: ${message.type}`));
    }
  } catch (error: unknown) {
    console.error('[Content Script] Ошибка при выполнении задачи:', error);
    return Promise.resolve({ status: 'error', message: error instanceof Error ? error.message : String(error) });
  }
});
