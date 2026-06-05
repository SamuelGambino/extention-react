import { useState } from "react";
import "./index.css";
import MainBlock from "./blocks/MainBlock";
import SettingsBlock from "./blocks/SettingsBlock";
import ConfigurationBlock from "./blocks/ConfigurationBlock";
import Button from "../Button";

interface FormProps {
  className?: string;
}

interface ISettings {
  clicks: 'none' | 'products' | 'category' | 'all',
  pagination: boolean,
  parameters: boolean,
  modifiers: boolean
}

const Form = ({ className }: FormProps) => {
  const [preset, setPreset] = useState('custom');
  const [settings, setSettings] = useState<ISettings>({
    clicks: 'none',
    pagination: false,
    parameters: false,
    modifiers: false
  });

  const hasSettings = preset === 'custom' || preset === 'api';

  return (
    <form className={`form ${className ? ` ${className}` : ''}`}>
      <MainBlock preset={preset} onPresetChange={setPreset} />

      {hasSettings && <SettingsBlock settings={settings} onChange={setSettings} />}

      <ConfigurationBlock settings={settings} preset={preset} />

      <div className="form__actions">
        <Button title="Check state" className="form__button--state" onClick={() => { }} />
        <Button title="Parse" className="form__button--main" onClick={() => { }} />
        <Button title="Parse by steps" onClick={() => { }} />
      </div>
    </form>
  )
}

export default Form;