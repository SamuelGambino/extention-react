import { useCallback, useEffect, useState } from "react";
import browser from "webextension-polyfill";
import type { ParserConfig } from "../../globalTypes/parser_сonfig";
import type { ParserState } from "../../globalTypes/parsing_state";
import type { UpdateData } from "../../globalTypes/update_data";

const DEFAULT_VERSION: UpdateData = {
  checkedAt: 0,
  latestVersion: "",
  releaseUrl: "",
  hasUpdate: false,
  extensionVersion: "",
}

const DEFAULT_CONFIG: ParserConfig = {
  tabs: [
    {
      tabId: crypto.randomUUID(),
      type: 'custom',
      source: '',
      data: {
        steps: [
          {
            id: 1,
            type: "navigate",
            params: {
              mode: "url",
              url: ""
            }
          }
        ]
      },
    }
  ]
}

const DEFAULT_STATE: ParserState = {
  parsing: {
    isReady: false,
    isRunning: false,
  },
  data: {
    categories: 0,
    categoriesTotal: 0,
    products: 0,
    productsTotal: 0,
  }
}

const useStorage = <T>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Чтение и запись в localStorage при монтировании компонента
  useEffect(() => {
    const initializeStorage = async () => {
      setIsLoaded(false);
      const data = await browser.storage.local.get(key);
      if (data[key] === undefined) {
        await browser.storage.local.set({ [key]: initialValue });
        setValue(initialValue);
      } else {
        setValue(data[key] as T);
      }
      setIsLoaded(true);
    }
    initializeStorage();
  }, [key, initialValue])

  useEffect(() => {
    const handleChanges = (changes: browser.Storage.StorageAreaOnChangedChangesType, areaName: string) => {
      if (areaName === "local" && changes[key]) {
        setValue(changes[key].newValue as T);
      }
    };
    browser.storage.onChanged.addListener(handleChanges);
    return () => browser.storage.onChanged.removeListener(handleChanges);
  }, [key]);

  const setStorageValue = useCallback(async (newValue: T) => {
    setValue(newValue);
    await browser.storage.local.set({ [key]: newValue });
  }, [key]);

  return [value, setStorageValue, isLoaded] as const;
}

const useParserConfig = () => {
  return useStorage<ParserConfig>("parser_config", DEFAULT_CONFIG);
}

const useParsingState = () => {
  return useStorage<ParserState>("parser_state", DEFAULT_STATE);
}

const useVersion = () => {
  const [value, setValue] = useState<UpdateData>(DEFAULT_VERSION);
  const [isLoaded, setIsLoaded] = useState(false);

  const currentVersion = browser.runtime.getManifest().version;

  useEffect(() => {
    const initializeVersion = async () => {
      const data = await browser.storage.local.get("update_data");
      const stored = data.update_data as UpdateData | undefined;

      if (stored && stored.extensionVersion === currentVersion) {
        setValue(stored);
      } else {
        setValue(DEFAULT_VERSION);
      }
      setIsLoaded(true);
    };
    initializeVersion();
  }, []);

  useEffect(() => {
    const handleChanges = (changes: browser.Storage.StorageAreaOnChangedChangesType, areaName: string) => {
      if (areaName !== "local" || !changes.update_data) return;

      const newValue = changes.update_data.newValue as UpdateData | undefined;
      if (newValue && newValue.extensionVersion === currentVersion) {
        setValue(newValue);
      }
    };
    browser.storage.onChanged.addListener(handleChanges);
    return () => browser.storage.onChanged.removeListener(handleChanges);
  }, []);

  const setStorageValue = useCallback(async (newValue: UpdateData) => {
    setValue(newValue);
    await browser.storage.local.set({ update_data: newValue });
  }, []);

  return [value, setStorageValue, isLoaded] as const;
}

export {
  useParserConfig,
  useParsingState,
  useVersion
}