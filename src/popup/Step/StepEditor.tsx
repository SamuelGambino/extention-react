import { Controller, useFormContext } from "react-hook-form";
import "./index.css";
import SwitchField from "../SwitchField";
interface StepEditorProps {
    type: string;
    path: string;
}

const StepEditor = ({ type, path }: StepEditorProps) => {
    const { control } = useFormContext();

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

        case "click":
            return (
                <div className="step__field">
                    <p>Selector:</p>
                    <Controller
                        name={`${path}.params.selector`}
                        control={control}
                        render={({ field }) => (
                            <input className="step__field-input" type="text" value={field.value} onChange={field.onChange} />
                        )} />
                </div>
            )

        case "wait":
            return (
                <div className="step__field">
                    <p>Duration:</p>
                    <Controller
                        name={`${path}.params.duration`}
                        control={control}
                        render={({ field }) => (
                            <input className="step__field-input" type="text" value={field.value} onChange={field.onChange} />
                        )} />
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
                                // <input className="step__field-input" type="text" value={field.value} onChange={field.onChange} />
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
                    <div className="step__field">
                        <p>Selector:</p>
                        <Controller
                            name={`${path}.params.selector`}
                            control={control}
                            render={({ field }) => (
                                <input className="step__field-input" type="text" value={field.value} onChange={field.onChange} />
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
            );
    }
};

export default StepEditor;
