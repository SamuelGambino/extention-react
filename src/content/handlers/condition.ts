import type { StepCondition } from "../../globalTypes/parser_сonfig";
import type { ContentStepContext } from "../content";
import { queryScopedElement } from "./dom";

export const handleCondition = (payload: StepCondition & { context?: ContentStepContext }) => {
  const isExists = Boolean(queryScopedElement(payload.params.selector, payload.context));

  return {
    status: 'success',
    matched: payload.params.exists ? isExists : !isExists,
  };
}
