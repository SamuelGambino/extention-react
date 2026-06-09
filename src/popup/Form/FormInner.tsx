import "./index.css";
import MainBlock from "./blocks/MainBlock";
import SettingsBlock from "./blocks/SettingsBlock";
import ConfigurationBlock from "./blocks/ConfigurationBlock";
import Button from "../Button";
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useEffect, useRef } from "react";
import type { ParserConfiguration } from "../../types/parser_сonfig";

interface FormProps {
  className?: string;
  savedConfig: ParserConfiguration;
  saveConfig: (values: ParserConfiguration) => void;
}

const FormInner = ({ className, savedConfig, saveConfig }: FormProps) => {
  const methods = useForm<ParserConfiguration>({ defaultValues: savedConfig });
  const { control, reset } = methods;
  const lastSavedConfigRef = useRef(JSON.stringify(savedConfig));

  useEffect(() => {
    const serializedSavedConfig = JSON.stringify(savedConfig);

    if (serializedSavedConfig === lastSavedConfigRef.current) return;

    lastSavedConfigRef.current = serializedSavedConfig;
    reset(savedConfig);
  }, [reset, savedConfig]);

  const formValues = useWatch({ control });

  useEffect(() => {
    const serializedFormValues = JSON.stringify(formValues);

    if (serializedFormValues === lastSavedConfigRef.current) return;

    lastSavedConfigRef.current = serializedFormValues;
    saveConfig(formValues as ParserConfiguration);
  }, [formValues, saveConfig]);

  const preset = useWatch({ control, name: 'type' });
  const hasSettings = preset === 'custom' || preset === 'api';

  return (
    <FormProvider {...methods}>
      <form className={`form ${className ? ` ${className}` : ''}`}>
        <MainBlock />

        {hasSettings && <SettingsBlock />}

        <ConfigurationBlock />

        <div className="form__actions">
          <Button title="Check state" className="form__button--state" onClick={() => { }} />
          <Button title="Parse" className="form__button--main" onClick={() => { }} />
          <Button title="Parse by steps" onClick={() => { }} />
        </div>
      </form>
    </FormProvider>
  )
}

export default FormInner;