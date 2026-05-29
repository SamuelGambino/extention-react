import { useState } from "react";
import "./index.css"

interface IInputField {
  isAccent?: boolean;
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
  children?: React.ReactNode;
}

const InputField: React.FC<IInputField> = ({ isAccent, placeholder, value, children, onChange }) => {
  const [inputValue, setInputValue] = useState<string>(value || '');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
  }

  return (
    <div className='input-field'>
      <input
        className={`input-field__input ${isAccent ? 'input-field__input--accent' : ''}`}
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
      />
      {children}
    </div>
  )
};

export default InputField;