import Button from "../../Button";
import Hint from "../../Hint";
import InputField from "../../InputField";
import SelectField from "../../SelectField";
import FieldOptions from "../constants";
import "../index.css"

interface IInputField {
  preset: string;
  onPresetChange: (value: string) => void;
}

const MainBlock: React.FC<IInputField> = ({ preset, onPresetChange }) => {
  return (
    <fieldset className="form__settings">
      <legend className="form__settings-title">Main</legend>

      <div className='form__field'>
        <div className='form__field-title'>
          <label className='form__field-label'>Preset</label>
          <Hint hint='Выберите пресет парсера' />
        </div>
        <SelectField isAccent={true} value={preset} options={FieldOptions.PresertOptions} onChange={onPresetChange} />
      </div>

      <div className='form__field'>
        <div className='form__field-title'>
          <label className='form__field-label'>Source</label>
          <Hint hint='Введите url источника' hintPosition='left' />
          <Button title="auto-fill" className="form__button--small form__button--main" onClick={() => { }} />
        </div>
        <InputField isAccent={true} placeholder='https://example.com' onChange={() => { }}>
        </InputField>
      </div>
    </fieldset>
  )
}

export default MainBlock;