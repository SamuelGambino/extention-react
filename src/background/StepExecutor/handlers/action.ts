import browser from "webextension-polyfill";
import type { StepAction } from "../../../globalTypes/parser_сonfig";
import type { StepExecutionContext } from "..";

export async function executeAction(tabId: number, payload: StepAction, context: StepExecutionContext): Promise<unknown> {
  return await browser.tabs.sendMessage(tabId, { ...payload, context });
}
