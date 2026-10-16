import "../index.css";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { useFormContext, type FieldPath } from "react-hook-form";
import Step from "../../Step";
import type { IStep, ParserTabConfig, StepType } from "../../../globalTypes/parser_сonfig";
import SelectField from "../../SelectField";
import Button from "../../Button";
import { t } from "../../i18n";
import { terms } from "../../../shared/i18n/terms";
import {
  appendChildToTree,
  createTreePathMap,
  createTreeItemForStep,
  moveTreeItem,
  removeTreeItem,
  stepsToTreeItems,
  syncTreeItems,
  treeItemsToSteps,
  type ScenarioTreeDropPosition,
  type ScenarioTreeItem,
} from "../scenarioTree";

interface ScenarioListProps {
  StepMeta: Record<string, { color: string; placeholder: string; desc: string }>;
}

interface DragState {
  draggedId: string;
  targetId?: string;
  position?: ScenarioTreeDropPosition;
}

interface ScenarioTreeStepProps {
  item: ScenarioTreeItem;
  index: number;
  depth: number;
  isLast: boolean;
  path: string;
  StepMeta: ScenarioListProps["StepMeta"];
  dragState: DragState | null;
  onAddChild: (parentId: string) => void;
  onRemove: (id: string) => void;
  onDragStart: (id: string) => void;
}

const STEP_TYPE_LABELS: Record<StepType, string> = {
  collect: t("form.stepTypes.collect"),
  action: t("form.stepTypes.action"),
  loop: t("form.stepTypes.loop"),
  wait: t("form.stepTypes.wait"),
  condition: t("form.stepTypes.condition"),
};

const createStep = (
  type: StepType,
  StepMeta: ScenarioListProps["StepMeta"],
): IStep => {
  const meta = StepMeta[type];

  switch (type) {
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

const ScenarioTreeStep = ({
  item,
  index,
  depth,
  isLast,
  path,
  StepMeta,
  dragState,
  onAddChild,
  onRemove,
  onDragStart,
}: ScenarioTreeStepProps) => {
  const isDragging = dragState?.draggedId === item.id;
  const isDropTarget = dragState?.targetId === item.id;
  const dragHandleProps: HTMLAttributes<HTMLButtonElement> = {
    onPointerDown: (event) => {
      if (event.button !== 0) return;
      event.preventDefault();
      onDragStart(item.id);
    },
  };

  const dropClass = isDropTarget && dragState?.position
    ? ` scenario-tree__item--drop-${dragState.position}`
    : "";

  return (
    <div
      className={`scenario-tree__item${isDragging ? " scenario-tree__item--dragging" : ""}${dropClass}`}
      data-scenario-tree-item={item.id}
      data-can-have-children={item.canHaveChildren ? "true" : "false"}
    >
      <Step
        index={index}
        path={path}
        depth={depth}
        isLast={isLast}
        StepMeta={StepMeta}
        onRemove={() => onRemove(item.id)}
        onAddChild={item.canHaveChildren ? () => onAddChild(item.id) : undefined}
        dragHandleProps={dragHandleProps}
      />
    </div>
  );
};

const ScenarioList = ({ StepMeta }: ScenarioListProps) => {
  const { getValues, setValue, watch } = useFormContext<ParserTabConfig>();
  const [selectedType, setSelectedType] = useState<StepType>("loop");
  const STEP_TYPES = Object.keys(StepMeta) as StepType[];
  const [treeItems, setTreeItems] = useState<ScenarioTreeItem[]>(() => {
    return stepsToTreeItems((getValues("data.steps" as FieldPath<ParserTabConfig>) as IStep[] | undefined) ?? []);
  });
  const [dragState, setDragState] = useState<DragState | null>(null);
  const dragStateRef = useRef<DragState | null>(null);
  const pointerPositionRef = useRef<{ x: number; y: number } | null>(null);
  const paths = useMemo(() => createTreePathMap(treeItems), [treeItems]);

  const updateDragState = useCallback((state: DragState | null) => {
    dragStateRef.current = state;
    setDragState(state);
  }, []);

  useEffect(() => {
    const subscription = watch((_values, { name }) => {
      if (name && !name.startsWith("data.steps")) return;

      const steps = (getValues("data.steps" as FieldPath<ParserTabConfig>) as IStep[] | undefined) ?? [];
      setTreeItems((items) => syncTreeItems(items, steps));
    });

    return () => subscription.unsubscribe();
  }, [getValues, watch]);

  const replaceTree = useCallback((items: ScenarioTreeItem[]) => {
    setTreeItems(items);
    setValue(
      "data.steps" as FieldPath<ParserTabConfig>,
      treeItemsToSteps(items) as never,
      { shouldDirty: true },
    );
  }, [setValue]);

  const handleAddRoot = () => {
    replaceTree([...treeItems, createTreeItemForStep(createStep(selectedType, StepMeta))]);
  };

  const handleAddChild = useCallback((parentId: string) => {
    replaceTree(appendChildToTree(treeItems, parentId, createStep(selectedType, StepMeta)));
  }, [StepMeta, replaceTree, selectedType, treeItems]);

  const handleRemove = useCallback((id: string) => {
    replaceTree(removeTreeItem(treeItems, id));
  }, [replaceTree, treeItems]);

  const handleDragStart = useCallback((id: string) => {
    pointerPositionRef.current = null;
    updateDragState({ draggedId: id });
  }, [updateDragState]);

  const handleDragMove = useCallback((clientX: number, clientY: number) => {
    const currentDrag = dragStateRef.current;
    if (!currentDrag) return;

    const target = document.elementFromPoint(clientX, clientY)
      ?.closest<HTMLElement>("[data-scenario-tree-item]");
    const targetId = target?.dataset.scenarioTreeItem;

    if (!target || !targetId || targetId === currentDrag.draggedId) {
      if (currentDrag.targetId) updateDragState({ draggedId: currentDrag.draggedId });
      return;
    }

    const rect = target.getBoundingClientRect();
    const canHaveChildren = target.dataset.canHaveChildren === "true";
    const isInsideTarget = canHaveChildren
      && clientX > rect.left + 28
      && clientY > rect.top + rect.height * 0.2
      && clientY < rect.bottom - rect.height * 0.2;
    const position: ScenarioTreeDropPosition = isInsideTarget
      ? "inside"
      : clientY < rect.top + rect.height / 2
        ? "before"
        : "after";

    if (currentDrag.targetId === targetId && currentDrag.position === position) return;
    updateDragState({ draggedId: currentDrag.draggedId, targetId, position });
  }, [updateDragState]);

  const handleDragEnd = useCallback(() => {
    const currentDrag = dragStateRef.current;
    updateDragState(null);

    if (!currentDrag?.targetId || !currentDrag.position) return;
    replaceTree(moveTreeItem(
      treeItems,
      currentDrag.draggedId,
      currentDrag.targetId,
      currentDrag.position,
    ));
  }, [replaceTree, treeItems, updateDragState]);

  useEffect(() => {
    if (!dragState) return;

    const scrollContainer = document.querySelector<HTMLElement>(".form__content");
    const edgeSize = 56;
    const maxScrollPerFrame = 18;
    let animationFrame = 0;

    const autoScroll = () => {
      const pointer = pointerPositionRef.current;
      if (pointer && scrollContainer) {
        const rect = scrollContainer.getBoundingClientRect();
        let scrollDelta = 0;

        if (pointer.y < rect.top + edgeSize) {
          scrollDelta = -Math.min(maxScrollPerFrame, Math.max(2, rect.top + edgeSize - pointer.y) * 0.45);
        } else if (pointer.y > rect.bottom - edgeSize) {
          scrollDelta = Math.min(maxScrollPerFrame, Math.max(2, pointer.y - (rect.bottom - edgeSize)) * 0.45);
        }

        if (scrollDelta !== 0 && scrollContainer.scrollHeight > scrollContainer.clientHeight) {
          const previousScrollTop = scrollContainer.scrollTop;
          scrollContainer.scrollTop = Math.max(
            0,
            Math.min(
              scrollContainer.scrollHeight - scrollContainer.clientHeight,
              previousScrollTop + scrollDelta,
            ),
          );

          if (scrollContainer.scrollTop !== previousScrollTop) {
            handleDragMove(pointer.x, pointer.y);
          }
        }
      }

      animationFrame = window.requestAnimationFrame(autoScroll);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointerPositionRef.current = { x: event.clientX, y: event.clientY };
      handleDragMove(event.clientX, event.clientY);
    };
    const onPointerUp = () => handleDragEnd();
    const onPointerCancel = () => updateDragState(null);

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerCancel);
    animationFrame = window.requestAnimationFrame(autoScroll);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerCancel);
      pointerPositionRef.current = null;
    };
  }, [dragState, handleDragEnd, handleDragMove, updateDragState]);

  const renderTree = (items: ScenarioTreeItem[], depth = 0): ReactNode[] => {
    return items.flatMap((item, index) => {
      const location = paths.get(item.id);
      if (!location) return [];

      return [
        <ScenarioTreeStep
          key={item.id}
          item={item}
          index={index}
          depth={depth}
          isLast={index === items.length - 1}
          path={location.path}
          StepMeta={StepMeta}
          dragState={dragState}
          onAddChild={handleAddChild}
          onRemove={handleRemove}
          onDragStart={handleDragStart}
        />,
        ...renderTree(item.children ?? [], depth + 1),
      ];
    });
  };

  return (
    <div className="form__list">
      <div className="scenario-tree" role="tree">
        {renderTree(treeItems)}
      </div>
      <div className="form__list-add">
        <SelectField
          className="form__list-select"
          openUpward
          value={selectedType}
          options={STEP_TYPES.map((type) => ({
            value: type,
            label: STEP_TYPE_LABELS[type],
            description: StepMeta[type].desc,
            color: StepMeta[type].color,
          }))}
          onChange={(value) => setSelectedType(value as StepType)}
        />
        <Button className="form__list-btn" title={terms.form.addStep} onClick={handleAddRoot} />
      </div>
    </div>
  );
};

export default ScenarioList;
