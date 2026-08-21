import { Controller, useFormContext, useWatch } from "react-hook-form";
import { useAutoFill } from "../../hooks/useAutoFill";
import Button from "../../Button";
import Hint from "../../Hint";
import InputField from "../../InputField";
import SelectField from "../../SelectField";
import FieldOptions from "../constants";
import "../index.css";
import ScrambleText from "../../ScrambleText";
import type { ParserTabConfig } from "../../../globalTypes/parser_сonfig";
import { t } from "../../i18n";
import { terms } from "../../../shared/i18n/terms";

const PRESET_OPTIONS = FieldOptions.PresertOptions.map(({ label, value }) => ({ label, value }));

const MainBlock = () => {
  const { control } = useFormContext<ParserTabConfig>();
  const { autoFill } = useAutoFill();
  const preset = useWatch({ control, name: "type" });
  const presetDescription = FieldOptions.PresertOptions.find(({ value }) => value === preset)?.description ?? "";

  return (
    <fieldset className="form__settings">
      <legend className="form__settings-title">{terms.form.main}</legend>

      <div className="form__field">
        <div className="form__field-title">
          <label className="form__field-label">{terms.form.preset}</label>
          <Hint hint={t("form.selectPresetHint")} />
        </div>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <SelectField
              isAccent={true}
              value={field.value}
              options={PRESET_OPTIONS}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      <div className="form__field">
        <div className="form__field-title">
          <label className="form__field-label">{terms.form.source}</label>
          <Hint hint={t("form.sourceHint")} hintPosition="left" />
          <Button title={terms.form.autoFill} className="form__button--small form__button--main" onClick={autoFill} />
        </div>
        <Controller
          name="source"
          control={control}
          render={({ field }) => (
            <InputField value={field.value} isAccent={true} placeholder={t("form.sourcePlaceholder")} onChange={field.onChange} />
          )}
        />
      </div>

      <div className="form__hint">
        <ScrambleText className="form__hint-text" text={presetDescription} play={true} />
      </div>
    </fieldset>
  );
};

export default MainBlock;