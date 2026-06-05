import Hint from "../../Hint";
import SelectField from "../../SelectField";
import FieldOptions from "../constants";
import "../index.css"
import SwitchField from "../../SwitchField";

interface ISettings {
  clicks: 'none' | 'products' | 'category' | 'all',
  pagination: boolean,
  parameters: boolean,
  modifiers: boolean
}

interface ISettingsBlock {
  settings: ISettings;
  onChange: (value: ISettings) => void;
}

const SettingsBlock = ({ settings, onChange }: ISettingsBlock) => {
  return (
    <fieldset className="form__settings">
      <legend className="form__settings-title">Settings</legend>
      <div className='form__field'>
        <div className='form__field-title'>
          <label className='form__field-label'>Clicks</label>
          <Hint hint='Выберите по какому элементу требуются клики' />
        </div>
        <SelectField value={settings.clicks} options={FieldOptions.ClicksOptions} onChange={(value) => onChange({...settings, clicks: value as ISettings['clicks']})} />
      </div>

      <div className='form__field'>
        <div className='form__field-title'>
          <label className='form__field-label'>Pagination</label>
          <Hint hint='Требуется ли переключение страниц' hintPosition='left' />
        </div>
        <SwitchField value={settings.pagination} onChange={(value) => onChange({...settings, pagination: value})} />
      </div>

      <div className='form__field'>
        <div className='form__field-title'>
          <label className='form__field-label'>Parameters</label>
          <Hint hint='Есть ли у товара несколько вариаций' />
        </div>
        <SwitchField value={settings.parameters} onChange={(value) => onChange({...settings, parameters: value})} />
      </div>

      <div className='form__field'>
        <div className='form__field-title'>
          <label className='form__field-label'>Modifiers</label>
          <Hint hint='Есть ли в номенклатуре модификаторы' hintPosition='left' />
        </div>
        <SwitchField value={settings.modifiers} onChange={(value) => onChange({...settings, modifiers: value})} />
      </div>
    </fieldset>
  )
}

export default SettingsBlock;