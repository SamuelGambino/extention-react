import browser from "webextension-polyfill";
import { handleAction } from "./handlers/action";
import { handleCollect } from "./handlers/collect";
import { handleCondition } from "./handlers/condition";
import { createElementContexts, releaseElementContexts } from "./handlers/dom";
import { handleWait } from "./handlers/wait";
import type { BackgroundToContentPayload } from "../globalTypes/messages";

browser.runtime.onMessage.addListener(async (rawMessage: unknown) => {
  const messagePing = rawMessage as { action: "PING" };
  if (messagePing.action === "PING") {
    return { status: "READY" };
  }

  const message = rawMessage as BackgroundToContentPayload;
  if (!message.type) return { status: "error" as const, message: "Не указан тип задачи." };

  try {
    switch (message.type) {
      case "action":
        return await handleAction(message.step, message.context);

      case "collect":
        return handleCollect(message.step, message.context);

      case "condition":
        return handleCondition(message.step, message.context);

      case "wait":
        return await handleWait(message.step, message.context);

      case "loop-items":
        return {
          status: "success" as const,
          data: createElementContexts(message.selector, message.source, message.context),
        };

      case "release-context":
        releaseElementContexts(message.context);
        return { status: "success" as const };

      default:
        return { status: "error" as const, message: "Неизвестный тип шага." };
    }
  } catch (error: unknown) {
    console.error("[Content Script] Ошибка при выполнении задачи:", error);
    return { status: "error" as const, message: error instanceof Error ? error.message : String(error) };
  }
});
