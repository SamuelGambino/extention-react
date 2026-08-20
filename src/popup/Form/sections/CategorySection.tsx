import { Controller, useFormContext } from 'react-hook-form';
import InputField from "../../InputField";
import "../index.css";
import { t } from "../../i18n";

const CategorySection = () => {
  const { control } = useFormContext();
  
  return (
    <div className="form__section">
      <span className="form__section-title">{t("form.sections.category")}</span>

      <div className="form__section-content">
        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>{t("form.fields.container")}</label>
          </div>
          <Controller
            name="data.selectors.category.container"
            control={control}
            render={({ field }) => (
              <InputField placeholder={t("form.placeholders.categoryContainer")} value={field.value} onChange={field.onChange} />
            )} />
        </div>

        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>{t("form.fields.name")}</label>
          </div>
          <Controller
            name="data.selectors.category.name"
            control={control}
            render={({ field }) => (
              <InputField placeholder={t("form.placeholders.categoryName")} value={field.value} onChange={field.onChange} />
            )} />
        </div>
      </div>
    </div>
  )
}

export default CategorySection;