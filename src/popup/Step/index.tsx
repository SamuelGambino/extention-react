import "./index.css";
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { IStep } from "../../globalTypes/parser_сonfig";
import { STEP_META } from "../Scenario";

interface Props {
  index: number;
  step: IStep;
  depth?: number;
  onRemove?: () => void;
  isLast?: boolean;
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

const Step = ({ index, step, depth = 0, onRemove, isLast = false }: Props) => {
  const [opened, setOpened] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: step.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const meta = STEP_META[step.type as keyof typeof STEP_META];
  const children = (step as any).children as IStep[] | undefined;
  const hasChildren = Array.isArray(children) && children.length > 0;
  const isLoop = step.type === "loop" || step.type === "condition";

  return (
    <div ref={setNodeRef} style={style} className="step">
      {/* indent guides for nested steps */}
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

      {/* card */}
      <div
        className={`step__card step__card--${step.type} ${opened ? "step__card--open" : ""}`}
        style={{ "--step-color": meta?.color ?? "#4a5a84" } as React.CSSProperties}
      >
        {/* scanline texture */}
        <div className="step__scanline" />

        <div className="step__header">
          {/* drag handle */}
          <button
            type="button"
            className="step__drag"
            {...listeners}
            {...attributes}
            aria-label="Drag to reorder"
          >
            ⠿
          </button>

          {/* step number */}
          <span className="step__num">
            {String(index + 1).padStart(2, "0")}
          </span>

          {/* type badge */}
          <span className="step__badge">
            <span className="step__badge-dot" />
            {step.type}
          </span>

          {/* summary */}
          <div
            className="step__summary"
            onClick={() => setOpened((v) => !v)}
          >
            <StepSummary step={step} />
          </div>

          {/* actions */}
          <div className="step__actions">
            {isLoop && (
              <button
                type="button"
                className="step__action-btn"
                onClick={() => setOpened((v) => !v)}
                aria-label={opened ? "Collapse" : "Expand"}
                title={opened ? "Collapse" : "Expand"}
              >
                {opened ? "−" : "+"}
              </button>
            )}
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

        {/* editor panel (expanded) */}
        {opened && (
          <div className="step__editor">
            {/* StepEditor goes here — pass index + step */}
            <span className="step__editor-placeholder">
              {/* <StepEditor index={index} step={step} /> */}
              editor · {step.type}
            </span>
          </div>
        )}
      </div>

      {/* recursive children for loop / condition */}
      {hasChildren && (
        <div className="step__children">
          {children!.map((child, i) => (
            <Step
              key={child.id}
              index={i}
              step={child}
              depth={depth + 1}
              isLast={i === children!.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Step;