import "../index.css";
import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Step from "../../Step";
import type { ParserTabConfig, IStep, StepType } from "../../../globalTypes/parser_сonfig";
import type { FieldArrayPath } from "react-hook-form";
import SelectField from "../../SelectField";
import Button from "../../Button";
import { t } from "../../i18n";
import { terms } from "../../../shared/i18n/terms";

interface ScenarioListProps {
  path: string;
  depth?: number;
  StepMeta: Record<string, { color: string; placeholder: string; desc: string }>;
}

const STEP_TYPE_LABELS: Record<StepType, string> = {
  collect: t("form.stepTypes.collect"),
  action: t("form.stepTypes.action"),
  loop: t("form.stepTypes.loop"),
  wait: t("form.stepTypes.wait"),
  condition: t("form.stepTypes.condition"),
};

const ScenarioList = ({ path, depth, StepMeta }: ScenarioListProps) => {
  const { control } = useFormContext<ParserTabConfig>();
  const [selectedType, setSelectedType] = useState<StepType>("loop");
  const STEP_TYPES = Object.keys(StepMeta) as StepType[];

  const { fields, move, append, remove } = useFieldArray({
    control,
    name: path as FieldArrayPath<ParserTabConfig>,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) return;
    const oldIndex = fields.findIndex(
      ({ id }) => id === active.id
    );
    const newIndex = fields.findIndex(
      ({ id }) => id === over.id
    );
    move(oldIndex, newIndex);
  };

  const createStep = (): IStep => {
    const meta = StepMeta[selectedType];

    switch (selectedType) {
      case "collect":
        return { type: "collect", params: { entity: "category", name: meta.placeholder } };
      case "action":
        return { type: "action", params: { action: "click", selector: meta.placeholder } };
      case "loop":
        return { type: "loop", params: { selector: meta.placeholder }, children: [] };
      case "wait":
        return { type: "wait", params: { mode: "timeout", duration: 1200 } };
      case "condition":
        return { type: "condition", params: { exists: false, selector: meta.placeholder }, children: [] };
    }
  };

  const handleAddStep = () => append(createStep());

  return (
    <div className="form__list">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          // items={fields}
          items={fields.map(f => f.id)}
          strategy={verticalListSortingStrategy}
        >
          {fields.map((field, index) => (
            <Step
              key={field.id}
              sortableId={field.id}
              path={`${path}.${index}`}
              index={index}
              onRemove={() => remove(index)}
              depth={depth ?? 0}
              StepMeta={StepMeta}
            />
          ))}
        </SortableContext>
      </DndContext>

      <div className="form__list-add" style={{ marginTop: `${depth ? (depth === 0 ? 10 : 0) : 10}px` }}>
        {depth && depth > 0 && (
          <div className="form__indent">
            {Array.from({ length: depth }).map((_, i) => (
              <div
                key={i}
                className={`form__indent-line ${i === depth - 1 ? "form__indent-line--last" : ""}`}
              />
            ))}
          </div>
        )}

        <SelectField className="form__list-select" value={selectedType} options={STEP_TYPES.map((type) => ({ value: type, label: STEP_TYPE_LABELS[type], description: StepMeta[type].desc, color: StepMeta[type].color }))} onChange={(value) => {
          setSelectedType(value as StepType);
        }} />

        <Button className="form__list-btn" title={terms.form.addStep} onClick={handleAddStep} />
      </div>
    </div>
  );
};

export default ScenarioList;