import "./index.css";
import MainBlock from "./blocks/MainBlock";
import ScenarioList from "./blocks/ScenarioList";
import ConfigurationBlock from "./blocks/ConfigurationBlock";
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useEffect, useRef } from "react";
import type { ParserTabConfig } from "../../globalTypes/parser_сonfig";
import ActionButtons from "../ActionButtons";
import Constants from "./constants";
import { terms } from "../../shared/i18n/terms";

interface FormProps {
  className?: string;
  savedConfig: ParserTabConfig;
  saveConfig: (values: ParserTabConfig) => void;
}

const Form = ({ className, savedConfig, saveConfig }: FormProps) => {
  const methods = useForm<ParserTabConfig>({ defaultValues: savedConfig });
  const { control, watch } = methods;
  const lastSavedConfigRef = useRef(JSON.stringify(savedConfig));

  // Форма получает новый savedConfig после каждого автосохранения в storage.
  // Смена вкладки уже приводит к remount через key={tabId}, поэтому reset здесь
  // пересоздавал useFieldArray и сбрасывал локальное opened-состояние карточек шагов.

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
  }, [saveConfig, watch]);

  const preset = useWatch({ control, name: 'type' });

  return (
    <FormProvider {...methods}>
      <form className={`form ${className ? ` ${className}` : ''}`}>
        <div className="form__content">
          <MainBlock />

          {preset !== 'custom' && <ConfigurationBlock />}

          {preset === 'custom' && (
            <fieldset className="form__settings">
              <legend className="form__settings-title">{terms.form.scenarioBuilder}</legend>
              <ScenarioList StepMeta={Constants.StepMeta} />
            </fieldset>)}
        </div>

        <ActionButtons />
      </form>
    </FormProvider>
  )
}

export default Form;