import { useCallback, useEffect, useState } from "react";
import browser from "webextension-polyfill";
import type { ParserConfig } from "../types/parser_сonfig";
import type { ParserState } from "../types/parsing_state";

const DEFAULT_CONFIG: ParserConfig = {
  actualTab: 0,
  tabs: [
    {
      tabId: crypto.randomUUID(),
      type: 'custom',
      source: '',
      data: {
        settings: {
          clicks: 'none',
          pagination: false,
          parameters: false,
          modifiers: false,
        },
        selectors: {
          category: {
            container: "",
          },
          product: {
            container: "",
            name: "",
            price: "",
          },
        },
      },
    }
  ]
}

const DEFAULT_STATE: ParserState = {
  availability: {
    isReady: false,
  },
  parsing: {
    categories: 0,
    products: 0,
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

  return { value, setStorageValue, isLoaded };
}

const useParserConfig = () => {
  return useStorage<ParserConfig>("parser_config", DEFAULT_CONFIG);
}

const useParsingState = () => {
  return useStorage<ParserState>("parser_state", DEFAULT_STATE);
}

export {
  useParserConfig,
  useParsingState
}