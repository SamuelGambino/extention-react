import browser from "webextension-polyfill";
import type { StepAction } from "../../../globalTypes/parser_сonfig";

export async function executeAction(tabId: number, payload: StepAction): Promise<any> {
  try {
    const response = await browser.tabs.sendMessage(tabId, payload);

    return response;
  } catch (error: any) {
    throw error;
  }
}