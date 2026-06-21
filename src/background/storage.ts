import browser from "webextension-polyfill";
import type { ParserConfig } from "../globalTypes/parser_сonfig";
import type { ParserState } from "../globalTypes/parsing_state";

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

export const getToken = async (source: string): Promise<{expiresAt: number, token: string}> => {
  const data = await browser.storage.local.get([source]);
  return data[source] as {expiresAt: number, token: string};
};

export const setToken = async (source: string, data: {expiresAt: number, token: string}) => {
  await browser.storage.local.set({ [source]: data });
};