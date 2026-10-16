import { readFileSync } from "node:fs";

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const formSource = readFileSync(new URL("../src/popup/Form/index.tsx", import.meta.url), "utf8");
const mainContentSource = readFileSync(new URL("../src/popup/MainContent/index.tsx", import.meta.url), "utf8");

assert(!/\breset\s*\(\s*savedConfig\s*\)/.test(formSource), "Автосохранение не должно выполнять reset(savedConfig) и пересоздавать useFieldArray.");
assert(/useForm<ParserTabConfig>\(\{ defaultValues: savedConfig \}\)/.test(formSource), "Форма должна инициализироваться данными активной вкладки при mount.");
assert(/<Form key=\{currentConfig\.tabId\}/.test(mainContentSource), "Смена вкладки должна оставаться явной точкой remount формы.");

console.log("form session preservation regression checks passed");
