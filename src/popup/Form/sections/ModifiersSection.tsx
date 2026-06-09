import { Controller, useFormContext } from "react-hook-form";
import InputField from "../../InputField";
import SelectField from "../../SelectField";
import FieldOptions from "../constants";
import "../index.css";

const ModifiersSection = () => {
  const { control } = useFormContext();

  return (
    <div className="form__section">
      <span className="form__section-title">Modifiers</span>

      <div className="form__section-content">
        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>Modifiers group container</label>
          </div>
          <Controller
            name="data.selectors.modifiers.group.container"
            control={control}
            render={({ field }) => (
              <InputField placeholder='ul.modifiers' value={field.value} onChange={field.onChange} />
            )} />
        </div>

        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>Modifiers group name</label>
          </div>
          <Controller
            name="data.selectors.modifiers.group.name"
            control={control}
            render={({ field }) => (
              <InputField placeholder='p.modifiers-title' value={field.value} onChange={field.onChange} />
            )} />
        </div>

        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>Default group type</label>
          </div>
          <Controller
            name="data.selectors.modifiers.group.type"
            control={control}
            render={({ field }) => (
              <SelectField options={FieldOptions.GroupTypes} value={field.value} onChange={field.onChange} />
            )} />
        </div>

        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>Modifier</label>
          </div>
          <Controller
            name="data.selectors.modifiers.mod.container"
            control={control}
            render={({ field }) => (
              <InputField placeholder='li.modifier' value={field.value} onChange={field.onChange} />
            )} />
        </div>

        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>Modifier name</label>
          </div>
          <Controller
            name="data.selectors.modifiers.mod.name"
            control={control}
            render={({ field }) => (
              <InputField placeholder='span.modifier-name' value={field.value} onChange={field.onChange} />
            )} />
        </div>

        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>Modifier price</label>
          </div>
          <Controller
            name="data.selectors.modifiers.mod.price"
            control={control}
            render={({ field }) => (
              <InputField placeholder='span.modifier-price' value={field.value} onChange={field.onChange} />
            )} />
        </div>
      </div>
    </div>
  )
}

export default ModifiersSection;