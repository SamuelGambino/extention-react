import { Controller, useFormContext } from "react-hook-form";
import InputField from "../../InputField";
import SelectField from "../../SelectField";
import FieldOptions from "../constants";
import "../index.css";
import { t } from "../../i18n";

const ModifiersSection = () => {
  const { control } = useFormContext();

  return (
    <div className="form__section">
      <span className="form__section-title">{t("form.sections.modifiers")}</span>

      <div className="form__section-content">
        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>{t("form.fields.modifiersGroupContainer")}</label>
          </div>
          <Controller
            name="data.selectors.modifiers.group.container"
            control={control}
            render={({ field }) => (
              <InputField placeholder={t("form.placeholders.modifiersGroupContainer")} value={field.value} onChange={field.onChange} />
            )} />
        </div>

        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>{t("form.fields.modifiersGroupName")}</label>
          </div>
          <Controller
            name="data.selectors.modifiers.group.name"
            control={control}
            render={({ field }) => (
              <InputField placeholder={t("form.placeholders.modifiersGroupName")} value={field.value} onChange={field.onChange} />
            )} />
        </div>

        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>{t("form.fields.defaultGroupType")}</label>
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
            <label className='form__field-label'>{t("form.fields.modifier")}</label>
          </div>
          <Controller
            name="data.selectors.modifiers.mod.container"
            control={control}
            render={({ field }) => (
              <InputField placeholder={t("form.placeholders.modifierContainer")} value={field.value} onChange={field.onChange} />
            )} />
        </div>

        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>{t("form.fields.modifierName")}</label>
          </div>
          <Controller
            name="data.selectors.modifiers.mod.name"
            control={control}
            render={({ field }) => (
              <InputField placeholder={t("form.placeholders.modifierName")} value={field.value} onChange={field.onChange} />
            )} />
        </div>

        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>{t("form.fields.modifierPrice")}</label>
          </div>
          <Controller
            name="data.selectors.modifiers.mod.price"
            control={control}
            render={({ field }) => (
              <InputField placeholder={t("form.placeholders.modifierPrice")} value={field.value} onChange={field.onChange} />
            )} />
        </div>
      </div>
    </div>
  )
}

export default ModifiersSection;