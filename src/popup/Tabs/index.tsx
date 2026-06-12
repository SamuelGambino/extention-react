import "./index.css";
import type { ParserConfig } from "../../types/parser_сonfig";

interface TabsProps {
  data: ParserConfig;
  onChange: (value: string) => void;
  onClose: (value: string) => void;
  onCreate: () => void;
}

const Tabs: React.FC<TabsProps> = ({ data, onChange, onClose, onCreate }) => {

  return (
    <ul className="tabs">
      {data.tabs.map((tab) => {
        return (
          <li className="tabs__item" key={tab.tabId}>
            <button className={`tabs__btn ${tab.tabId === data.actualTab ? ` tabs__btn--active` : ''}`} onClick={() => {
              onChange(tab.tabId);
            }}>{tab.tabName ?? tab.type}
            </button>
            {data.tabs.length > 1 && <button className="tabs__btn-close" onClick={() => { onClose(tab.tabId) }}>X</button>}
          </li>
        )
      })}
      <li className="tabs__item tabs__item--right">
        <button className="tabs__btn-create" onClick={onCreate}>+</button>
      </li>
    </ul>
  )
}

export default Tabs;