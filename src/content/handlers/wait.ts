import type { StepWait } from "../../globalTypes/parser_сonfig";
import type { ElementContext } from "../../globalTypes/messages";
import { waitForElement } from "./dom";

export const handleWait = async (payload: StepWait, context?: ElementContext) => {
  if (payload.params.mode !== "element") return { status: "success" as const };

  await waitForElement(payload.params.selector, payload.params.source, context);
  return { status: "success" as const };
}
