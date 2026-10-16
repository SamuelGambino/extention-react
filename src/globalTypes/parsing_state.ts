import type { LocalizedLog } from "../shared/i18n/logs";

type ParserState = {
  parsing: {
    isReady: boolean;
    message?: string;
    type?: PresertOptionsType;
    source?: string;
    isRunning: boolean;
    waitingForStep?: boolean;
  };
  data: {
    categories: number;
    categoriesTotal: number;
    products: number;
    productsTotal: number;
    groupsModifiers?: number;
    groupsModifiersTotal?: number;
    modifiers?: number;
    modifiersTotal?: number;
  };
  logs?: Log[];
};

interface LegacyLog {
  status: "success" | "warn" | "danger";
  title: string;
  value: string;
}

type Log = LocalizedLog | LegacyLog;

type PresertOptionsType = "custom" | "api" | "vk" | "yandex_eda" | "yandex_map" | "chibbis";

export type {
  ParserState,
  Log,
  LegacyLog,
};
