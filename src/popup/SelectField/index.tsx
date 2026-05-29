import { useState } from "react";
import "./index.css"

interface IInputField {
  isAccent?: boolean;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
}

const SelectField: React.FC<IInputField> = ({ isAccent, value, options, onChange }) => {
  const [selectedOption, setSelectedOption] = useState<string>(value);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setSelectedOption(selectedValue);
    onChange(selectedValue);
  }

  return (
    <select
      className={`select-field ${isAccent ? 'select-field--accent' : ''}`}
      value={options.find(option => option.value === selectedOption)?.value || ''}
      onChange={handleChange}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export default SelectField;