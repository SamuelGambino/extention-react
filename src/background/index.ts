import browser from "webextension-polyfill";
import { getActualConfig, getState, setState } from "./storage";
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

browser.runtime.onMessage.addListener((message: any) => {
  (async () => {
    const config = await getActualConfig();
    const exporter = new Exporter();


    if (message.action === 'Check_state') {
      const Parser = PARSER_MAP[config.type];
      activeParser = new Parser(config, 'check');
      await activeParser.run();
    }

    if (message.action === 'Parse') {
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
        return;
      };
      exporter.export(result, config);
    }

    if (message.action === 'Parse_by_steps') {
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
        return;
      };
      exporter.export(result, config);
    }

    if (message.action === 'Next_step') {
      activeParser?.resume();
    }

    if (message.action === 'Stop') {
      activeParser?.stop();
      activeParser = null;
    }
  })();

  return true;
});