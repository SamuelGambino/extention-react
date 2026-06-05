import "../index.css";
import InputField from "../../InputField";
import ClicksSection from "../sections/ClicksSection";
import ModifiersSection from "../sections/ModifiersSection";
import PaginationSection from "../sections/PaginationSection";
import ParametersSection from "../sections/ParametersSection";
import CategorySection from "../sections/CategorySection";
import ProductSection from "../sections/ProductSection";
import Hint from "../../Hint";

interface ISettings {
  clicks: 'none' | 'products' | 'category' | 'all',
  pagination: boolean,
  parameters: boolean,
  modifiers: boolean
}

interface IConfigurationBlock {
  settings: ISettings;
  preset: string;
}

const ConfigurationBlock: React.FC<IConfigurationBlock> = ({ settings, preset }) => {
  const { clicks, pagination, parameters, modifiers } = settings;
  const hasSections = preset === 'custom' || preset === 'api';

  return (
    <fieldset className="form__settings">
      <legend className="form__settings-title">Configuration</legend>

      {preset === 'vk' && (
        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>Market ID</label>
            <Hint hint='ID группы в ВКонтакте' />
          </div>
          <InputField placeholder='123123123' onChange={() => { }} />
        </div>
      )}

      {preset === 'yandex_eda' && (
        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>API URL</label>
            <Hint hint='API URL для получения меню из Яндекс Еды' />
          </div>
          <InputField placeholder='https://api.yandex.ru/eda/v1/menu' onChange={() => { }} />
        </div>
      )}

      {preset === 'chibbis' && (
        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>API URL</label>
            <Hint hint='API URL для получения меню из Chibbis' />
          </div>
          <InputField placeholder='https://chibbis.ru/webapi/restaurants' onChange={() => { }} />
        </div>
      )}

      {hasSections && <CategorySection />}

      {hasSections && <ProductSection />}

      {hasSections && clicks !== 'none' && <ClicksSection clicks={clicks} />}

      {hasSections && pagination && <PaginationSection />}

      {hasSections && parameters && <ParametersSection />}

      {hasSections && modifiers && <ModifiersSection />}
    </fieldset>
  )
}

export default ConfigurationBlock;