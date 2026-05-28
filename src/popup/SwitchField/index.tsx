import "./index.css";

interface ISwitchField {
  isAccent?: boolean;
  value?: boolean;
  onChange: (value: boolean) => void;
}

const SwitchField: React.FC<ISwitchField> = ({ isAccent, value, onChange }) => {
  return (
    <div className={`switch-field`}>
      <label className={`switch-field__switch ${isAccent ? 'switch-field__switch--accent' : ''}`}>
        <input
          type='checkbox'
          checked={value ?? false}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className="switch-field__track">
          <div className="switch-field__segments">
            <div className="switch-field__seg"></div><div className="switch-field__seg"></div><div className="switch-field__seg"></div>
            <div className="switch-field__seg"></div><div className="switch-field__seg"></div><div className="switch-field__seg"></div>
          </div>
        </div>
        <div className="switch-field__thumb"></div>
      </label>
      <span className="switch-field__text switch-field__text--disabled">Disabled</span>
    </div>
  );
}

export default SwitchField;