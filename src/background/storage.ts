import browser from "webextension-polyfill";
import type { ParserConfig } from "../popup/types/parser_сonfig";
import type { ParserState } from "../popup/types/parsing_state";

export const getConfig = async (): Promise<ParserConfig> => {
  const data = await browser.storage.local.get("parser_config");
  return data["parser_config"] as ParserConfig;
};

export const getActualConfig = async () => {
  const config = await getConfig();
  if (config.actualTab) {
    return config.tabs.find((tab) => tab.tabId === config.actualTab) ?? config.tabs[0];
  }
  return config.tabs[0];
};

export const getState = async (): Promise<ParserState> => {
  const data = await browser.storage.local.get("parser_state");
  return data["parser_state"] as ParserState;
};

export const setState = async (state: ParserState) => {
  await browser.storage.local.set({ parser_state: state });
};