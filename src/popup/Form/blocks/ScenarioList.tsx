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
import type { ParserTabConfig, StepType } from "../../../globalTypes/parser_сonfig";
import SelectField from "../../SelectField";
import Button from "../../Button";

interface ScenarioListProps {
  path: string;
  depth?: number;
  StepMeta: Record<string, { color: string; placeholder: string; desc: string }>;
}

const ScenarioList = ({ path, depth, StepMeta }: ScenarioListProps) => {
  const { control } = useFormContext<ParserTabConfig>();
  const [selectedType, setSelectedType] = useState<StepType>("navigate");
  const STEP_TYPES = Object.keys(StepMeta) as string[];

  const { fields, move, append, remove } = useFieldArray({
    control,
    name: path as any,
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

  const handleAddStep = () => {
    const meta = StepMeta[selectedType];
    append({
      type: selectedType,
      ...(selectedType === "navigate" && { url: meta.placeholder }),
      ...(selectedType === "collect" && { selector: meta.placeholder, urlMode: false }),
      ...(selectedType === "action" && { selector: meta.placeholder }),
      ...(selectedType === "loop" && { selector: meta.placeholder, children: [] }),
      ...(selectedType === "wait" && { ms: 1200 }),
      ...(selectedType === "condition" && { condition: meta.placeholder, children: [] }),
    } as any);
  };

  return (
    <div className="form__list">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          // items={fields}
          items={fields.map(f=>f.id)}
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
              isLast={index === fields.length - 1}
              StepMeta={StepMeta}
            />
          ))}
        </SortableContext>
      </DndContext>

      <div className="form__list-add" style={{ marginLeft: `${depth ? depth * 20 : 0}px` }}>
        <SelectField className="form__list-select" options={STEP_TYPES.map((type) => ({ value: type, label: type, description: StepMeta[type].desc, color: StepMeta[type].color }))} onChange={(value) => {
          setSelectedType(value as StepType);
        }} />

        <Button className="form__list-btn" title={"+ Add step"} onClick={handleAddStep} />
      </div>
    </div>
  );
};

export default ScenarioList;