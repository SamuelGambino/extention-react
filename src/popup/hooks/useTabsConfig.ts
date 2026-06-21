// hooks/useTabsConfig.ts
import { useCallback, useEffect, useRef } from "react";
import { useParserConfig } from "./useStorage";
import type { ParserTabConfig } from "../../globalTypes/parser_сonfig";

const useTabsConfig = () => {
  const [value, setStorageValue, isLoaded] = useParserConfig();
  const configRef = useRef(value);

  useEffect(() => {
    configRef.current = value;
  }, [value]);

  const renameTab = useCallback(( newName: string) => {
    const currentValue = configRef.current;
    const newTabs = currentValue.tabs.map((tab) =>
      tab.tabId === currentValue.actualTab ? { ...tab, tabName: newName } : tab
    );
    setStorageValue({ ...currentValue, tabs: newTabs });
  }, [setStorageValue]);

  const openTab = useCallback((tabId: string) => {
    const currentValue = configRef.current;
    setStorageValue({
      ...currentValue,
      actualTab: tabId,
    });
  }, [setStorageValue]);

  const closeTab = useCallback((tabId: string) => {
    const currentValue = configRef.current;
    const updatedTabs = currentValue.tabs.filter((tab) => tab.tabId !== tabId);

    let newActualTab = currentValue.actualTab;

    if (currentValue.actualTab === tabId) {
      newActualTab = updatedTabs.length > 0 ? updatedTabs[0].tabId : undefined;
    }

    setStorageValue({
      ...currentValue,
      tabs: updatedTabs,
      actualTab: newActualTab
    });
  }, [setStorageValue]);

  const updatedData = useCallback((newData: ParserTabConfig) => {
    const currentValue = configRef.current;
    const newTabs = currentValue.tabs.map((tab) => {
      if (tab.tabId === newData.tabId) {
        return newData;
      } else return tab;
    });

    setStorageValue({
      ...currentValue,
      tabs: newTabs,
    });
  }, [setStorageValue]);

  const createTab = useCallback(() => {
    const currentValue = configRef.current;
    const currentTab = currentValue.tabs.find((tab) => tab.tabId === currentValue.actualTab) ?? currentValue.tabs[0];

    if (!currentTab) return;

    const newTab: ParserTabConfig = {
      ...currentTab,
      tabId: crypto.randomUUID(),
      tabName: "Новая вкладка",
      data: structuredClone(currentTab.data),
    };

    setStorageValue({
      ...currentValue,
      tabs: [...currentValue.tabs, newTab],
      actualTab: newTab.tabId
    });
  }, [setStorageValue]);

  const getActualConfig = () => {
    if (value.actualTab) {
      return value.tabs.find((tab) => tab.tabId === value.actualTab) ?? value.tabs[0];
    }
    return value.tabs[0];
  }

  return { value, isLoaded, renameTab, openTab, closeTab, updatedData, createTab, getActualConfig };
};

export { useTabsConfig };