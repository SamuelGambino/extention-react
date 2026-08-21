import {
  appendChildToTree,
  createTreePathMap,
  stepsToTreeItems,
  syncTreeItems,
  treeItemsToSteps,
} from "../src/popup/Form/scenarioTree.ts";
import type { IStep } from "../src/globalTypes/parser_сonfig.ts";

const assert = (condition: unknown, message: string): asserts condition => {
  if (!condition) throw new Error(message);
};

const actionStep: IStep = {
  type: "action",
  params: { action: "click", selector: ".product-card" },
};

const loopStep: IStep = {
  type: "loop",
  params: { selector: ".category" },
  children: [actionStep],
};

const conditionStep: IStep = {
  type: "condition",
  params: { exists: true, selector: ".modal" },
  children: [],
};

const originalTree = stepsToTreeItems([loopStep, conditionStep]);
const [loopNode, conditionNode] = originalTree;
const actionNode = loopNode.children?.[0];

assert(loopNode.canHaveChildren, "Цикл должен быть допустимым контейнером для дочерних шагов.");
assert(conditionNode.canHaveChildren, "Условие должно быть допустимым контейнером для дочерних шагов.");
assert(actionNode && !actionNode.canHaveChildren, "Действие не должно принимать дочерние шаги.");

const movedTree = [
  { ...loopNode, children: [] },
  { ...conditionNode, children: actionNode ? [actionNode] : [] },
];
const movedSteps = treeItemsToSteps(movedTree);

assert(movedSteps[0].type === "loop" && movedSteps[0].children.length === 0, "Перенесённый шаг должен исчезнуть из исходного контейнера.");
assert(movedSteps[1].type === "condition" && movedSteps[1].children.length === 1, "Перенесённый шаг должен попасть в новый контейнер.");
assert(movedSteps[1].type === "condition" && movedSteps[1].children[0].type === "action", "Тип перенесённого шага должен сохраниться.");

const movedTreeWithStableIds = stepsToTreeItems(movedSteps);
assert(movedTreeWithStableIds[0].id === loopNode.id, "Контейнер должен сохранять стабильный DnD-идентификатор после обновления формы.");
assert(movedTreeWithStableIds[1].id === conditionNode.id, "Целевой контейнер должен сохранять стабильный DnD-идентификатор после обновления формы.");
assert(movedTreeWithStableIds[1].children?.[0]?.id === actionNode?.id, "Перенесённый шаг должен сохранять DnD-идентификатор после обновления формы.");

const persistedSteps = JSON.parse(JSON.stringify(movedSteps)) as IStep[];
const restoredTree = syncTreeItems(movedTreeWithStableIds, persistedSteps);
assert(restoredTree[0].id === loopNode.id, "Автосохранённая копия цикла не должна менять React-ключ карточки.");
assert(restoredTree[1].id === conditionNode.id, "Автосохранённая копия условия не должна менять React-ключ карточки.");
assert(restoredTree[1].children?.[0]?.id === actionNode?.id, "Автосохранённая копия вложенного шага не должна закрывать его редактор.");

const paths = createTreePathMap(movedTreeWithStableIds);
const actionPath = paths.get(String(actionNode?.id));
assert(actionPath?.path === "data.steps.1.children.0", "Вложенный шаг должен получить корректный путь react-hook-form.");
assert(actionPath?.depth === 1, "Вложенный шаг должен получить корректную глубину для редактора.");

const waitStep: IStep = { type: "wait", params: { mode: "timeout", duration: 300 } };
const treeWithNewChild = appendChildToTree(movedTreeWithStableIds, String(loopNode.id), waitStep);
const stepsWithNewChild = treeItemsToSteps(treeWithNewChild);
assert(stepsWithNewChild[0].type === "loop" && stepsWithNewChild[0].children[0].type === "wait", "Добавление дочернего шага должно изменять только выбранный контейнер.");

console.log("scenario tree regression checks passed");
