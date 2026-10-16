import ru from "../src/popup/i18n/ru.ts";
import { getLocale, setLocale, t } from "../src/popup/i18n/index.ts";
import { formatLogMessage, normalizeLog } from "../src/shared/i18n/logs.ts";
import { formatLogScope, terms } from "../src/shared/i18n/terms.ts";

const assert = (condition: unknown, message: string): asserts condition => {
  if (!condition) throw new Error(message);
};

const assertDictionaryLeaves = (value: unknown, path = "ru") => {
  if (typeof value === "string") {
    assert(value.trim().length > 0, `Пустая строка локализации: ${path}`);
    return;
  }

  assert(value && typeof value === "object", `Некорректное значение локализации: ${path}`);
  for (const [key, nestedValue] of Object.entries(value as Record<string, unknown>)) {
    assertDictionaryLeaves(nestedValue, `${path}.${key}`);
  }
};

assertDictionaryLeaves(ru);
setLocale("ru");
assert(getLocale() === "ru", "Русский язык должен быть активной локалью по умолчанию.");
assert(t("state.logs") === "Журнал", "Должна возвращаться локализованная подпись интерфейса.");
assert(terms.actions.addChild === "Add child step", "Новая фиксированная подпись действия должна находиться в общем словаре терминов.");
assert(t("footer.updateAvailable", { version: "1.2.3" }) === "Обновите до версии 1.2.3", "Должна поддерживаться подстановка параметров.");
assert(t("step.summary.stepsInside", { count: 3 }) === "3 шагов внутри", "Должна поддерживаться подстановка числовых параметров.");

const legacyLog = normalizeLog({
  status: "danger",
  title: "[Yandex]:Check",
  value: "Ошибка при запросе - Error: Network failed",
});
assert(legacyLog.messageKey === "requestFailed", "Старый лог запроса должен нормализоваться в общий код.");
assert(formatLogScope(legacyLog.scope.parser, legacyLog.scope.phase) === "[Yandex]:Check", "Должна сохраняться техническая область лога.");
assert(formatLogMessage(legacyLog) === "Не удалось выполнить запрос.", "Пользователь должен получать локализованный текст вместо внешней ошибки.");
assert(legacyLog.technical?.message === "Ошибка при запросе - Error: Network failed", "Исходная ошибка должна сохраняться только в технических деталях.");

const legacyMessageCases = [
  ["Получение метаданных...", "metadataLoading"],
  ["Запросы к api для получения товаров...", "productApiRequest"],
  ["Обработка ответа...", "responseProcessing"],
  ["Получены метаданные", "metadataReceived"],
  ["Парсинг данных...", "parsingStarted"],
  ["Обработка завершена!", "parsingCompleted"],
  ["Правила подмены заголовков успешно установлены!", "headerRulesConfigured"],
  ["Авторизация в ВК...", "authStarting"],
  ["Токен не валиден, повторная авторизация...", "tokenInvalid"],
  ["Обработаны товары по категориям", "categoryProductsProcessed"],
  ["Обработана категория Основное меню", "categoryProcessed"],
  ["Обработан первый товар Ролл", "firstProductProcessed"],
  ["Обработана первый модификатор 200 г", "modifierProcessed"],
  ["Обработана первая группа модификаторов Соусы", "modifierGroupProcessed"],
  ["Токен валиден еще 12:00", "tokenValid"],
  ["Ошибка при авторизации: Error: denied", "authorizationFailed"],
  ["Ошибка обработке товаров по категориям: Error: failed", "categoryProductsProcessingFailed"],
] as const;

for (const [value, messageKey] of legacyMessageCases) {
  const normalized = normalizeLog({ status: "warn", title: "[VK]:Parse", value });
  assert(normalized.messageKey === messageKey, `Legacy-лог «${value}» должен преобразовываться в ${messageKey}.`);
}

console.log("i18n regression checks passed");
