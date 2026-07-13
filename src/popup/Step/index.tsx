import "./index.css";
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { IStep } from "../../globalTypes/parser_сonfig";
import { useFormContext, useWatch } from "react-hook-form";
import ScenarioList from "../Form/blocks/ScenarioList";

interface Props {
  index: number;
  sortableId: string;
  path: string;
  depth: number;
  isLast: boolean;
  StepMeta: Record<string, { color: string; placeholder: string; desc: string }>;
  onRemove: () => void;
}

/** Renders a coloured inline summary of the step's key field */
const StepSummary = ({ step }: { step: IStep }) => {
  if (step.type === "navigate")
    return <span className="step__sel-var">{(step as any).url ?? ""}</span>;

  if (step.type === "action")
    return <span className="step__sel-class">{(step as any).selector ?? ""}</span>;

  if (step.type === "collect") {
    const fields = (step as any).fields as Array<{ selector: string }> | undefined;
    return (
      <span className="step__sel-class">
        {fields?.map((f) => f.selector).join(", ") ?? ""}
      </span>
    );
  }

  if (step.type === "loop" || step.type === "condition") {
    const selector = (step as any).selector ?? (step as any).condition ?? "";
    const children = (step as any).children ?? [];
    return (
      <>
        <span className="step__sel-class">{selector}</span>
        {children.length > 0 && (
          <span className="step__loop-count">{children.length} steps inside</span>
        )}
      </>
    );
  }

  if (step.type === "wait")
    return <span className="step__sel-attr">{(step as any).ms ?? ""}ms</span>;

  return null;
};

const Step = ({ index, path, sortableId, depth, isLast, StepMeta, onRemove }: Props) => {
  const [opened, setOpened] = useState(false);
  const { control } = useFormContext();

  const step = useWatch({
    control,
    name: path
  });

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: sortableId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const meta = StepMeta[step.type as keyof typeof StepMeta];
  const children = (step as any).children as IStep[] | undefined;
  const hasChildren = Array.isArray(children);

  return (
    <div ref={setNodeRef} style={style} className="step">
      <div className="step__indent-container">
        {depth > 0 && (
          <div className="step__indent">
            {Array.from({ length: depth }).map((_, i) => (
              <div
                key={i}
                className={`step__indent-line ${i === depth - 1 && isLast ? "step__indent-line--last" : ""}`}
              />
            ))}
          </div>
        )}

        <div
          className={`step__card step__card--${step.type} ${opened ? "step__card--open" : ""}`}
          style={{ "--step-color": meta?.color ?? "#4a5a84" } as React.CSSProperties}
        >
          <div className="step__scanline" />

          <div className="step__header">
            <button
              type="button"
              className="step__drag"
              {...listeners}
              {...attributes}
              aria-label="Drag to reorder"
            >
              ⠿
            </button>

            <span className="step__num">
              {String(index + 1).padStart(2, "0")}
            </span>

            <span className="step__badge">
              <span className="step__badge-dot" />
              {step.type}
            </span>

            <div
              className="step__summary"
              onClick={() => setOpened((v) => !v)}
            >
              <StepSummary step={step} />
            </div>

            <div className="step__actions">
              <button
                type="button"
                className="step__action-btn"
                aria-label="Edit"
                title="Edit"
                onClick={() => setOpened((v) => !v)}
              >
                ✎
              </button>
              <button
                type="button"
                className="step__action-btn step__action-btn--del"
                aria-label="Remove"
                title="Remove"
                onClick={onRemove}
              >
                ✕
              </button>
            </div>
          </div>

          {opened && (
            <div className="step__editor">
              <span className="step__editor-placeholder">
                editor · {step.type}
              </span>
            </div>
          )}
        </div>
      </div>

      {hasChildren && (
        <div className="step__children">
          <ScenarioList
            path={`${path}.children`}
            depth={depth ? depth + 1 : 1}
            StepMeta={StepMeta}
          />
        </div>
      )}
    </div>
  );
};

export default Step;