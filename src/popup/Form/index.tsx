import "./index.css";
import MainBlock from "./blocks/MainBlock";
import Scenario from "../Scenario";
import ConfigurationBlock from "./blocks/ConfigurationBlock";
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useEffect, useRef } from "react";
import type { ParserTabConfig } from "../../globalTypes/parser_сonfig";
import ActionButtons from "../ActionButtons";

interface FormProps {
  className?: string;
  savedConfig: ParserTabConfig;
  saveConfig: (values: ParserTabConfig) => void;
}

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

  return (
    <FormProvider {...methods}>
      <form className={`form ${className ? ` ${className}` : ''}`}>
        <MainBlock />

        {preset !== 'custom' && <ConfigurationBlock />}

        {preset === 'custom' && <Scenario />}

        <ActionButtons />
      </form>
    </FormProvider>
  )
}

export default Form;