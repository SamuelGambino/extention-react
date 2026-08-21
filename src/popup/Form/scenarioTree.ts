import type { IStep, StepCondition, StepLoop } from "../../globalTypes/parser_сonfig";

export interface ScenarioTreeItem {
  id: string;
  step: IStep;
  children?: ScenarioTreeItem[];
  canHaveChildren: boolean;
}

export interface ScenarioTreePath {
  path: string;
  index: number;
  depth: number;
}

const stepIds = new WeakMap<object, string>();
let nextStepId = 1;

export const isStepContainer = (step: IStep): step is StepLoop | StepCondition => {
  return step.type === "loop" || step.type === "condition";
};

const getStepId = (step: IStep, previousId?: string): string => {
  const knownId = stepIds.get(step);
  if (knownId) return knownId;

  const id = previousId ?? `scenario-step-${nextStepId++}`;
  stepIds.set(step, id);
  return id;
};

const createTreeItem = (step: IStep, previousItem?: ScenarioTreeItem): ScenarioTreeItem => ({
  id: getStepId(step, previousItem?.id),
  step,
  canHaveChildren: isStepContainer(step),
  ...(isStepContainer(step)
    ? { children: stepsToTreeItems(step.children, previousItem?.children) }
    : {}),
});

// browser.storage и react-hook-form могут возвращать новые объекты для тех же
// шагов. Предыдущая структура сопоставляется по текущей позиции, сохраняя
// DnD/React-идентификатор при обычном редактировании полей.
export const stepsToTreeItems = (
  steps: IStep[],
  previousItems: ScenarioTreeItem[] = [],
): ScenarioTreeItem[] => {
  return steps.map((step, index) => createTreeItem(step, previousItems[index]));
};

export const treeItemsToSteps = (items: ScenarioTreeItem[]): IStep[] => {
  return items.map(({ id, step, children }) => {
    if (!isStepContainer(step)) return step;

    const nextStep: IStep = {
      ...step,
      children: treeItemsToSteps(children ?? []),
    };
    stepIds.set(nextStep, id);
    return nextStep;
  });
};

export const syncTreeItems = (
  items: ScenarioTreeItem[],
  steps: IStep[],
): ScenarioTreeItem[] => {
  let changed = items.length !== steps.length;

  const syncedItems = steps.map((step, index) => {
    const item = items[index];
    if (!item) {
      changed = true;
      return createTreeItem(step);
    }

    const canHaveChildren = isStepContainer(step);
    const children = canHaveChildren
      ? syncTreeItems(item.children ?? [], step.children)
      : undefined;

    if (
      item.step === step
      && item.canHaveChildren === canHaveChildren
      && item.children === children
    ) {
      return item;
    }

    changed = true;
    return {
      ...item,
      step,
      canHaveChildren,
      ...(canHaveChildren ? { children } : { children: undefined }),
    };
  });

  return changed ? syncedItems : items;
};

export const createTreePathMap = (items: ScenarioTreeItem[]): Map<string, ScenarioTreePath> => {
  const paths = new Map<string, ScenarioTreePath>();

  const visit = (nodes: ScenarioTreeItem[], depth = 0, parentPath?: string) => {
    nodes.forEach((node, index) => {
      const path = parentPath ? `${parentPath}.children.${index}` : `data.steps.${index}`;
      paths.set(node.id, { path, index, depth });
      if (node.children) visit(node.children, depth + 1, path);
    });
  };

  visit(items);
  return paths;
};

export const appendChildToTree = (
  items: ScenarioTreeItem[],
  parentId: string,
  child: IStep,
): ScenarioTreeItem[] => {
  return items.map((item) => {
    if (item.id === parentId && item.canHaveChildren) {
      return {
        ...item,
        children: [...(item.children ?? []), createTreeItem(child)],
      };
    }

    if (!item.children) return item;

    return {
      ...item,
      children: appendChildToTree(item.children, parentId, child),
    };
  });
};

export const createTreeItemForStep = createTreeItem;
