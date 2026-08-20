import ru from "../src/popup/i18n/ru.ts";
import { getLocale, setLocale, t } from "../src/popup/i18n/index.ts";

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
assert(t("actions.parse") === "Выгрузить", "Должна возвращаться локализованная подпись действия.");
assert(t("footer.updateAvailable", { version: "1.2.3" }) === "Обновите до версии 1.2.3", "Должна поддерживаться подстановка параметров.");
assert(t("step.summary.stepsInside", { count: 3 }) === "3 шагов внутри", "Должна поддерживаться подстановка числовых параметров.");

console.log("i18n regression checks passed");
