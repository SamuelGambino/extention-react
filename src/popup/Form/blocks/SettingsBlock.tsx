import { useState } from "react";
import Hint from "../../Hint";
import InputField from "../../InputField";
import SelectField from "../../SelectField";
import FieldOptions from "../constants";
import "../index.css"

interface IInputField {
  preset: string;
  onPresetChange: (value: string) => void;
}

const SettingsBlock = ({ preset }: { preset: string }) => {
  const [clicks, setClicks] = useState('none');
  const [pagination, setPagination] = useState(false);
  
  return (
    <fieldset className="form__settings">
      <legend className="form__settings-title">Settings</legend>
      <div className='form__field'>
        <div className='form__field-title'>
          <label className='form__field-label'>Clicks</label>
          <Hint hint='Выберите по какому элементу требуются клики' />
        </div>
        <SelectField value='none' options={FieldOptions.ClicksOptions} onChange={setClicks} />
      </div>

      <div className='form__field'>
        <div className='form__field-title'>
          <label className='form__field-label'>Pagination</label>
          <Hint hint='Требуется ли переключение страниц' hintPosition='left' />
        </div>
        <SwitchField onChange={setPagination} />
      </div>

      <div className='form__field'>
        <div className='form__field-title'>
          <label className='form__field-label'>Parameters</label>
          <Hint hint='Есть ли у товара несколько вариаций' />
        </div>
        <SwitchField onChange={setParameters} />
      </div>

      <div className='form__field'>
        <div className='form__field-title'>
          <label className='form__field-label'>Modifiers</label>
          <Hint hint='Есть ли в номенклатуре модификаторы' hintPosition='left' />
        </div>
        <SwitchField onChange={setModifiers} />
      </div>
    </fieldset>
  )
}

export default SettingsBlock;