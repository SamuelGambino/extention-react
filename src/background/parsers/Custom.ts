import browser from "webextension-polyfill";
import { BaseParser } from "./BaseParser";
import type { ParserState } from "../../globalTypes/parsing_state";
import type { IStep, PresetCustom, StepCollect } from "../../globalTypes/parser_сonfig";
import { StepExecutor } from "../StepExecutor";
import type { ElementContext } from "../../globalTypes/messages";
import type { ProductParameter } from "../types/ExportTypes";

type ContextEntity = "category" | "product" | "modifier_group" | "modifier" | "product_parameter";
type ContextItem = { id: string | number, name: string, index?: number[] };
type ProgressField = "categories" | "categoriesTotal" | "products" | "productsTotal" | "groupsModifiers" | "groupsModifiersTotal" | "modifiers" | "modifiersTotal";
type ProgressKind = "total" | "processed";

const PROGRESS_FIELDS: Partial<Record<ContextEntity, Record<ProgressKind, ProgressField>>> = {
  category: { total: "categoriesTotal", processed: "categories" },
  product: { total: "productsTotal", processed: "products" },
  modifier_group: { total: "groupsModifiersTotal", processed: "groupsModifiers" },
  modifier: { total: "modifiersTotal", processed: "modifiers" },
};

type CollectedItem = {
  name: string;
  picture?: string;
  description?: string;
  price?: number;
  old_price?: number;
  proteins?: number;
  fats?: number;
  carbohydrates?: number;
  calories?: number;
  index?: string;
  weight?: string;
};

export class Custom extends BaseParser {
  private parseContext: Partial<Record<ContextEntity, ContextItem>> = {};
  private progress: Record<ProgressField, number> = {
    categories: 0,
    categoriesTotal: 0,
    products: 0,
    productsTotal: 0,
    groupsModifiers: 0,
    groupsModifiersTotal: 0,
    modifiers: 0,
    modifiersTotal: 0,
  };
  private tabId: number | undefined;

  async checkAvailability() {
    await this.setLog({ status: "warn", title: "[Custom]:Check", value: "Проверка работы сценария..." });
    await this.setDataState({ categoriesTotal: 0, categories: 0, productsTotal: 0, products: 0, groupsModifiersTotal: 0, groupsModifiers: 0, modifiersTotal: 0, modifiers: 0 });
    await this.resolveTabId();

    try {
      const data = this.config.data as PresetCustom;
      await this.executeSteps(data.steps, [], true);
      await this.setLog({ status: "success", title: "[Custom]:Check", value: "Сценарий доступен" });
    } catch (e) {
      await this.setLog({ status: "danger", title: "[Custom]:Check", value: "Ошибка:" + e });
      this.stop();
    }
  }

  async parseRest() {
    await this.resolveTabId();
    await this.resetProgress();
    try {
      const data = this.config.data as PresetCustom;
      await this.executeSteps(data.steps, []);
      await this.setDataState(this.progress as Partial<ParserState['data']>);
    } catch (e) {
      await this.setLog({ status: "danger", title: "[Custom]:Parse", value: "Ошибка:" + e });
      this.stop();
    }
  }

  private async resolveTabId() {
    if (this.tabId) return;
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    const activeTab = tabs[0];
    if (!activeTab?.id) throw new Error("Не удалось найти активную вкладку");
    this.tabId = activeTab.id;
  }

  private async resetProgress() {
    this.progress = {
      categories: 0,
      categoriesTotal: 0,
      products: 0,
      productsTotal: 0,
      groupsModifiers: 0,
      groupsModifiersTotal: 0,
      modifiers: 0,
      modifiersTotal: 0,
    };
    await this.setDataState(this.progress as Partial<ParserState['data']>);
  }

  private async updateProgress(entity: ContextEntity, kind: ProgressKind, amount: number) {
    const field = PROGRESS_FIELDS[entity]?.[kind];
    if (!field || amount === 0) return;

    this.progress[field] += amount;
    await this.setDataState({ [field]: this.progress[field] } as Partial<ParserState['data']>);
  }

  private async executeSteps(
    steps: IStep[],
    context: ElementContext = [],
    checkOnly = false,
    scopedEntities: ContextEntity[] = [],
  ): Promise<void> {
    if (!this.tabId) throw new Error("tabId is undefined :(");
    const data = this.config.data as PresetCustom;

    for (const step of steps) {
      if (checkOnly && step.type === "collect") continue;

      switch (step.type) {
        case "wait":
          if (step.params.mode === "timeout") await this.sleep(step.params.duration);
          if (step.params.mode === "element") await StepExecutor.execute(this.tabId, { type: "wait", step, context });
          if (step.params.mode === "navigation") await StepExecutor.waitForTabComplete(this.tabId);
          break;

        case "action":
          await StepExecutor.execute(this.tabId, { type: "action", step, context });
          if (data.waitAfterClick) await this.sleep(data.waitAfterClick);
          break;

        case "collect":
          await this.collect(step, context, scopedEntities);
          break;

        case "condition": {
          const matched = await StepExecutor.execute<boolean>(this.tabId, { type: "condition", step, context });
          if (matched) await this.executeSteps(step.children, context, checkOnly, scopedEntities);
          break;
        }

        case "loop": {
          const count = await StepExecutor.execute<number>(this.tabId, {
            type: "loop-items",
            selector: step.params.selector,
            source: step.params.source,
            context,
          });
          const iterations = checkOnly ? Math.min(count, 1) : count;
          const iterationScopes = step.params.entity
            ? [...scopedEntities, step.params.entity]
            : scopedEntities;

          if (!checkOnly && step.params.entity) {
            await this.updateProgress(step.params.entity, "total", count);
          }

          for (let index = 0; index < iterations; index++) {
            const iterationContext =
              step.params.source === "element"
                ? [...context, { selector: step.params.selector, index }]
                : [{ selector: step.params.selector, index }];
            const contextBeforeIteration = { ...this.parseContext };

            if (step.params.entity) this.clearContextEntity(step.params.entity);

            try {
              await this.executeSteps(step.children, iterationContext, checkOnly, iterationScopes);
            } finally {
              this.parseContext = contextBeforeIteration;
            }

            if (!checkOnly && step.params.entity) {
              await this.updateProgress(step.params.entity, "processed", 1);
            }

            if (data.requestDelay) await this.sleep(data.requestDelay);
          }
          break;
        }
      }

      await this.waitForNextStep();
    }
  }

  private clearContextEntity(entity: ContextEntity) {
    delete this.parseContext[entity];

    if (entity === "category") {
      delete this.parseContext.product;
      delete this.parseContext.product_parameter;
    }

    if (entity === "product") {
      delete this.parseContext.product_parameter;
    }

    if (entity === "modifier_group") {
      delete this.parseContext.modifier;
    }
  }

  private getScopedContextItem(entity: ContextEntity, scopedEntities: ContextEntity[]) {
    return scopedEntities.includes(entity) ? this.parseContext[entity] : undefined;
  }

  private parseParameterIndex(value?: string): number[] {
    if (!value) return [];

    return value
      .match(/-?\d+(?:[.,]\d+)?/g)
      ?.map((part) => Number(part.replace(",", ".")))
      .filter(Number.isFinite) ?? [];
  }

  private createProductParameter(id: string, item: CollectedItem, fallbackIndex: number[] = []): ProductParameter {
    return {
      id,
      name: item.name || undefined,
      price: item.price ?? 0,
      old_price: item.old_price,
      proteins: item.proteins,
      fats: item.fats,
      carbohydrates: item.carbohydrates,
      calories: item.calories,
      index: item.index || item.weight ? this.parseParameterIndex(item.index ?? item.weight) : fallbackIndex,
    };
  }

  private updateProductParameter(parameter: ProductParameter, item: CollectedItem) {
    if (item.name) parameter.name = item.name;
    if (typeof item.price !== "undefined") parameter.price = item.price;
    if (typeof item.old_price !== "undefined") parameter.old_price = item.old_price;
    if (typeof item.proteins !== "undefined") parameter.proteins = item.proteins;
    if (typeof item.fats !== "undefined") parameter.fats = item.fats;
    if (typeof item.carbohydrates !== "undefined") parameter.carbohydrates = item.carbohydrates;
    if (typeof item.calories !== "undefined") parameter.calories = item.calories;
    if (item.index || item.weight) parameter.index = this.parseParameterIndex(item.index ?? item.weight);
  }

  private async collect(step: StepCollect, context: ElementContext, scopedEntities: ContextEntity[]) {
    if (!this.tabId) throw new Error("tabId is undefined :(");

    const item = await StepExecutor.execute<CollectedItem>(this.tabId, { type: "collect", step, context });
    const entity = step.params.entity ?? "product";
    const id = `${entity}-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    if (entity === "category") {
      const contextItem = this.getScopedContextItem(entity, scopedEntities);
      const category = contextItem ? this.categories.find((candidate) => candidate.id === contextItem.id) : undefined;

      if (category) {
        if (item.name) category.name = item.name;
        this.parseContext.category = { id: category.id, name: category.name };
      } else {
        this.categories.push({ id, name: item.name, parent: 0 });
        this.parseContext.category = { id, name: item.name };
      }
      return;
    }

    if (entity === "modifier_group") {
      const contextItem = this.getScopedContextItem(entity, scopedEntities);
      const group = contextItem ? this.modifiers_groups.find((candidate) => candidate.id === contextItem.id) : undefined;

      if (group) {
        if (item.name) group.name = item.name;
        this.parseContext.modifier_group = { id: group.id, name: group.name };
      } else {
        this.modifiers_groups.push({ id, name: item.name, type: "one_unlimited", required: false, minimum: 0, maximum: 0, modifiers: [] });
        this.parseContext.modifier_group = { id, name: item.name };
      }
      return;
    }

    if (entity === "modifier") {
      const contextItem = this.getScopedContextItem(entity, scopedEntities);
      const modifier = contextItem ? this.modifiers.find((candidate) => candidate.id === contextItem.id) : undefined;

      if (modifier) {
        if (item.name) modifier.name = item.name;
        if (typeof item.price !== "undefined") modifier.price = item.price;
        this.parseContext.modifier = { id: modifier.id, name: modifier.name };
      } else {
        const groupId = this.parseContext.modifier_group?.id ?? "";
        this.modifiers.push({ id, name: item.name, price: item.price ?? 0, group_id: groupId });
        this.parseContext.modifier = { id, name: item.name };
      }
      return;
    }

    if (entity === "product_parameter") {
      const productId = this.parseContext.product?.id;
      if (!productId) {
        throw new Error("Шаг collect product_parameter должен выполняться после collect product.");
      }

      const product = this.products.find((candidate) => candidate.product_id === productId);
      if (!product) {
        throw new Error("Текущий товар для collect product_parameter не найден.");
      }

      const contextItem = this.getScopedContextItem(entity, scopedEntities);
      const parameter = contextItem ? product.price.find((candidate) => candidate.id === contextItem.id) : undefined;

      if (parameter) {
        this.updateProductParameter(parameter, item);
        this.parseContext.product_parameter = { id: parameter.id, name: parameter.name ?? "" };
      } else {
        const nextParameter = this.createProductParameter(id, item);
        product.price.push(nextParameter);
        this.parseContext.product_parameter = { id, name: nextParameter.name ?? "" };
      }
      return;
    }

    const contextItem = this.getScopedContextItem(entity, scopedEntities);
    const product = contextItem ? this.products.find((candidate) => candidate.product_id === contextItem.id) : undefined;

    if (product) {
      if (item.name) product.name = item.name;
      if (item.picture) product.picture = item.picture;
      if (item.description) product.description = item.description;

      const productIndex = item.weight
        ? this.parseParameterIndex(item.weight)
        : this.parseContext.product?.index ?? [];

      if (step.params.price) {
        const defaultParameter = product.price.find((candidate) => !candidate.name);
        if (defaultParameter) {
          this.updateProductParameter(defaultParameter, item);
        } else {
          product.price.push(this.createProductParameter(id, item, productIndex));
        }
      }

      this.parseContext.product = { id: product.product_id, name: product.name, index: productIndex };
      return;
    }

    const productIndex = this.parseParameterIndex(item.weight);
    const productParameters: ProductParameter[] = [];
    if (step.params.price) productParameters.push(this.createProductParameter(id, item, productIndex));

    this.products.push({
      product_id: id,
      name: item.name,
      picture: item.picture ?? "",
      description: item.description ?? "",
      price: productParameters,
      category: this.parseContext.category?.id ?? "",
    });
    this.parseContext.product = { id, name: item.name, index: productIndex };
  }
}