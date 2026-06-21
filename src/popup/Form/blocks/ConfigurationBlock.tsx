import "../index.css";
import InputField from "../../InputField";
import ClicksSection from "../sections/ClicksSection";
import ModifiersSection from "../sections/ModifiersSection";
import PaginationSection from "../sections/PaginationSection";
import ParametersSection from "../sections/ParametersSection";
import CategorySection from "../sections/CategorySection";
import ProductSection from "../sections/ProductSection";
import Hint from "../../Hint";
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import type { ParserTabConfig } from "../../../globalTypes/parser_сonfig";

const ConfigurationBlock = () => {
  const { control } = useFormContext<ParserTabConfig>();

  const preset = useWatch({ control, name: 'type' });
  const settings = useWatch({ control, name: 'data.settings' });
  const clicks = settings?.clicks ?? 'none';
  const pagination = settings?.pagination ?? false;
  const parameters = settings?.parameters ?? false;
  const modifiers = settings?.modifiers ?? false;
  const hasSections = preset === 'custom' || preset === 'api';

  return (
    <fieldset className="form__settings" key={preset}>
      <legend className="form__settings-title">Configuration</legend>

      {preset === 'vk' && (
        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>Market ID</label>
            <Hint hint='ID группы в ВКонтакте' />
          </div>
          <Controller
            name="data.marketId"
            control={control}
            render={({ field }) => (
              <InputField placeholder='123123123' value={field.value} onChange={field.onChange} />
            )} />
        </div>
      )}

      {preset === 'yandex_eda' && (
        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>API URL</label>
            <Hint hint='API URL для получения меню из Яндекс Еды' />
          </div>
          <Controller
            name="data.apiUrl"
            control={control}
            render={({ field }) => (
              <InputField placeholder='https://api.yandex.ru/eda/v1/menu' value={field.value} onChange={field.onChange} />
            )} />
        </div>
      )}

      {preset === 'chibbis' && (
        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>API URL</label>
            <Hint hint='API URL для получения меню из Chibbis' />
          </div>
          <Controller
            name="data.apiUrl"
            control={control}
            render={({ field }) => (
              <InputField placeholder='https://chibbis.ru/webapi/restaurants' value={field.value} onChange={field.onChange} />
            )} />
        </div>
      )}

      {preset === 'yandex_map' && <CategorySection />}

      {preset === 'yandex_map' && <ProductSection />}

      {hasSections && <CategorySection />}

      {hasSections && <ProductSection />}

      {hasSections && clicks !== 'none' && <ClicksSection />}

      {hasSections && pagination && <PaginationSection />}

      {hasSections && parameters && <ParametersSection />}

      {hasSections && modifiers && <ModifiersSection />}
    </fieldset>
  )
}

export default ConfigurationBlock;
