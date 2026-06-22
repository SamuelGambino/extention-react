import browser from "webextension-polyfill";
import { getActualConfig, getState, setParsingState, setState } from "./storage";
import { Custom } from "./parsers/Custom";
import { Api } from "./parsers/Api";
import type { BaseParser, ParseMode } from "./parsers/BaseParser";
import type { ParserTabConfig } from "../globalTypes/parser_сonfig";
import { Vk } from "./parsers/Vk";
import { YandexEda } from "./parsers/YandexEda";
import { YandexMap } from "./parsers/YandexMap";
import { Chibbis } from "./parsers/Chibbis";
import { Exporter } from "./Exporter";

type PresetType = ParserTabConfig['type'];

const PARSER_MAP: Record<PresetType, new (config: ParserTabConfig, mode: ParseMode) => BaseParser> = {
  custom: Custom,
  api: Api,
  vk: Vk,
  yandex_eda: YandexEda,
  yandex_map: YandexMap,
  chibbis: Chibbis
};

let activeParser: BaseParser | null = null;

type RuntimeMessage = {
  action?: 'Check_state' | 'Parse' | 'Parse_by_steps' | 'Next_step' | 'Stop';
};

type RuntimeMessageResponse = {
  ok: boolean;
};

const clearLogs = async () => {
  const state = await getState();
  await setState({
    ...state,
    logs: [],
  });
}

const handleRuntimeMessage = async (rawMessage: unknown): Promise<RuntimeMessageResponse> => {
  const message = rawMessage as RuntimeMessage;

  if (!message.action) {
    return { ok: false };
  }

  const config = await getActualConfig();
  const exporter = new Exporter();

  if (message.action === 'Check_state') {
    await clearLogs();
    await setParsingState(true);
    const Parser = PARSER_MAP[config.type];
    activeParser = new Parser(config, 'check');
    await activeParser.run();
    await setParsingState(false);
    return { ok: true };
  }

  if (message.action === 'Parse') {
    await clearLogs();
    await setParsingState(true);
    const Parser = PARSER_MAP[config.type];

    activeParser = new Parser(config, 'parse');
    const result = await activeParser.run();
    if (!result) {
      const state = await getState();
      const logs = state.logs ?? [];
      await setState({
        ...state,
        parsing: { ...state.parsing, ...{ isRunning: false } },
        logs: [...logs, { status: "danger", title: "[Exporter]:Export", value: "Парсер вернул undefined" }],
      });
      return { ok: false };
    }
    await exporter.export(result, config);
    await setParsingState(false);
    return { ok: true };
  }

  if (message.action === 'Parse_by_steps') {
    await clearLogs();
    await setParsingState(true);
    const Parser = PARSER_MAP[config.type];
    activeParser = new Parser(config, 'steps');
    const result = await activeParser.run();
    if (!result) {
      const state = await getState();
      const logs = state.logs ?? [];
      await setState({
        ...state,
        parsing: { ...state.parsing, ...{ isRunning: false } },
        logs: [...logs, { status: "danger", title: "[Exporter]:Export", value: "Парсер вернул undefined" }],
      });
      return { ok: false };
    }

    await exporter.export(result, config);
    await setParsingState(false);
    return { ok: true };
  }

  if (message.action === 'Next_step') {
    activeParser?.resume();
    return { ok: true };
  }

  if (message.action === 'Stop') {
    await setParsingState(false);
    activeParser?.stop();
    activeParser = null;
    return { ok: true };
  }

  return { ok: false };
};

browser.runtime.onMessage.addListener((rawMessage: unknown) => {
  return handleRuntimeMessage(rawMessage);
});