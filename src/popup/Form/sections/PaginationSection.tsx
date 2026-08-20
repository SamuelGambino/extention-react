import { Controller, useFormContext } from "react-hook-form";
import InputField from "../../InputField";
import "../index.css";
import { t } from "../../i18n";

const PaginationSection = () => {
  const { control } = useFormContext();

  return (
    <div className="form__section">
      <span className="form__section-title">{t("form.sections.pagination")}</span>

      <div className="form__section-content">
        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>{t("form.fields.pagesContainer")}</label>
          </div>
          <Controller
            name="data.selectors.pagination.container"
            control={control}
            render={({ field }) => (
              <InputField placeholder={t("form.placeholders.pagesContainer")} value={field.value} onChange={field.onChange} />
            )} />
        </div>

        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>{t("form.fields.nextPage")}</label>
          </div>
          <Controller
            name="data.selectors.pagination.click"
            control={control}
            render={({ field }) => (
              <InputField placeholder={t("form.placeholders.nextPage")} value={field.value} onChange={field.onChange} />
            )} />
        </div>
      </div>
    </div>
  )
}

export default PaginationSection;