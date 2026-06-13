import "./index.css";
import { useState, useRef, useEffect } from "react";
import type { ParserTabConfig } from "../../types/parser_сonfig";
import { useTabsConfig } from "../../hooks/useTabsConfig";

interface TabItemProps {
  tab: ParserTabConfig;
  isActive: boolean;
  canClose: boolean;
  onSelect: () => void;
  onClose: () => void;
}

const TabItem: React.FC<TabItemProps> = ({ tab, isActive, canClose, onSelect, onClose }) => {
  const { renameTab } = useTabsConfig();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(tab.tabName ?? tab.type);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    if (!isActive) return;
    setEditValue(tab.tabName ?? tab.type);
    setIsEditing(true);
  };

  const commitRename = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== tab.tabName) {
      renameTab(trimmed);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') commitRename();
    if (e.key === 'Escape') {
      setEditValue(tab.tabName ?? tab.type);
      setIsEditing(false);
    }
  };

  return (
    <li className="tabs__item">
      {isEditing ? (
        <input
          ref={inputRef}
          className="tabs__input"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={commitRename}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <button
          className={`tabs__btn${isActive ? ' tabs__btn--active' : ''}`}
          onClick={onSelect}
          onDoubleClick={handleDoubleClick}
        >
          {tab.tabName ?? tab.type}
        </button>
      )}

      {canClose && (
        <button className="tabs__btn-close" onClick={onClose}>X</button>
      )}
    </li>
  );
};

export default TabItem;