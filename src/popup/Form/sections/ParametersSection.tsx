import { Controller, useFormContext } from "react-hook-form";
import InputField from "../../InputField";
import "../index.css";
import { t } from "../../i18n";

const ParametersSection = () => {
  const { control } = useFormContext();

  return (
    <div className="form__section">
      <span className="form__section-title">{t("form.sections.parameters")}</span>

      <div className="form__section-content">
        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>{t("form.fields.parameterContainer")}</label>
          </div>
          <Controller
            name="data.selectors.parameters.container"
            control={control}
            render={({ field }) => (
              <InputField placeholder={t("form.placeholders.parameterContainer")} value={field.value} onChange={field.onChange} />
            )} />
        </div>

        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>{t("form.fields.parameterDescription")}</label>
          </div>
          <Controller
            name="data.selectors.parameters.description"
            control={control}
            render={({ field }) => (
              <InputField placeholder={t("form.placeholders.parameterDescription")} value={field.value} onChange={field.onChange} />
            )} />
        </div>

        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>{t("form.fields.parameterClick")}</label>
          </div>
          <Controller
            name="data.selectors.parameters.click"
            control={control}
            render={({ field }) => (
              <InputField placeholder={t("form.placeholders.parameterClick")} value={field.value} onChange={field.onChange} />
            )} />
        </div>

        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>{t("form.fields.parameterPrice")}</label>
          </div>
          <Controller
            name="data.selectors.parameters.price"
            control={control}
            render={({ field }) => (
              <InputField placeholder={t("form.placeholders.parameterPrice")} value={field.value} onChange={field.onChange} />
            )} />
        </div>
      </div>
    </div>
  )
}

export default ParametersSection;