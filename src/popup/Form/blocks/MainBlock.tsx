import { Controller, useFormContext } from "react-hook-form";
import { useAutoFill } from "../../hooks/useAutoFill"
import Button from "../../Button";
import Hint from "../../Hint";
import InputField from "../../InputField";
import SelectField from "../../SelectField";
import FieldOptions from "../constants";
import "../index.css"

const MainBlock = () => {
  const { control } = useFormContext();
  const { autoFill } = useAutoFill();

  return (
    <fieldset className="form__settings">
      <legend className="form__settings-title">Main</legend>

      <div className='form__field'>
        <div className='form__field-title'>
          <label className='form__field-label'>Preset</label>
          <Hint hint='Выберите пресет парсера' />
        </div>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <SelectField isAccent={true} value={field.value} options={FieldOptions.PresertOptions}
              onChange={(val) => field.onChange(val)} />
            )} />
      </div>

      <div className='form__field'>
        <div className='form__field-title'>
          <label className='form__field-label'>Source</label>
          <Hint hint='Введите url источника' hintPosition='left' />
          <Button title="auto-fill" className="form__button--small form__button--main" onClick={autoFill} />
        </div>
        <Controller
          name="source"
          control={control}
          render={({ field }) => (
            <InputField value={field.value} isAccent={true} placeholder='https://example.com' onChange={field.onChange} />
          )} />
      </div>
    </fieldset>
  )
}

export default MainBlock;