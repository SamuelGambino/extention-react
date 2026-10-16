import type { LogPhase, ParserName } from "./terms";

export const logMessagesRu = {
  metadataLoading: "Получение метаданных…",
  apiRequest: "Запрос к API…",
  productApiRequest: "Запросы к API для получения товаров…",
  responseProcessing: "Обработка ответа…",
  metadataReceived: "Метаданные получены.",
  parsingStarted: "Парсинг данных…",
  parsingCompleted: "Обработка завершена.",
  scenarioChecking: "Проверка работы сценария…",
  scenarioAvailable: "Сценарий доступен.",
  categoryProcessed: "Обработана категория «{{name}}».",
  firstProductProcessed: "Обработан первый товар «{{name}}».",
  modifierProcessed: "Обработан первый модификатор «{{name}}».",
  modifierGroupProcessed: "Обработана первая группа модификаторов «{{name}}».",
  headerRulesConfigured: "Правила подмены заголовков успешно установлены.",
  authStarting: "Авторизация в VK…",
  tokenValid: "Токен действителен ещё {{time}}.",
  tokenInvalid: "Токен недействителен, повторная авторизация…",
  authTabOpening: "Открытие вкладки авторизации…",
  tokenReceived: "Токен получен.",
  categoriesProcessed: "Категории обработаны.",
  allProductsProcessed: "Все товары обработаны.",
  categoryProductsProcessed: "Товары по категориям обработаны.",
  parserReturnedUndefined: "Парсер не вернул данные для выгрузки.",
  requestFailed: "Не удалось выполнить запрос.",
  categoriesRequestFailed: "Не удалось получить категории.",
  productsRequestFailed: "Не удалось получить товары.",
  responseProcessingFailed: "Не удалось обработать ответ сайта.",
  headerRulesFailed: "Не удалось настроить правила подмены заголовков.",
  authorizationFailed: "Не удалось выполнить авторизацию.",
  categoriesProcessingFailed: "Не удалось обработать категории.",
  productsProcessingFailed: "Не удалось обработать товары.",
  categoryProductsProcessingFailed: "Не удалось обработать товары по категориям.",
  scenarioCheckFailed: "Проверка сценария завершилась ошибкой.",
  scenarioParseFailed: "Выполнение сценария завершилось ошибкой.",
  parserFailed: "Выполнение парсера завершилось ошибкой.",
} as const;

export type LogMessageKey = keyof typeof logMessagesRu;
export type LogParams = Record<string, string | number>;
export type LogStatus = "success" | "warn" | "danger";

export interface LocalizedLog {
  status: LogStatus;
  scope: {
    parser: ParserName;
    phase?: LogPhase;
  };
  messageKey: LogMessageKey;
  params?: LogParams;
  technical?: {
    source?: "background" | "content" | "network" | "exporter";
    name?: string;
    message?: string;
    stack?: string;
  };
}

export const createLog = (
  status: LogStatus,
  parser: ParserName,
  phase: LogPhase | undefined,
  messageKey: LogMessageKey,
  params?: LogParams,
  technical?: LocalizedLog["technical"],
): LocalizedLog => ({
  status,
  scope: { parser, phase },
  messageKey,
  ...(params ? { params } : {}),
  ...(technical ? { technical } : {}),
});

export const isLocalizedLog = (log: unknown): log is LocalizedLog => {
  return Boolean(log && typeof log === "object" && "messageKey" in log && "scope" in log);
};

const interpolate = (message: string, params: LogParams = {}): string => {
  return message.replace(/{{(\w+)}}/g, (_, name: string) => String(params[name] ?? `{{${name}}}`));
};

export const formatLogMessage = (log: LocalizedLog): string => {
  return interpolate(logMessagesRu[log.messageKey], log.params);
};

export interface LegacyLogInput {
  status: LogStatus;
  title: string;
  value: string;
}

export type LogInput = LocalizedLog | LegacyLogInput;

const LEGACY_SCOPE_PARSERS: Record<string, ParserName> = {
  Custom: "custom",
  VK: "vk",
  Yandex: "yandex",
  Chibbis: "chibbis",
  WhatsApp: "whatsapp",
  Kuper: "kuper",
  Flowwow: "flowwow",
  BaseParser: "base",
  Exporter: "exporter",
};

const LEGACY_SCOPE_PHASES: Record<string, LogPhase> = {
  Check: "check",
  Parse: "parse",
  Auth: "auth",
  Export: "export",
};

const LEGACY_EXACT_MESSAGES: Record<string, LogMessageKey> = {
  "Получение метаданных...": "metadataLoading",
  "Запрос к api...": "apiRequest",
  "Запрос на api...": "apiRequest",
  "Запросы к api для получения товаров...": "productApiRequest",
  "Обработка ответа...": "responseProcessing",
  "Получены метаданные": "metadataReceived",
  "Парсинг данных...": "parsingStarted",
  "Обработка завершена!": "parsingCompleted",
  "Парсинг завершен": "parsingCompleted",
  "Проверка работы сценария...": "scenarioChecking",
  "Сценарий доступен": "scenarioAvailable",
  "Правила подмены заголовков успешно установлены!": "headerRulesConfigured",
  "Авторизация в ВК...": "authStarting",
  "Токен не валиден, повторная авторизация...": "tokenInvalid",
  "Открытие вкладки авторизации...": "authTabOpening",
  "Получен токен": "tokenReceived",
  "Обработаны категории": "categoriesProcessed",
  "Обработаны все товары": "allProductsProcessed",
  "Обработаны товары по категориям": "categoryProductsProcessed",
  "Парсер вернул undefined": "parserReturnedUndefined",
};

const resolveLegacyScope = (title: string): LocalizedLog["scope"] => {
  const match = title.match(/^\[([^\]]+)\](?::(.+))?$/);
  const parser = match ? LEGACY_SCOPE_PARSERS[match[1]] : undefined;
  const phase = match?.[2] ? LEGACY_SCOPE_PHASES[match[2]] : undefined;

  return { parser: parser ?? "base", phase };
};

const resolveLegacyMessage = (value: string): Pick<LocalizedLog, "messageKey" | "params" | "technical"> => {
  const exactMessage = LEGACY_EXACT_MESSAGES[value];
  if (exactMessage) return { messageKey: exactMessage };

  const category = value.match(/^Обработана категория (.+)$/);
  if (category) return { messageKey: "categoryProcessed", params: { name: category[1] } };

  const product = value.match(/^Обработан первый товар (.+)$/);
  if (product) return { messageKey: "firstProductProcessed", params: { name: product[1] } };

  const modifier = value.match(/^Обработан(?:а)? первый модификатор (.+)$/);
  if (modifier) return { messageKey: "modifierProcessed", params: { name: modifier[1] } };

  const modifierGroup = value.match(/^Обработана (?:первая )?группа модификаторов (.+)$/);
  if (modifierGroup) return { messageKey: "modifierGroupProcessed", params: { name: modifierGroup[1] } };

  const tokenTime = value.match(/^Токен валиден еще (.+)$/);
  if (tokenTime) return { messageKey: "tokenValid", params: { time: tokenTime[1] } };

  const technical = { source: "background" as const, message: value };
  if (/подмены заголовков/i.test(value)) return { messageKey: "headerRulesFailed", technical };
  if (/авторизац/i.test(value)) return { messageKey: "authorizationFailed", technical };
  if (/товар.*категор/i.test(value)) return { messageKey: "categoryProductsProcessingFailed", technical };
  if (/обработк.*категор/i.test(value)) return { messageKey: "categoriesProcessingFailed", technical };
  if (/обработк.*товар/i.test(value)) return { messageKey: "productsProcessingFailed", technical };
  if (/обработк/i.test(value)) return { messageKey: "responseProcessingFailed", technical };
  if (/запрос|api|HTTP/i.test(value)) return { messageKey: "requestFailed", technical };
  if (/ошиб|error/i.test(value)) return { messageKey: "parserFailed", technical };

  return { messageKey: "parserFailed", technical };
};

// LegacyLogInput поддерживается только для уже существующих пресетов и ранее
// сохранённого parser_state. Новый код должен использовать createLog().
export const normalizeLog = (log: LogInput): LocalizedLog => {
  if (isLocalizedLog(log)) return log;

  return {
    status: log.status,
    scope: resolveLegacyScope(log.title),
    ...resolveLegacyMessage(log.value),
  };
};

export const createTechnicalDetails = (
  error: unknown,
  source: NonNullable<LocalizedLog["technical"]>["source"] = "background",
): NonNullable<LocalizedLog["technical"]> => {
  if (error instanceof Error) {
    return {
      source,
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return {
    source,
    message: String(error),
  };
};
