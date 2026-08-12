import type { StepWait } from "../../globalTypes/parser_сonfig";
import type { ElementContext } from "../../globalTypes/messages";
import { queryElement } from "./dom";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const handleWait = async (payload: StepWait, context?: ElementContext) => {
  if (payload.params.mode !== "element") return { status: "success" as const };

  const started = Date.now();
  while (Date.now() - started < 10000) {
    if (queryElement(payload.params.selector, payload.params.source, context)) return { status: "success" as const };
    await sleep(100);
  }

  throw new Error(`Элемент по селектору "${payload.params.selector}" не найден за 10000мс.`);
}