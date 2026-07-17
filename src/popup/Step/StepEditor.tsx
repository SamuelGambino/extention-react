import { Controller, useFormContext, useWatch } from "react-hook-form";
import "./index.css";
import SwitchField from "../SwitchField";
import RadioField from "../RadioField";
interface StepEditorProps {
    type: string;
    path: string;
}

const StepEditor = ({ type, path }: StepEditorProps) => {
    const { control } = useFormContext();
    const step = useWatch({
        control,
        name: path
    });

    switch (type) {
        case "loop":
            return (
                <div className="step__field">
                    <p>Source:</p>
                    <Controller
                        name={`${path}.params.source`}
                        control={control}
                        render={({ field }) => (
                            <input className="step__field-input" type="text" value={field.value} onChange={field.onChange} />
                        )} />
                </div>
            )

        case "action":
            return (
                <div className="step__field-container">
                    <div className="step__field step__field--main">
                        <Controller
                            name={`${path}.params.action`}
                            control={control}
                            render={({ field }) => (
                                <RadioField data={[
                                    { label: "Click", value: "click" },
                                    { label: "Hover", value: "hover" }
                                ]} value={field.value} onChange={field.onChange} />
                            )} />
                    </div>
                    {step.params.action && (
                        <div className="step__field">
                            <p>Selector:</p>
                            <Controller
                                name={`${path}.params.selector`}
                                control={control}
                                render={({ field }) => (
                                    <input className="step__field-input" type="text" value={field.value} onChange={field.onChange} />
                                )} />
                        </div>
                    )}
                </div>
            )

        case "wait":
            return (
                <div className="step__field-container">
                    <div className="step__field step__field--main">
                        <Controller
                            name={`${path}.params.mode`}
                            control={control}
                            render={({ field }) => (
                                <RadioField data={[
                                    { label: "Timeout", value: "timeout" },
                                    { label: "For navigation", value: "navigation" },
                                    { label: "For element", value: "element" }
                                ]} value={field.value} onChange={field.onChange} />
                            )} />
                    </div>
                    {step.params.mode && step.params.mode === "timeout" && (
                        <div className="step__field">
                            <p>Duration:</p>
                            <Controller
                                name={`${path}.params.duration`}
                                control={control}
                                render={({ field }) => (
                                    <input className="step__field-input" type="text" value={field.value} onChange={field.onChange} />
                                )} />
                        </div>
                    )}
                    {step.params.mode && step.params.mode === "element" && (
                        <div className="step__field">
                            <p>Selector:</p>
                            <Controller
                                name={`${path}.params.selector`}
                                control={control}
                                render={({ field }) => (
                                    <input className="step__field-input" type="text" value={field.value} onChange={field.onChange} />
                                )} />
                        </div>
                    )}
                </div>
            )

        case "condition":
            return (
                <div className="step__field-container">
                    <div className="step__field">
                        <p>Exists:</p>
                        <Controller
                            name={`${path}.params.exists`}
                            control={control}
                            render={({ field }) => (
                                <SwitchField value={field.value} onChange={field.onChange} />
                            )} />
                    </div>
                    <div className="step__field">
                        <p>Selector:</p>
                        <Controller
                            name={`${path}.params.selector`}
                            control={control}
                            render={({ field }) => (
                                <input className="step__field-input" type="text" value={field.value} onChange={field.onChange} />
                            )} />
                    </div>
                </div>
            )

        case "collect":
            return (
                <div className="step__field-container">
                    <div className="step__field step__field--main">
                        <Controller
                            name={`${path}.params.entity`}
                            control={control}
                            render={({ field }) => (
                                <RadioField data={[
                                    { label: "Category", value: "category" },
                                    { label: "Product", value: "product" },
                                    { label: "Modifier Group", value: "modifier_group" },
                                    { label: "Modifier", value: "modifier" }
                                ]} value={field.value} onChange={field.onChange} />
                            )} />
                    </div>
                    {step.params.entity && (
                        <div className="step__field">
                            <p>Name:</p>
                            <Controller
                                name={`${path}.params.name`}
                                control={control}
                                render={({ field }) => (
                                    <input className="step__field-input" type="text" value={field.value} onChange={field.onChange} />
                                )} />
                        </div>
                    )}
                    {step.params.entity && (step.params.entity === "product" || step.params.entity === "modifier") && (
                        <div className="step__field">
                            <p>Price:</p>
                            <Controller
                                name={`${path}.params.price`}
                                control={control}
                                render={({ field }) => (
                                    <input className="step__field-input" type="text" value={field.value} onChange={field.onChange} />
                                )} />
                        </div>
                    )}
                    {step.params.entity && step.params.entity === "product" && (
                        <>
                            <div className="step__field">
                                <p>Picture:</p>
                                <Controller
                                    name={`${path}.params.picture`}
                                    control={control}
                                    render={({ field }) => (
                                        <input className="step__field-input" type="text" value={field.value} onChange={field.onChange} />
                                    )} />
                            </div>
                            <div className="step__field">
                                <p>Description:</p>
                                <Controller
                                    name={`${path}.params.description`}
                                    control={control}
                                    render={({ field }) => (
                                        <input className="step__field-input" type="text" value={field.value} onChange={field.onChange} />
                                    )} />
                            </div>
                            <div className="step__field">
                                <p>Old price:</p>
                                <Controller
                                    name={`${path}.params.old_price`}
                                    control={control}
                                    render={({ field }) => (
                                        <input className="step__field-input" type="text" value={field.value} onChange={field.onChange} />
                                    )} />
                            </div>
                            <div className="step__field">
                                <p>Weight:</p>
                                <Controller
                                    name={`${path}.params.weight`}
                                    control={control}
                                    render={({ field }) => (
                                        <input className="step__field-input" type="text" value={field.value} onChange={field.onChange} />
                                    )} />
                            </div>
                            <div className="step__field">
                                <p>Proteins:</p>
                                <Controller
                                    name={`${path}.params.proteins`}
                                    control={control}
                                    render={({ field }) => (
                                        <input className="step__field-input" type="text" value={field.value} onChange={field.onChange} />
                                    )} />
                            </div>
                            <div className="step__field">
                                <p>Fats:</p>
                                <Controller
                                    name={`${path}.params.fats`}
                                    control={control}
                                    render={({ field }) => (
                                        <input className="step__field-input" type="text" value={field.value} onChange={field.onChange} />
                                    )} />
                            </div>
                            <div className="step__field">
                                <p>Carbohydrates:</p>
                                <Controller
                                    name={`${path}.params.carbohydrates`}
                                    control={control}
                                    render={({ field }) => (
                                        <input className="step__field-input" type="text" value={field.value} onChange={field.onChange} />
                                    )} />
                            </div>
                            <div className="step__field">
                                <p>Calories:</p>
                                <Controller
                                    name={`${path}.params.calories`}
                                    control={control}
                                    render={({ field }) => (
                                        <input className="step__field-input" type="text" value={field.value} onChange={field.onChange} />
                                    )} />
                            </div>
                        </>
                    )}
                </div>
            );
    }
};

export default StepEditor;
