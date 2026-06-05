import { useState, useRef, useEffect } from "react";
import "./index.css";

interface IInputField {
  isAccent?: boolean;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
}

const SelectField: React.FC<IInputField> = ({ isAccent, value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>(value);
  const wrapRef = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find(o => o.value === selectedValue)?.label ?? "";

  const handlePick = (val: string) => {
    setSelectedValue(val);
    onChange(val);
    setIsOpen(false);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  return (
    <div
      ref={wrapRef}
      className={`select-field ${isOpen ? "select-field--open" : ""} ${isAccent ? "select-field--accent" : ""}`}
    >
      <div className="select-field__corner select-field__corner--tl" />
      <div className="select-field__corner select-field__corner--br" />

      <button
        type="button"
        className="select-field__btn"
        onClick={() => setIsOpen(prev => !prev)}
      >
        <span className="select-field__value">{selectedLabel}</span>
        <svg className="select-field__arrow" width="10" height="6" viewBox="0 0 10 6" fill="none">
          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      </button>

      {isOpen && (
        <ul className="select-field__dropdown">
          {options.map(option => (
            <li
              key={option.value}
              className={`select-field__item ${option.value === selectedValue ? "select-field__item--selected" : ""}`}
              onClick={() => handlePick(option.value)}
            >
              <span className="select-field__item-dot" />
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SelectField;