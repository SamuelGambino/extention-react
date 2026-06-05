import InputField from "../../InputField";
import SelectField from "../../SelectField";
import FieldOptions from "../constants";
import "../index.css";

const ModifiersSection = () => {

  return (
    <div className="form__section">
      <span className="form__section-title">Modifiers</span>

      <div className="form__section-content">
        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>Modifiers group container</label>
          </div>
          <InputField placeholder='ul.modifiers' onChange={() => { }} />
        </div>

        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>Modifiers group name</label>
          </div>
          <InputField placeholder='p.modifiers-title' onChange={() => { }} />
        </div>

        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>Default group type</label>
          </div>
          <SelectField value='none' options={FieldOptions.GroupTypes} onChange={() => { }} />
        </div>

        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>Modifier</label>
          </div>
          <InputField placeholder='li.modifier' onChange={() => { }} />
        </div>

        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>Modifier name</label>
          </div>
          <InputField placeholder='span.modifier-name' onChange={() => { }} />
        </div>

        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>Modifier price</label>
          </div>
          <InputField placeholder='span.modifier-price' onChange={() => { }} />
        </div>
      </div>
    </div>
  )
}

export default ModifiersSection;