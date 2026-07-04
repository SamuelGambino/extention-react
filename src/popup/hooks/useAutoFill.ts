// hooks/useAutoFill.ts
import { useFormContext } from "react-hook-form";
import type { ParserTabConfig } from "../../globalTypes/parser_сonfig";
import browser from "webextension-polyfill";

const useAutoFill = () => {
  const { setValue } = useFormContext<ParserTabConfig>();

  const detectPresetFromUrl = (domain: string) => {
    if (domain === "vk.com" || domain === "vk.ru") return "vk";
    if (domain === "eda.yandex.ru" || domain === "yandex.ru" || domain === "yandex.com" || domain === "market-delivery.yandex.ru") return "yandex";
    if (domain === "chibbis.ru") return "chibbis";
    if (domain === "web.whatsapp.com") return "whatsapp";
    if (domain === "kuper.ru") return "kuper";
    if (domain === "flowwow.com" || domain === "flowwow.ru") return "flowwow";
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

    if (preset === "flowwow") {
      setValue("data.apiUrl", "");
    };
    if (preset === "vk") {
      const group = url.split('market-')[1].split('?')[0] ? url.split('market-')[1].split('?')[0] : "undefined";
      setValue("data.marketId", group);
    };
    if (preset === "yandex") {
      const pathSegments = urlObject.pathname.split('/').filter(Boolean);
      let placeSlug;
      if (urlObject.hostname === "eda.yandex.ru" || urlObject.hostname === "market-delivery.yandex.ru") placeSlug = urlObject.searchParams.get("placeSlug");
      if (urlObject.hostname === "yandex.ru" || urlObject.hostname === "yandex.com") {
        const orgIndex = pathSegments.indexOf('org');
        placeSlug = orgIndex !== -1 ? pathSegments[orgIndex + 1] : undefined;
      }
      setValue("data.apiUrl", `https://eda.yandex.ru/api/v2/menu/retrieve/${placeSlug}?latitude=0&longitude=0&autoTranslate=false`);
    };
    if (preset === "chibbis") {
      const chibbisResponse = await fetch("https://chibbis.ru/webapi/cities");
      if (!chibbisResponse.ok) return;
      const data: { id: string, urlName: string }[] = await chibbisResponse.json();
      const pathSegments = urlObject.pathname.split('/').filter(Boolean);
      const cityObj = data.find(city => city.urlName === pathSegments[0]);
      setValue("data.apiUrl", `https://chibbis.ru/webapi/v2/restaurants/${pathSegments[2]}/menu/summary?cityId=${cityObj?.id}`);
    }
    if (preset === "kuper") {
      setValue("data.apiUrl", `https://kuper.ru/api/v3/multicards?permalink`);
    }
  };

  return { autoFill };
};

export { useAutoFill };