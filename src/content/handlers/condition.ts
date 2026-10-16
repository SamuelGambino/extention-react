import type { StepCondition } from "../../globalTypes/parser_сonfig";
import type { ElementContext } from "../../globalTypes/messages";
import { queryElement } from "./dom";

export const handleCondition = (payload: StepCondition, context?: ElementContext) => {
  const { selector, source, exists } = payload.params;
  const found = Boolean(queryElement(selector, source, context));
  return { status: "success" as const, data: found === exists };
}