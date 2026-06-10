import { useEffect, useState } from "react";
import "./index.css";
import type { ParserConfig } from "../../types/parser_сonfig";

interface TabsProps {
  data: ParserConfig;
  onChange: (value: string) => void;
  onClose: (value: string) => void;
  onCreate: (value: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ data, onChange, onClose, onCreate }) => {
  const [actualTab, setActualTab] = useState<string>();

  useEffect(() => {
    if (actualTab !== data.actualTab) setActualTab(data.actualTab);
  }, [data])

  return (
    <ul className="tabs">
      {data.tabs.map((tab) => {
        return (
          <li className="tabs__item" key={tab.tabId}>
            <button className={`tabs__btn ${tab.tabId === actualTab ? ` tabs__btn--active` : ''}`} onClick={() => {
              setActualTab(tab.tabId);
              onChange(tab.tabId);
            }}>{tab.tabName ?? tab.type}
            </button>
            {data.tabs.length > 1 && <button className="tabs__btn-close" onClick={() => {onClose(tab.tabId)}}>X</button>}
          </li>
        )
      })}
      <li className="tabs__item tabs__item--right">
        <button className="tabs__btn-create" onClick={() => onCreate}>+</button>
      </li>
    </ul>
  )
}

export default Tabs;