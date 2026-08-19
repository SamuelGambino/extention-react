import browser from "webextension-polyfill";
import type { ParserConfig, ParserTabConfig } from "../globalTypes/parser_сonfig";
import type { ParserState } from "../globalTypes/parsing_state";

type StateUpdater = (state: ParserState) => ParserState | Promise<ParserState>;

let stateUpdateQueue: Promise<void> = Promise.resolve();

const getConfig = async (): Promise<ParserConfig> => {
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

export const updateState = async (updater: StateUpdater): Promise<ParserState> => {
  const update = stateUpdateQueue.then(async () => {
    const currentState = await getState();
    const nextState = await updater(currentState);
    await setState(nextState);
    return nextState;
  });

  stateUpdateQueue = update.then(
    () => undefined,
    () => undefined,
  );

  return update;
};

export const getToken = async (source: string): Promise<{ expiresAt: number, token: string }> => {
  const data = await browser.storage.local.get([source]);
  return data[source] as { expiresAt: number, token: string };
};

export const setToken = async (source: string, data: { expiresAt: number, token: string }) => {
  await browser.storage.local.set({ [source]: data });
};

export const setParsingState = async (isRunning: boolean) => {
  await updateState((state) => ({
    ...state,
    parsing: { ...state.parsing, isRunning },
  }));
};

export const setSource = async (source: string, type: ParserTabConfig["type"]) => {
  await updateState((state) => ({
    ...state,
    parsing: { ...state.parsing, source, type },
  }));
};
