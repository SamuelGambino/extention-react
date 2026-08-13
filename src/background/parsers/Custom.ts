import browser from "webextension-polyfill";
import { BaseParser } from "./BaseParser";
import type { ParserState } from "../../globalTypes/parsing_state";
import type { IStep, PresetCustom, StepCollect } from "../../globalTypes/parser_сonfig";
import { StepExecutor } from "../StepExecutor";
import type { ElementContext } from "../../globalTypes/messages";

export class Custom extends BaseParser {
  private parseContext: { category?: { id: string | number, name: string }, product?: { id: string | number, name: string }, modifierGroup?: { id: string | number, name: string } } = {};
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
    try {
      const data = this.config.data as PresetCustom;
      await this.executeSteps(data.steps, []);
      await this.setDataState({
        categories: this.categories.length,
        products: this.products.length,
        groupsModifiers: this.modifiers_groups.length,
        modifiers: this.modifiers.length,
      } as Partial<ParserState['data']>);
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

  private async executeSteps(steps: IStep[], context: ElementContext = [], checkOnly = false): Promise<void> {
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
          await this.collect(step, context);
          break;

        case "condition": {
          const matched = await StepExecutor.execute<boolean>(this.tabId, { type: "condition", step, context });
          if (matched) await this.executeSteps(step.children, context, checkOnly);
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
          for (let index = 0; index < iterations; index++) {
            const iterationContext =
              step.params.source === "element"
                ? [...context, { selector: step.params.selector, index }]
                : [{ selector: step.params.selector, index }];
            await this.executeSteps(step.children, iterationContext, checkOnly);
            if (data.requestDelay) await this.sleep(data.requestDelay);
          }
          break;
        }
      }

      await this.waitForNextStep();
    }
  }

  private async collect(step: StepCollect, context: ElementContext) {
    if (!this.tabId) throw new Error("tabId is undefined :(");
    const item = await StepExecutor.execute<{ name: string; picture?: string; description?: string; price?: number; old_price?: number; proteins?: number; fats?: number; carbohydrates?: number; calories?: number }>(this.tabId, { type: "collect", step, context });
    const entity = step.params.entity ?? "product";
    const id = `${entity}-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    if (entity === "category") {
      this.categories.push({ id, name: item.name, parent: 0 });
      this.parseContext.category = { id, name: item.name };
    } else if (entity === "modifier_group") {
      this.modifiers_groups.push({ id, name: item.name, type: "one_unlimited", required: false, minimum: 0, maximum: 0, modifiers: [] });
      this.parseContext.modifierGroup = { id, name: item.name };
    } else if (entity === "modifier") {
      const groupId = this.parseContext.modifierGroup?.id ?? "";
      this.modifiers.push({ id, name: item.name, price: item.price ?? 0, group_id: groupId });
    } else {
      this.products.push({
        product_id: id,
        name: item.name,
        picture: item.picture ?? "",
        description: item.description ?? "",
        price: [{ id, price: item.price ?? 0, old_price: item.old_price, proteins: item.proteins, fats: item.fats, carbohydrates: item.carbohydrates, calories: item.calories, index: [] }],
        category: this.parseContext.category?.id ?? "",
      });
      this.parseContext.product = { id, name: item.name };
    }
  }
}