import browser from "webextension-polyfill";
import type { BackgroundToContentPayload } from "../../../globalTypes/messages";

export const sendMessage = async <TResponse = unknown>(
  tabId: number,
  payload: BackgroundToContentPayload,
): Promise<TResponse> => browser.tabs.sendMessage(tabId, payload) as Promise<TResponse>;