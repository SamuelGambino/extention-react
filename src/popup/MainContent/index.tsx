import { useCallback, useEffect, useRef } from "react";
import { useParserConfig } from "../../hooks/useStorage";
import Form from "../Form";
import Tabs from "../Tabs";
import "./index.css";
import type { ParserTabConfig } from "../../types/parser_сonfig";

const MainContent = () => {
  const { value, setStorageValue, isLoaded } = useParserConfig();
  const configRef = useRef(value);

  useEffect(() => {
    configRef.current = value;
  }, [value]);


  const getActualConfig = () => {
    if (value.actualTab) {
      return value.tabs.find((tab) => tab.tabId === value.actualTab) ?? value.tabs[0];
    }
    return value.tabs[0];
  }

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

  const renameTab = useCallback((tabId: string, newName: string) => {
    const currentValue = configRef.current;
    const newTabs = currentValue.tabs.map((tab) =>
      tab.tabId === tabId ? { ...tab, tabName: newName } : tab
    );
    setStorageValue({ ...currentValue, tabs: newTabs });
  }, [setStorageValue]);

  const currentConfig = getActualConfig();

  if (!isLoaded || !currentConfig) return null;

  return (
    <div className="main-content">
      <Tabs data={value} onChange={openTab} onClose={closeTab} onCreate={createTab} onRename={renameTab} />
      <Form key={currentConfig.tabId} savedConfig={currentConfig} saveConfig={updatedData} />
    </div>
  )
}

export default MainContent;