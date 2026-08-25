import "../index.css";
import { createContext, forwardRef, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useFormContext, type FieldPath } from "react-hook-form";
import {
  SimpleTreeItemWrapper,
  SortableTree,
  type TreeItemComponentProps,
  type TreeItems,
} from "dnd-kit-sortable-tree";
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
  stepsToTreeItems,
  syncTreeItems,
  treeItemsToSteps,
  type ScenarioTreeItem,
  type ScenarioTreePath,
} from "../scenarioTree";

interface ScenarioListProps {
  StepMeta: Record<string, { color: string; placeholder: string; desc: string }>;
}

interface ScenarioTreeContextValue {
  paths: Map<string, ScenarioTreePath>;
  StepMeta: ScenarioListProps["StepMeta"];
  addChild: (parentId: string) => void;
}

const ScenarioTreeContext = createContext<ScenarioTreeContextValue | null>(null);

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

const ScenarioTreeStep = forwardRef<
  HTMLDivElement,
  TreeItemComponentProps<ScenarioTreeItem>
>(({ item, depth, isLast, handleProps, onRemove, ghost, ...treeItemProps }, ref) => {
  const context = useContext(ScenarioTreeContext);

  if (!context) return null;

  const location = context.paths.get(String(item.id));
  if (!location) return null;

  return (
    <SimpleTreeItemWrapper
      {...treeItemProps}
      ref={ref}
      indentationWidth={0}
      manualDrag
      showDragHandle={false}
      className={`scenario-tree__item${ghost ? " scenario-tree__item--dragging" : ""}`}
    >
      <Step
        index={location.index}
        path={location.path}
        depth={depth}
        isLast={isLast}
        StepMeta={context.StepMeta}
        onRemove={onRemove}
        onAddChild={item.canHaveChildren ? () => context.addChild(String(item.id)) : undefined}
        dragHandleProps={handleProps}
      />
    </SimpleTreeItemWrapper>
  );
});

ScenarioTreeStep.displayName = "ScenarioTreeStep";

const ScenarioList = ({ StepMeta }: ScenarioListProps) => {
  const { getValues, setValue, watch } = useFormContext<ParserTabConfig>();
  const [selectedType, setSelectedType] = useState<StepType>("loop");
  const STEP_TYPES = Object.keys(StepMeta) as StepType[];
  const [treeItems, setTreeItems] = useState<ScenarioTreeItem[]>(() => {
    return stepsToTreeItems((getValues("data.steps" as FieldPath<ParserTabConfig>) as IStep[] | undefined) ?? []);
  });
  const paths = useMemo(() => createTreePathMap(treeItems), [treeItems]);

  useEffect(() => {
    const subscription = watch((_values, { name }) => {
      if (name && !name.startsWith("data.steps")) return;

      const steps = (getValues("data.steps" as FieldPath<ParserTabConfig>) as IStep[] | undefined) ?? [];
      setTreeItems((items) => syncTreeItems(items, steps));
    });

    return () => subscription.unsubscribe();
  }, [getValues, watch]);

  const replaceTree = useCallback((items: TreeItems<ScenarioTreeItem>) => {
    const nextItems = items as ScenarioTreeItem[];
    setTreeItems(nextItems);
    setValue(
      "data.steps" as FieldPath<ParserTabConfig>,
      treeItemsToSteps(nextItems) as never,
      { shouldDirty: true },
    );
  }, [setValue]);

  const handleAddRoot = () => {
    replaceTree([...treeItems, createTreeItemForStep(createStep(selectedType, StepMeta))]);
  };

  const handleAddChild = useCallback((parentId: string) => {
    replaceTree(appendChildToTree(treeItems, parentId, createStep(selectedType, StepMeta)));
  }, [StepMeta, replaceTree, selectedType, treeItems]);

  const contextValue = useMemo<ScenarioTreeContextValue>(() => ({
    paths,
    StepMeta,
    addChild: handleAddChild,
  }), [StepMeta, handleAddChild, paths]);

  return (
    <div className="form__list">
      <ScenarioTreeContext.Provider value={contextValue}>
        <SortableTree
          items={treeItems}
          onItemsChanged={replaceTree}
          TreeItemComponent={ScenarioTreeStep}
          indentationWidth={20}
          pointerSensorOptions={{ activationConstraint: { distance: 5 } }}
          canRootHaveChildren
        />
      </ScenarioTreeContext.Provider>

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
