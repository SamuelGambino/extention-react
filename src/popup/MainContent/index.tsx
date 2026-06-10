import { useEffect, useState } from "react";
import { useParserConfig } from "../../hooks/useStorage";
import Form from "../Form";
import Tabs from "../Tabs";
import "./index.css";
import type { ParserConfig, ParserTabConfig } from "../../types/parser_сonfig";

const MainContent = () => {
  const { value, setStorageValue, isLoaded } = useParserConfig();
  if (!isLoaded) return null;
  const [parserConfig, setParserConfig] = useState<ParserConfig>(value);

  useEffect(() => {
    setParserConfig(value);
  }, [value])

  const getActualConfig = () => {
    if (value.actualTab) {
      return value.tabs.find((tab) => tab.tabId === value.actualTab) ?? value.tabs[0];
    }
    return value.tabs[0];
  }

  const openTab = (tabId: string) => {
    setStorageValue({
      ...value,
      actualTab: tabId
    });
  }

  const closeTab = (tabId: string) => {
    const updatedTabs = value.tabs.filter((tab) => tab.tabId !== tabId);

    let newActualTab = value.actualTab;

    if (value.actualTab === tabId) {
      newActualTab = updatedTabs.length > 0 ? updatedTabs[0].tabId : undefined;
    }

    setStorageValue({
      ...value,
      tabs: updatedTabs,
      actualTab: newActualTab
    });
  }

  const updatedData = (newData: ParserTabConfig) => {
    const newTabs = value.tabs.map((tab) => {
      if (tab.tabId === newData.tabId) {
        return newData;
      } else return tab;
    });

    setStorageValue({
      ...value,
      tabs: newTabs
    })
  }

  const createTab = () => {
    const currentTab = value.tabs.find((tab) => tab.tabId === value.actualTab);

    if (!currentTab) return;

    const newTab: ParserTabConfig = {
      ...currentTab,
      tabId: crypto.randomUUID(),
      tabName: "Новая вкладка",
      data: { ...currentTab.data }
    };

    setStorageValue({
      ...value,
      tabs: [...value.tabs, newTab], 
      actualTab: newTab.tabId 
    });
  }

  const currentConfig = getActualConfig();

  return (
    <div className="main-content">
      <Tabs data={parserConfig} onChange={openTab} onClose={closeTab} onCreate={createTab} />
      <Form savedConfig={currentConfig} saveConfig={updatedData} />
    </div>
  )
}

export default MainContent;