import "./index.css";
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { IStep, StepAction, StepCollect, StepCondition, StepLoop, StepWait } from "../../globalTypes/parser_сonfig";
import { useFormContext, useWatch } from "react-hook-form";
import ScenarioList from "../Form/blocks/ScenarioList";
import StepEditor from "./StepEditor";
import { t } from "../i18n";

interface Props {
  index: number;
  sortableId: string;
  path: string;
  depth: number;
  StepMeta: Record<string, { color: string; placeholder: string; desc: string }>;
  onRemove: () => void;
}

const getStepTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    collect: t("form.stepTypes.collect"),
    action: t("form.stepTypes.action"),
    loop: t("form.stepTypes.loop"),
    wait: t("form.stepTypes.wait"),
    condition: t("form.stepTypes.condition"),
  };

  return labels[type] ?? type;
};

const getEntityLabel = (entity: string | undefined) => {
  const labels: Record<string, string> = {
    category: t("step.entityOptions.category"),
    product: t("step.entityOptions.product"),
    modifier_group: t("step.entityOptions.modifierGroup"),
    modifier: t("step.entityOptions.modifier"),
    product_parameter: t("step.entityOptions.productParameter"),
  };

  return entity ? labels[entity] ?? entity : "";
};

const getActionLabel = (action: string | undefined) => {
  const labels: Record<string, string> = {
    click: t("step.actionOptions.click"),
    hover: t("step.actionOptions.hover"),
  };

  return action ? labels[action] ?? action : "";
};

const getWaitLabel = (mode: string) => {
  const labels: Record<string, string> = {
    timeout: t("step.waitOptions.timeout"),
    navigation: t("step.waitOptions.navigation"),
    element: t("step.waitOptions.element"),
  };

  return labels[mode] ?? mode;
};

const StepSummary = ({ step }: { step: IStep }) => {
  if (step.type === "action") {
    const stepAction = step as StepAction;
    return <span className="step__sel-class">{`${getActionLabel(stepAction.params.action)} ${stepAction.params.selector ?? ""}`}</span>;
  }

  if (step.type === "collect") {
    const stepCollect = step as StepCollect;
    return <span className="step__sel-class">{getEntityLabel(stepCollect.params.entity)}</span>;
  }

  if (step.type === "condition") {
    const stepCondition = step as StepCondition;
    return (
      <>
        <span className="step__sel-class">{`${stepCondition.params.exists ? t("step.summary.ifExists") : t("step.summary.ifNotExists")} ${stepCondition.params.selector ?? ""}`}</span>
        {stepCondition.children.length > 0 && (
          <span className="step__loop-count">{t("step.summary.stepsInside", { count: stepCondition.children.length })}</span>
        )}
      </>
    );
  }

  if (step.type === "loop") {
    const stepLoop = step as StepLoop;
    return (
      <>
        <span className="step__sel-class">{stepLoop.params.selector}</span>
        {stepLoop.children.length > 0 && (
          <span className="step__loop-count">{t("step.summary.stepsInside", { count: stepLoop.children.length })}</span>
        )}
      </>
    );
  }

  if (step.type === "wait") {
    const stepWait = step as StepWait;
    let stepParam = "";
    if (stepWait.params.mode === "element") stepParam = stepWait.params.selector;
    if (stepWait.params.mode === "timeout") stepParam = String(stepWait.params.duration);
    return <span className="step__sel-attr">{`${getWaitLabel(stepWait.params.mode)} ${stepParam}`}</span>;
  }

  return null;
};

const Step = ({ index, path, sortableId, depth, StepMeta, onRemove }: Props) => {
  const [opened, setOpened] = useState(false);
  const { control } = useFormContext();

  const step = useWatch({
    control,
    name: path,
  });

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: sortableId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const meta = StepMeta[step.type as keyof typeof StepMeta];
  const hasChildren = "children" in step && Array.isArray(step.children);

  return (
    <div ref={setNodeRef} style={style} className="step">
      <div className="step__indent-container">
        {depth > 0 && (
          <div className="step__indent">
            {Array.from({ length: depth }).map((_, i) => (
              <div key={i} className="step__indent-line" />
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
              aria-label={t("step.controls.dragToReorder")}
            >
              ⠿
            </button>

            <span className="step__num">{String(index + 1).padStart(2, "0")}</span>

            <span className="step__badge">
              <span className="step__badge-dot" />
              {getStepTypeLabel(step.type)}
            </span>

            <div className="step__summary" onClick={() => setOpened((value) => !value)}>
              <StepSummary step={step} />
            </div>

            <div className="step__actions">
              <button
                type="button"
                className="step__action-btn"
                aria-label={t("step.controls.edit")}
                title={t("step.controls.edit")}
                onClick={() => setOpened((value) => !value)}
              >
                ✎
              </button>
              <button
                type="button"
                className="step__action-btn step__action-btn--del"
                aria-label={t("step.controls.remove")}
                title={t("step.controls.remove")}
                onClick={onRemove}
              >
                ✕
              </button>
            </div>
          </div>

          {opened && (
            <div className="step__editor">
              <StepEditor type={step.type} path={path} depth={depth} />
              <span>{t("step.controls.editor", { type: getStepTypeLabel(step.type) })}</span>
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
