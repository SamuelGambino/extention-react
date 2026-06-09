import "./index.css";
import MainBlock from "./blocks/MainBlock";
import SettingsBlock from "./blocks/SettingsBlock";
import ConfigurationBlock from "./blocks/ConfigurationBlock";
import Button from "../Button";
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useEffect } from "react";
import type { ParserConfiguration } from "../../types/parser_сonfig";

interface FormProps {
  className?: string;
  savedConfig: ParserConfiguration;
  saveConfig: (values: ParserConfiguration) => void;
}

const FormInner = ({ className, savedConfig, saveConfig }: FormProps) => {
  const methods = useForm({ defaultValues: savedConfig });

  useEffect(() => {
    methods.reset(savedConfig);
  }, []);

  useEffect(() => {
    console.log('watch useEffect mounted');
    const subscription = methods.watch((values) => {
      console.log('watch triggered:', values);
      saveConfig(values as ParserConfiguration);
    });
    return () => {
      console.log('watch useEffect cleanup');
      subscription.unsubscribe()
    };
  }, [methods.watch]);

  const preset = useWatch({ control: methods.control, name: 'type' });
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