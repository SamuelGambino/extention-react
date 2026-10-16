import { Controller, useFormContext, useWatch } from "react-hook-form";
import "./index.css";
import SwitchField from "../SwitchField";
import RadioField from "../RadioField";
import { t } from "../i18n";

interface StepEditorProps {
  type: string;
  path: string;
  depth?: number;
}

const SOURCE_OPTIONS = [
  { label: t("step.sourceOptions.document"), value: "document" },
  { label: t("step.sourceOptions.element"), value: "element" },
];

const ACTION_OPTIONS = [
  { label: t("step.actionOptions.click"), value: "click" },
  { label: t("step.actionOptions.hover"), value: "hover" },
];

const WAIT_OPTIONS = [
  { label: t("step.waitOptions.timeout"), value: "timeout" },
  { label: t("step.waitOptions.navigation"), value: "navigation" },
  { label: t("step.waitOptions.element"), value: "element" },
];

const ENTITY_OPTIONS = [
  { label: t("step.entityOptions.category"), value: "category" },
  { label: t("step.entityOptions.product"), value: "product" },
  { label: t("step.entityOptions.modifierGroup"), value: "modifier_group" },
  { label: t("step.entityOptions.modifier"), value: "modifier" },
  { label: t("step.entityOptions.productParameter"), value: "product_parameter" },
];

const LOOP_ENTITY_OPTIONS = [
  { label: t("step.entityOptions.noEntityContext"), value: "" },
  ...ENTITY_OPTIONS,
];

const LOOP_CONTEXT_STRATEGY_OPTIONS = [
  { label: t("step.contextStrategyOptions.snapshot"), value: "snapshot" },
  { label: t("step.contextStrategyOptions.dynamic"), value: "dynamic" },
  { label: t("step.contextStrategyOptions.keyed"), value: "keyed" },
];

const LOOP_KEY_TYPE_OPTIONS = [
  { label: t("step.keyTypeOptions.text"), value: "text" },
  { label: t("step.keyTypeOptions.attribute"), value: "attribute" },
];

const PRODUCT_FIELDS = [
  { label: t("form.fields.picture"), name: "picture" },
  { label: t("form.fields.description"), name: "description" },
  { label: t("form.fields.weight"), name: "weight" },
];

const PARAMETER_FIELDS = [
  { label: t("step.oldPrice"), name: "old_price" },
  { label: t("step.proteins"), name: "proteins" },
  { label: t("step.fats"), name: "fats" },
  { label: t("step.carbohydrates"), name: "carbohydrates" },
  { label: t("step.calories"), name: "calories" },
];

const StepEditor = ({ type, path, depth = 0 }: StepEditorProps) => {
  const { control } = useFormContext();
  const step = useWatch({ control, name: path });
  const params = step?.params ?? {};

  const renderTextField = (label: string, name: string, inputType = "text") => (
    <div className="step__field" key={name}>
      <p>{label}:</p>
      <Controller
        name={`${path}.params.${name}`}
        control={control}
        render={({ field }) => (
          <input
            className="step__field-input"
            type={inputType}
            value={field.value ?? ""}
            onChange={field.onChange}
          />
        )}
      />
    </div>
  );

  const renderSourceField = () => depth > 0 && (
    <div className="step__field">
      <p>{t("step.source")}:</p>
      <Controller
        name={`${path}.params.source`}
        control={control}
        render={({ field }) => (
          <RadioField data={SOURCE_OPTIONS} value={field.value ?? "document"} onChange={field.onChange} />
        )}
      />
    </div>
  );

  if (type === "loop") {
    const contextStrategy = params.contextStrategy ?? "snapshot";
    const keyType = params.keyType ?? "text";

    return (
      <div className="step__field-container">
        <div className="step__field">
          <p>{t("step.entityContext")}:</p>
          <Controller
            name={`${path}.params.entity`}
            control={control}
            render={({ field }) => (
              <RadioField
                data={LOOP_ENTITY_OPTIONS}
                value={field.value ?? ""}
                onChange={(value) => field.onChange(value || undefined)}
              />
            )}
          />
        </div>
        <div className="step__field">
          <p>{t("step.contextStrategy")}:</p>
          <Controller
            name={`${path}.params.contextStrategy`}
            control={control}
            render={({ field }) => (
              <RadioField
                data={LOOP_CONTEXT_STRATEGY_OPTIONS}
                value={field.value ?? "snapshot"}
                onChange={field.onChange}
              />
            )}
          />
        </div>
        {contextStrategy === "keyed" && (
          <>
            <div className="step__field">
              <p>{t("step.keyType")}:</p>
              <Controller
                name={`${path}.params.keyType`}
                control={control}
                render={({ field }) => (
                  <RadioField
                    data={LOOP_KEY_TYPE_OPTIONS}
                    value={field.value ?? "text"}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
            {keyType === "attribute" && renderTextField(t("step.keyAttribute"), "keyAttribute")}
          </>
        )}
        {renderSourceField()}
        {renderTextField(t("step.selector"), "selector")}
      </div>
    );
  }

  if (type === "action") {
    return (
      <div className="step__field-container">
        <div className="step__field step__field--main">
          <Controller
            name={`${path}.params.action`}
            control={control}
            render={({ field }) => (
              <RadioField data={ACTION_OPTIONS} value={field.value ?? "click"} onChange={field.onChange} />
            )}
          />
        </div>
        {renderSourceField()}
        {params.action && renderTextField(t("step.selector"), "selector")}
      </div>
    );
  }

  if (type === "wait") {
    return (
      <div className="step__field-container">
        <div className="step__field step__field--main">
          <Controller
            name={`${path}.params.mode`}
            control={control}
            render={({ field }) => (
              <RadioField data={WAIT_OPTIONS} value={field.value ?? "timeout"} onChange={field.onChange} />
            )}
          />
        </div>
        {params.mode === "timeout" && renderTextField(t("step.duration"), "duration", "number")}
        {params.mode === "element" && (
          <>
            {renderSourceField()}
            {renderTextField(t("step.selector"), "selector")}
          </>
        )}
      </div>
    );
  }

  if (type === "condition") {
    return (
      <div className="step__field-container">
        <div className="step__field">
          <p>{t("step.exists")}:</p>
          <Controller
            name={`${path}.params.exists`}
            control={control}
            render={({ field }) => (
              <SwitchField value={field.value ?? false} onChange={field.onChange} />
            )}
          />
        </div>
        {renderSourceField()}
        {renderTextField(t("step.selector"), "selector")}
      </div>
    );
  }

  if (type === "collect") {
    const entity = params.entity;
    const hasPrice = entity === "product" || entity === "modifier" || entity === "product_parameter";
    const hasParameterFields = entity === "product" || entity === "product_parameter";

    return (
      <div className="step__field-container">
        <div className="step__field step__field--main">
          <Controller
            name={`${path}.params.entity`}
            control={control}
            render={({ field }) => (
              <RadioField data={ENTITY_OPTIONS} value={field.value ?? "category"} onChange={field.onChange} />
            )}
          />
        </div>
        {entity && (
          <>
            {renderSourceField()}
            {renderTextField(t("form.fields.name"), "name")}
          </>
        )}
        {hasPrice && renderTextField(t("form.fields.price"), "price")}
        {entity === "product" && PRODUCT_FIELDS.map(({ label, name }) => renderTextField(label, name))}
        {hasParameterFields && PARAMETER_FIELDS.map(({ label, name }) => renderTextField(label, name))}
        {entity === "product_parameter" && renderTextField(t("step.index"), "index")}
      </div>
    );
  }

  return null;
};

export default StepEditor;
