import { Controller, useFormContext } from "react-hook-form";
import "./index.css";
interface StepEditorProps {
    type: string;
    path: string;
}

const StepEditor = ({ type, path }: StepEditorProps) => {
  const { control } = useFormContext();

    switch (type) {
        // case "collect":
        //     return (
        //     );

        case "loop":
            return (
                <div className="step__field">
                    <p>Source:</p>
                    <Controller
                        name={`${path}.params.source`}
                        control={control}
                        render={({ field }) => (
                            <input className="step__field-input" type="text" onChange={field.onChange} />
                        )} />
                </div>
            )

        // case "action":
        //     return <ActionEditor ... />

        // case "wait":
        //     return <WaitEditor ... />

        // case "condition":
        //     return <ConditionEditor ... />
    }
};

export default StepEditor;
