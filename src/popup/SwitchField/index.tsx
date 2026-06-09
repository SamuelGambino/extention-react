import { useEffect, useState } from "react";
import "./index.css";

interface ISwitchField {
  isAccent?: boolean;
  value?: boolean;
  onChange: (value: boolean) => void;
}

const SwitchField: React.FC<ISwitchField> = ({ isAccent, value, onChange }) => {
  const [switchValue, setSwitchValue] = useState(value ?? false);

  useEffect(() => {
    setSwitchValue(value ?? false);
  }, [value]);

  return (
    <div className={`switch-field`}>
      <label className={`switch-field__switch ${isAccent ? 'switch-field__switch--accent' : ''}`}>
        <input
          type='checkbox'
          checked={switchValue}
          onChange={(e) => {
            setSwitchValue(e.target.checked);
            onChange(e.target.checked);
          }}
        />
        <div className="switch-field__track">
          <div className="switch-field__segments">
            <div className="switch-field__seg"></div><div className="switch-field__seg"></div><div className="switch-field__seg"></div>
            <div className="switch-field__seg"></div><div className="switch-field__seg"></div><div className="switch-field__seg"></div>
          </div>
        </div>
        <div className="switch-field__thumb"></div>
      </label>
      <span className={`switch-field__text ${switchValue ? 'switch-field__text--enabled' : 'switch-field__text--disabled'}`}>
        {switchValue ? 'Enabled' : 'Disabled'}
      </span>
    </div>
  );
}

export default SwitchField;