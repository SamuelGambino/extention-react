import { useState } from "react";
import "./index.css";

interface ISwitchField {
  isAccent?: boolean;
  value?: boolean;
  onChange: (value: boolean) => void;
}

const SwitchField: React.FC<ISwitchField> = ({ isAccent, value, onChange }) => {
  const normalizedValue = value ?? false;
  const [switchState, setSwitchState] = useState({
    propValue: normalizedValue,
    value: normalizedValue,
  });

  if (switchState.propValue !== normalizedValue) {
    setSwitchState({
      propValue: normalizedValue,
      value: normalizedValue,
    });
  }

  return (
    <div className={`switch-field`}>
      <label className={`switch-field__switch ${isAccent ? 'switch-field__switch--accent' : ''}`}>
        <input
          type='checkbox'
          checked={switchState.value}
          onChange={(e) => {
            setSwitchState({
              propValue: normalizedValue,
              value: e.target.checked,
            });
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
      <span className={`switch-field__text ${switchState.value ? 'switch-field__text--enabled' : 'switch-field__text--disabled'}`}>
        {switchState.value ? 'Enabled' : 'Disabled'}
      </span>
    </div>
  );
}

export default SwitchField;