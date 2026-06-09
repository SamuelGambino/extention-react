import "./index.css"

interface IInputField {
  isAccent?: boolean;
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
}

const InputField: React.FC<IInputField> = ({ isAccent, placeholder, value, onChange }) => {
  return (
    <div className={`input-field ${isAccent ? 'input-field--accent' : ''}`}>
      <div className="input-field__corner input-field__corner--tl"></div>
      <div className="input-field__corner input-field__corner--br"></div>
      <input
        className="input-field__input"
        placeholder={placeholder}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default InputField;