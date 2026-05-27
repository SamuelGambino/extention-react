import "./index.css"

interface IInputField {
  isAccent?: boolean;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
}

const SelectField: React.FC<IInputField> = ({ isAccent, value, options, onChange }) => {
  return (
    <select
      className={`select-field ${isAccent ? 'select-field--accent' : ''}`}
      value={options.find(option => option.value === value)?.value || ''}
      onChange={(e) => onChange(e.target.value)}
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