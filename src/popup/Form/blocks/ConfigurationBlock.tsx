import "../index.css";
import InputField from "../../InputField";
import Hint from "../../Hint";
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import type { ParserTabConfig } from "../../../globalTypes/parser_сonfig";
import { t } from "../../i18n";

const ConfigurationBlock = () => {
  const { control } = useFormContext<ParserTabConfig>();

  const preset = useWatch({ control, name: 'type' });

  return (
    <fieldset className="form__settings" key={preset}>
      <legend className="form__settings-title">{t("form.configuration")}</legend>

      {preset === 'vk' && (
        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>{t("form.marketId")}</label>
            <Hint hint={t("form.marketIdHint")} />
          </div>
          <Controller
            name="data.marketId"
            control={control}
            render={({ field }) => (
              <InputField placeholder={t("form.marketIdPlaceholder")} value={field.value} onChange={field.onChange} />
            )} />
        </div>
      )}

      {preset === 'whatsapp' && (
        <>
          <div className='form__field'>
            <div className='form__field-title'>
              <label className='form__field-label'>{t("form.payloadCatalogs")}</label>
              <Hint hint={t("form.payloadCatalogsHint")} />
            </div>
            <Controller
              name="data.paylodCatalogs"
              control={control}
              render={({ field }) => (
                <InputField placeholder={t("form.payloadPlaceholder")} value={field.value} onChange={field.onChange} />
              )} />
          </div>
          <div className='form__field'>
            <div className='form__field-title'>
              <label className='form__field-label'>{t("form.payloadProducts")}</label>
              <Hint hintPosition='left' hint={t("form.payloadProductsHint")} />
            </div>
            <Controller
              name="data.paylodProducts"
              control={control}
              render={({ field }) => (
                <InputField placeholder={t("form.payloadPlaceholder")} value={field.value} onChange={field.onChange} />
              )} />
          </div>
        </>
      )}

      {(preset === 'yandex' || preset === 'chibbis' || preset === 'kuper' || preset === "flowwow") && (
        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>{t("form.apiUrl")}</label>
            <Hint hint={t("form.apiUrlHint")} />
          </div>
          <Controller
            name="data.apiUrl"
            control={control}
            render={({ field }) => (
              <InputField placeholder={t("form.apiUrlPlaceholder")} value={field.value} onChange={field.onChange} />
            )} />
        </div>
      )}
    </fieldset>
  )
}

export default ConfigurationBlock;
