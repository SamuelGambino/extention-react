import { useTabsConfig } from "../../hooks/useTabsConfig";
import Form from "../Form";
import Tabs from "../Tabs";
import "./index.css";

const MainContent = () => {
  const { value, isLoaded, getActualConfig, openTab, closeTab, createTab, updatedData } = useTabsConfig();

  const currentConfig = getActualConfig();

  if (!isLoaded || !currentConfig) return null;

  return (
    <div className="main-content">
      <Tabs data={value} onChange={openTab} onClose={closeTab} onCreate={createTab} />
      <Form key={currentConfig.tabId} savedConfig={currentConfig} saveConfig={updatedData} />
    </div>
  )
}

export default MainContent;