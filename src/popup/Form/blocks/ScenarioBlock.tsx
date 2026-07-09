import Hint from "../../Hint";
import SelectField from "../../SelectField";
import FieldOptions from "../constants";
import "../index.css"
import SwitchField from "../../SwitchField";
import { Controller, useFormContext } from "react-hook-form";

const ScenarioBlock = () => {
  const { control } = useFormContext();

  return (
    <fieldset className="form__settings">
      <legend className="form__settings-title">Scenario builder</legend>
      <div className='form__field' style={{opacity:0}}>
        <div className='form__field-title'>
          <label className='form__field-label'>Clicks</label>
          <Hint hint='Выберите по какому элементу требуются клики' />
        </div>
        <Controller
          name="data.settings.clicks"
          control={control}
          render={({ field }) => (
            <SelectField value={field.value} options={FieldOptions.ClicksOptions} onChange={field.onChange} />
          )} />
      </div>

      <div className='form__field' style={{opacity:0}}>
        <div className='form__field-title'>
          <label className='form__field-label'>Pagination</label>
          <Hint hint='Требуется ли переключение страниц' hintPosition='left' />
        </div>
        <Controller
          name="data.settings.pagination"
          control={control}
          render={({ field }) => (
            <SwitchField value={field.value} onChange={field.onChange} />
          )} />
      </div>

      <div className='form__field' style={{opacity:0}}>
        <div className='form__field-title'>
          <label className='form__field-label'>Parameters</label>
          <Hint hint='Есть ли у товара несколько вариаций' />
        </div>
        <Controller
          name="data.settings.parameters"
          control={control}
          render={({ field }) => (
            <SwitchField value={field.value} onChange={field.onChange} />
          )} />
      </div>

      <div className='form__field' style={{opacity:0}}>
        <div className='form__field-title'>
          <label className='form__field-label'>Modifiers</label>
          <Hint hint='Есть ли в номенклатуре модификаторы' hintPosition='left' />
        </div>
        <Controller
          name="data.settings.modifiers"
          control={control}
          render={({ field }) => (
            <SwitchField value={field.value} onChange={field.onChange} />
          )} />
      </div>
    </fieldset>
  )
}

export default ScenarioBlock;