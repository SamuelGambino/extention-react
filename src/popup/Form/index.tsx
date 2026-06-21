import "./index.css";
import MainBlock from "./blocks/MainBlock";
import SettingsBlock from "./blocks/SettingsBlock";
import ConfigurationBlock from "./blocks/ConfigurationBlock";
import browser from "webextension-polyfill";
import Button from "../Button";
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useEffect, useRef } from "react";
import type { ParserTabConfig } from "../../globalTypes/parser_сonfig";

interface FormProps {
  className?: string;
  savedConfig: ParserTabConfig;
  saveConfig: (values: ParserTabConfig) => void;
}

const sendRuntimeMessage = async (action: 'Check_state' | 'Parse' | 'Parse_by_steps') => {
  try {
    await browser.runtime.sendMessage({ action });
  } catch (error) {
    console.error(`Failed to send ${action} message to background worker:`, error);
  }
};

const Form = ({ className, savedConfig, saveConfig }: FormProps) => {
  const methods = useForm<ParserTabConfig>({ defaultValues: savedConfig });
  const { control, reset, watch } = methods;
  const lastSavedConfigRef = useRef(JSON.stringify(savedConfig));

  useEffect(() => {
    const serializedSavedConfig = JSON.stringify(savedConfig);

    if (serializedSavedConfig === lastSavedConfigRef.current) return;

    lastSavedConfigRef.current = serializedSavedConfig;
    reset(savedConfig);
  }, [reset, savedConfig]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const subscription = watch((values) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const serialized = JSON.stringify(values);
        if (serialized === lastSavedConfigRef.current) return;
        lastSavedConfigRef.current = serialized;
        saveConfig(values as ParserTabConfig);
      }, 500);
    })

    return () => {
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  const preset = useWatch({ control, name: 'type' });
  const hasSettings = preset === 'custom' || preset === 'api';

  return (
    <FormProvider {...methods}>
      <form className={`form ${className ? ` ${className}` : ''}`}>
        <MainBlock />

        {hasSettings && <SettingsBlock />}

        <ConfigurationBlock />

        <div className="form__actions">
          <Button title="Check state" className="form__button--state" onClick={() => {
            void sendRuntimeMessage("Check_state");
          }} />
          <Button title="Parse" className="form__button--main" onClick={() => {
            void sendRuntimeMessage("Parse");
          }} />
          <Button title="Parse by steps" onClick={() => {
            void sendRuntimeMessage("Parse_by_steps");
          }} />
        </div>
      </form>
    </FormProvider>
  )
}

export default Form;