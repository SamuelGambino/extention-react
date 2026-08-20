import { Controller, useFormContext } from "react-hook-form";
import InputField from "../../InputField";
import "../index.css";
import { t } from "../../i18n";

const ProductSection = () => {
  const { control } = useFormContext();

  return (
    <div className="form__section">
      <span className="form__section-title">{t("form.sections.product")}</span>

      <div className="form__section-content">
        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>{t("form.fields.container")}</label>
          </div>
          <Controller
            name="data.selectors.product.container"
            control={control}
            render={({ field }) => (
              <InputField placeholder={t("form.placeholders.productContainer")} value={field.value} onChange={field.onChange} />
            )} />
        </div>

        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>{t("form.fields.picture")}</label>
          </div>
          <Controller
            name="data.selectors.product.picture"
            control={control}
            render={({ field }) => (
              <InputField placeholder={t("form.placeholders.productPicture")} value={field.value} onChange={field.onChange} />
            )} />
        </div>

        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>{t("form.fields.name")}</label>
          </div>
          <Controller
            name="data.selectors.product.name"
            control={control}
            render={({ field }) => (
              <InputField placeholder={t("form.placeholders.productName")} value={field.value} onChange={field.onChange} />
            )} />
        </div>

        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>{t("form.fields.description")}</label>
          </div>
          <Controller
            name="data.selectors.product.description"
            control={control}
            render={({ field }) => (
              <InputField placeholder={t("form.placeholders.productDescription")} value={field.value} onChange={field.onChange} />
            )} />
        </div>

        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>{t("form.fields.weight")}</label>
          </div>
          <Controller
            name="data.selectors.product.weight"
            control={control}
            render={({ field }) => (
              <InputField placeholder={t("form.placeholders.productWeight")} value={field.value} onChange={field.onChange} />
            )} />
        </div>

        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>{t("form.fields.price")}</label>
          </div>
          <Controller
            name="data.selectors.product.price"
            control={control}
            render={({ field }) => (
              <InputField placeholder={t("form.placeholders.productPrice")} value={field.value} onChange={field.onChange} />
            )} />
        </div>
      </div>
    </div>
  )
}

export default ProductSection;