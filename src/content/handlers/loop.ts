import type { StepLoop } from "../../globalTypes/parser_сonfig";
import type { ContentStepContext } from "../content";
import { queryScopedElements } from "./dom";

export const handleLoop = (payload: Pick<StepLoop, 'params'> & { context?: ContentStepContext }) => {
  return {
    status: 'success',
    count: queryScopedElements(payload.params.source, payload.context).length,
  };
}
