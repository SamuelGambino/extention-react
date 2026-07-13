import { useState, useRef, useEffect } from "react";
import "./index.css";

interface IInputField {
  isAccent?: boolean;
  value?: string;
  className?: string;
  options: {
    label: string; value: string;
    description?: string;
    color?: string;
  }[];
  onChange: (value: string) => void;
}

const SelectField: React.FC<IInputField> = ({ isAccent, value, className, options, onChange }) => {
  const normalizedValue = value ?? '';
  const [selectedState, setSelectedState] = useState({
    propValue: normalizedValue,
    value: normalizedValue,
  });

  const [isOpen, setIsOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  if (selectedState.propValue !== normalizedValue) {
    setSelectedState({
      propValue: normalizedValue,
      value: normalizedValue,
    });
  }

  const selectedLabel = options.find(o => o.value === selectedState.value)?.label ?? "";

  const handlePick = (val: string) => {
    setSelectedState({
      propValue: normalizedValue,
      value: val,
    });
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

  return (
    <div
      ref={wrapRef}
      className={`select-field ${isOpen ? "select-field--open" : ""}${isAccent ? " select-field--accent" : ""}${className ? ` ${className}` : ""}`}
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
          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </button>

      {isOpen && (
        <ul className="select-field__dropdown">
          {options.map(option => (
            <li
              key={option.value}
              className={`select-field__item${option.value === value ? " select-field__item--selected" : ""}`}
              style={{ color: option.color }}
              onMouseDown={(e) => {
                e.preventDefault();
                handlePick(option.value);
              }}
            >
              <span className="select-field__item-dot" style={{ backgroundColor: option.color }} />

              <span className="select-field__item-label">{option.label}</span>

              {option.description && (
                <span className="select-field__item-desc">{option.description}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SelectField;