import { useState } from "react";
import "./index.css";
import type { ParserConfig } from "../../types/parser_сonfig";

interface TabsProps {
  data: ParserConfig;
  onChange: (value: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ data, onChange }) => {
  const [actualTab, setActualTab] = useState();

  return (
    <ul className="tabs">
      {data.tabs.map((tab) => {
        return (
          <li className="tabs__item" key={tab.tabId}>
            <button className="tabs__item-btn">{tab.tabName ?? tab.type}</button>
          </li>
        )
      })}
    </ul>
  )
}

export default Tabs;