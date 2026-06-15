// hooks/useTabConfig.ts
import { useFormContext } from "react-hook-form";
import type { ParserTabConfig } from "../types/parser_сonfig";
import browser from "webextension-polyfill";

const useAutoFill = () => {
  const { setValue } = useFormContext<ParserTabConfig>();

  const detectPresetFromUrl = (domain: string) => {
    if (domain === "vk.com") return "vk";
    if (domain === "eda.yandex.ru") return "yandex_eda";
    if (domain === "yandex.ru") return "yandex_map";
    if (domain === "chibbis.ru") return "chibbis";
    return 'custom';
  };

  const autoFill = async () => {
    const [activeTab] = await browser.tabs.query({ active: true, currentWindow: true });
    const url = activeTab.url;
    if (!url) return;
    const urlObject = new URL(url);

    const preset = detectPresetFromUrl(urlObject.hostname);

    setValue('type', preset);
    setValue('source', url);

    if (preset === "vk") {
      const group = url.split('market-')[1].split('?')[0] ? url.split('market-')[1].split('?')[0] : "undefined";
      setValue("data.marketId", group);
    };
    if (preset === "yandex_eda") {
      const placeSlug = urlObject.searchParams.get("placeSlug");
      setValue("data.apiUrl", `https://eda.yandex.ru/api/v2/menu/retrieve/${placeSlug}?latitude=0&longitude=0&autoTranslate=false`);      
    };
  };

  return { autoFill };
};

export { useAutoFill };