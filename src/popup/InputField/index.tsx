import { useState } from "react";
import "./index.css"

interface IInputField {
  isAccent?: boolean;
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
}

const InputField: React.FC<IInputField> = ({ isAccent, placeholder, value, onChange }) => {
  const [inputValue, setInputValue] = useState<string>(value || '');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
  }

  return (
    <div className={`input-field ${isAccent ? 'input-field--accent' : ''}`}>
      <div className="input-field__corner input-field__corner--tl"></div>
      <div className="input-field__corner input-field__corner--br"></div>
      <input
        className="input-field__input"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
      />
    </div>
  )
};

export default InputField;