import { useState } from "react";
import "./index.css"

interface IInputField {
  isAccent?: boolean;
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
}

const InputField: React.FC<IInputField> = ({ isAccent, placeholder, value, onChange }) => {
  const normalizedValue = value ?? '';
  const [inputState, setInputState] = useState({
    propValue: normalizedValue,
    value: normalizedValue,
  });

  if (inputState.propValue !== normalizedValue) {
    setInputState({
      propValue: normalizedValue,
      value: normalizedValue,
    });
  }

  return (
    <div className={`input-field ${isAccent ? 'input-field--accent' : ''}`}>
      <div className="input-field__corner input-field__corner--tl"></div>
      <div className="input-field__corner input-field__corner--br"></div>
      <input
        className="input-field__input"
        placeholder={placeholder}
        value={inputState.value}
        onChange={(e) => {
          setInputState({
            propValue: normalizedValue,
            value: e.target.value,
          });
          onChange(e.target.value);
        }}
      />
    </div>
  );
};

export default InputField;