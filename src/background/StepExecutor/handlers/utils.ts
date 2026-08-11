import browser from "webextension-polyfill";
import type { BackgroundToContentPayload } from "../../../globalTypes/messages";

export const sendMessage = async (tabId: number, payload: BackgroundToContentPayload): Promise<any> => {
  try {
    const response = await browser.tabs.sendMessage(tabId, payload);

    return response;
  } catch (error: any) {
    throw error;
  }
}