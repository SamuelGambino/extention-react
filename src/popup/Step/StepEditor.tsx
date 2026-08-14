import { Controller, useFormContext, useWatch } from "react-hook-form";
import "./index.css";
import SwitchField from "../SwitchField";
import RadioField from "../RadioField";

interface StepEditorProps {
  type: string;
  path: string;
  depth?: number;
}

const SOURCE_OPTIONS = [
  { label: "Document", value: "document" },
  { label: "Element", value: "element" },
];

const ACTION_OPTIONS = [
  { label: "Click", value: "click" },
  { label: "Hover", value: "hover" },
];

const WAIT_OPTIONS = [
  { label: "Timeout", value: "timeout" },
  { label: "For navigation", value: "navigation" },
  { label: "For element", value: "element" },
];

const ENTITY_OPTIONS = [
  { label: "Category", value: "category" },
  { label: "Product", value: "product" },
  { label: "Modifier Group", value: "modifier_group" },
  { label: "Modifier", value: "modifier" },
  { label: "Product parameter", value: "product_parameter" },
];

const PRODUCT_FIELDS = [
  { label: "Picture", name: "picture" },
  { label: "Description", name: "description" },
  { label: "Weight", name: "weight" },
];

const PARAMETER_FIELDS = [
  { label: "Old price", name: "old_price" },
  { label: "Proteins", name: "proteins" },
  { label: "Fats", name: "fats" },
  { label: "Carbohydrates", name: "carbohydrates" },
  { label: "Calories", name: "calories" },
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
      <p>Source:</p>
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
    return (
      <div className="step__field-container">
        {renderSourceField()}
        {renderTextField("Selector", "selector")}
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
        {params.action && renderTextField("Selector", "selector")}
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
        {params.mode === "timeout" && renderTextField("Duration", "duration", "number")}
        {params.mode === "element" && (
          <>
            {renderSourceField()}
            {renderTextField("Selector", "selector")}
          </>
        )}
      </div>
    );
  }

  if (type === "condition") {
    return (
      <div className="step__field-container">
        <div className="step__field">
          <p>Exists:</p>
          <Controller
            name={`${path}.params.exists`}
            control={control}
            render={({ field }) => (
              <SwitchField value={field.value ?? false} onChange={field.onChange} />
            )}
          />
        </div>
        {renderSourceField()}
        {renderTextField("Selector", "selector")}
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
            {renderTextField("Name", "name")}
          </>
        )}
        {hasPrice && renderTextField("Price", "price")}
        {entity === "product" && PRODUCT_FIELDS.map(({ label, name }) => renderTextField(label, name))}
        {hasParameterFields && PARAMETER_FIELDS.map(({ label, name }) => renderTextField(label, name))}
        {entity === "product_parameter" && renderTextField("Index", "index")}
      </div>
    );
  }

  return null;
};

export default StepEditor;