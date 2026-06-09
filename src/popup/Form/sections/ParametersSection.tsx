import { Controller, useFormContext } from "react-hook-form";
import InputField from "../../InputField";
import "../index.css";

const ParametersSection = () => {
  const { control } = useFormContext();

  return (
    <div className="form__section">
      <span className="form__section-title">Parameters</span>

      <div className="form__section-content">
        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>Parameter container</label>
          </div>
          <Controller
            name="data.selectors.parameters.container"
            control={control}
            render={({ field }) => (
              <InputField placeholder='div.parameters' value={field.value} onChange={field.onChange} />
            )} />
        </div>

        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>Parameter description</label>
          </div>
          <Controller
            name="data.selectors.parameters.description"
            control={control}
            render={({ field }) => (
              <InputField placeholder='p.parameter-description' value={field.value} onChange={field.onChange} />
            )} />
        </div>

        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>Parameter click</label>
          </div>
          <Controller
            name="data.selectors.parameters.click"
            control={control}
            render={({ field }) => (
              <InputField placeholder='button.parameter-click' value={field.value} onChange={field.onChange} />
            )} />
        </div>

        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>Parameter price</label>
          </div>
          <Controller
            name="data.selectors.parameters.price"
            control={control}
            render={({ field }) => (
              <InputField placeholder='span.parameter-price' value={field.value} onChange={field.onChange} />
            )} />
        </div>
      </div>
    </div>
  )
}

export default ParametersSection;