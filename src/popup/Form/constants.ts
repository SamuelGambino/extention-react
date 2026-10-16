import type { StepType } from "../../globalTypes/parser_сonfig";
import { t } from "../i18n";
import { terms } from "../../shared/i18n/terms";

const PresertOptions = [
  { label: terms.parserNames.custom, value: "custom", description: t("form.presets.custom.description") },
  { label: terms.parserNames.vk, value: "vk", description: t("form.presets.vk.description") },
  { label: terms.parserNames.yandex, value: "yandex", description: t("form.presets.yandex.description") },
  { label: terms.parserNames.kuper, value: "kuper", description: t("form.presets.kuper.description") },
  { label: terms.parserNames.chibbis, value: "chibbis", description: t("form.presets.chibbis.description") },
  { label: terms.parserNames.whatsapp, value: "whatsapp", description: t("form.presets.whatsapp.description") },
  { label: terms.parserNames.flowwow, value: "flowwow", description: t("form.presets.flowwow.description") },
];

const ClicksOptions = [
  { label: t("form.clickOptions.none"), value: "none" },
  { label: t("form.clickOptions.products"), value: "products" },
  { label: t("form.clickOptions.category"), value: "category" },
  { label: t("form.clickOptions.all"), value: "all" },
];

const GroupTypes = [
  { label: t("form.groupTypes.oneOne"), value: "one_one" },
  { label: t("form.groupTypes.oneUnlimited"), value: "one_unlimited" },
  { label: t("form.groupTypes.allOne"), value: "all_one" },
  { label: t("form.groupTypes.allUnlimited"), value: "all_unlimited" },
];

const StepMeta: Record<StepType, { color: string; placeholder: string; desc: string }> = {
  collect: {
    color: "#4aaa8a",
    placeholder: t("form.stepMeta.collect.placeholder"),
    desc: t("form.stepMeta.collect.description"),
  },
  action: {
    color: "#9a8acc",
    placeholder: t("form.stepMeta.action.placeholder"),
    desc: t("form.stepMeta.action.description"),
  },
  loop: {
    color: "#7aaee0",
    placeholder: t("form.stepMeta.loop.placeholder"),
    desc: t("form.stepMeta.loop.description"),
  },
  wait: {
    color: "#c8963a",
    placeholder: t("form.stepMeta.wait.placeholder"),
    desc: t("form.stepMeta.wait.description"),
  },
  condition: {
    color: "#cc7a5a",
    placeholder: t("form.stepMeta.condition.placeholder"),
    desc: t("form.stepMeta.condition.description"),
  },
};

export default { PresertOptions, ClicksOptions, GroupTypes, StepMeta };
