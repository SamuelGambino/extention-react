import "./index.css";
import type { ParserConfig } from "../types/parser_сonfig";
import Button from "../Button";
import TabItem from "./TabItem";

interface TabsProps {
  data: ParserConfig;
  onChange: (value: string) => void;
  onClose: (value: string) => void;
  onCreate: () => void;
}

const Tabs: React.FC<TabsProps> = ({ data, onChange, onClose, onCreate }) => {
  return (
    <div className="tabs">
      <ul className="tabs__list">
        {data.tabs.map((tab) => (
          <TabItem
            key={tab.tabId}
            tab={tab}
            isActive={tab.tabId === data.actualTab}
            canClose={data.tabs.length > 1}
            onSelect={() => onChange(tab.tabId)}
            onClose={() => onClose(tab.tabId)}
          />
        ))}
      </ul>
      <Button onClick={onCreate} title="+" className="tabs__btn-create" />
    </div>
  );
};

export default Tabs;