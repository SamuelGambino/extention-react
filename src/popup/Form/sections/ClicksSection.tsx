import { Controller, useFormContext } from "react-hook-form";
import InputField from "../../InputField";
import "../index.css";
import { t } from "../../i18n";

const ClicksSection = () => {
  const { control, watch } = useFormContext();

  const clicks = watch('data.settings.clicks');

  return (
    <div className="form__section">
      <span className="form__section-title">{t("form.sections.clicks")}</span>

      {clicks !== 'none' && (clicks === 'products' || clicks === 'all') && (
        <div className="form__section-content">
          <div className='form__field'>
            <div className='form__field-title'>
              <label className='form__field-label'>{t("form.fields.openProduct")}</label>
            </div>
            <Controller
              name="data.selectors.clicks.product.open"
              control={control}
              render={({ field }) => (
                <InputField placeholder={t("form.placeholders.openProduct")} value={field.value} onChange={field.onChange} />
              )} />
          </div>

          <div className='form__field'>
            <div className='form__field-title'>
              <label className='form__field-label'>{t("form.fields.exitProduct")}</label>
            </div>
            <Controller
              name="data.selectors.clicks.product.exit"
              control={control}
              render={({ field }) => (
                <InputField placeholder={t("form.placeholders.exitProduct")} value={field.value} onChange={field.onChange} />
              )} />
          </div>
        </div>
      )}

      {clicks !== 'none' && (clicks === 'category' || clicks === 'all') && (
        <div className="form__section-content">
          <div className='form__field'>
            <div className='form__field-title'>
              <label className='form__field-label'>{t("form.fields.openCategory")}</label>
            </div>
            <Controller
              name="data.selectors.clicks.category.exit"
              control={control}
              render={({ field }) => (
                <InputField placeholder={t("form.placeholders.openCategory")} value={field.value} onChange={field.onChange} />
              )} />
          </div>

          <div className='form__field'>
            <div className='form__field-title'>
              <label className='form__field-label'>{t("form.fields.exitCategory")}</label>
            </div>
            <Controller
              name="data.selectors.clicks.category.exit"
              control={control}
              render={({ field }) => (
                <InputField placeholder={t("form.placeholders.exitCategory")} value={field.value} onChange={field.onChange} />
              )} />
          </div>
        </div>
      )}
    </div>
  );
}

export default ClicksSection;