import browser from "webextension-polyfill";
import { getActualConfig } from "./storage";
import { Custom } from "./parsers/Custom";
import { Api } from "./parsers/Api";
import type { BaseParser, ParseMode } from "./parsers/BaseParser";
import type { ParserTabConfig } from "../popup/types/parser_сonfig";
import { Vk } from "./parsers/Vk";
import { YandexEda } from "./parsers/YandexEda";
import { YandexMap } from "./parsers/YandexMap";
import { Chibbis } from "./parsers/Chibbis";

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

browser.runtime.onMessage.addListener((message: any, sender, sendResponse) => {
  (async () => {
    const config = await getActualConfig();

    if (message.action === 'Check_state') {
      const Parser = PARSER_MAP[config.type];
      activeParser = new Parser(config, 'check');
      await activeParser.run();
    }

    if (message.action === 'Parse') {
      const Parser = PARSER_MAP[config.type];

      activeParser = new Parser(config, 'parse');
      await activeParser.run();
    }

    if (message.action === 'Parse_by_steps') {
      const Parser = PARSER_MAP[config.type];
      activeParser = new Parser(config, 'steps');
      await activeParser.run();
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