import "./index.css"

interface IInputField {
  isAccent?: boolean;
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
  children?: React.ReactNode;
}

const InputField: React.FC<IInputField> = ({ isAccent, placeholder, value, children, onChange }) => {
  return (
    <div className='input-field'>
      <input
        className={`input-field__input ${isAccent ? 'input-field__input--accent' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {children}
    </div>
  )
};

export default InputField;