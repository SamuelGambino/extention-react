import browser from "webextension-polyfill";
import { BaseParser } from "./BaseParser";
import type { PresetCustom } from "../../globalTypes/parser_сonfig";
import { StepExecutor } from "../StepExecutor";
import type { Categories, ModGroups, Mods, Product } from "../types/ExportTypes";

type CollectResult = { status: string; data?: Record<string, string>; results?: CollectResult[] };

export class Custom extends BaseParser {
  private parseContext: { category?: Categories; modifierGroup?: ModGroups } = {};
  private tabId: number | undefined;

  private async resolveActiveTab() {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    const activeTab = tabs[0];

    if (!activeTab || activeTab.id === undefined) {
      throw new Error("Не удалось найти активную вкладку");
    }

    this.tabId = activeTab.id;
  }

  private flattenResults(result: CollectResult | CollectResult[] | undefined): CollectResult[] {
    if (!result) return [];
    if (Array.isArray(result)) return result.flatMap((item) => this.flattenResults(item));
    return [result, ...this.flattenResults(result.results)];
  }

  private toNumber(value?: string): number {
    if (!value) return 0;
    const normalized = value.replace(/[^\d,.]/g, '').replace(',', '.');
    return Number.parseFloat(normalized) || 0;
  }

  private applyCollect(data: Record<string, string>) {
    const entity = data.entity;

    if (entity === 'category') {
      const category: Categories = { id: this.categories.length + 1, name: data.name ?? '', parent: 0 };
      this.categories.push(category);
      this.parseContext.category = category;
      return;
    }

    if (entity === 'modifier_group') {
      const modifierGroup: ModGroups = {
        id: this.modifiers_groups.length + 1,
        name: data.name ?? '',
        type: 'one_unlimited',
        required: false,
        minimum: 0,
        maximum: 0,
        modifiers: [],
      };
      this.modifiers_groups.push(modifierGroup);
      this.parseContext.modifierGroup = modifierGroup;
      return;
    }

    if (entity === 'modifier') {
      const group = this.parseContext.modifierGroup;
      const modifier: Mods = {
        id: this.modifiers.length + 1,
        name: data.name ?? '',
        price: this.toNumber(data.price),
        group_id: group?.id ?? 0,
      };
      this.modifiers.push(modifier);
      group?.modifiers.push(modifier);
      return;
    }

    if (entity === 'product') {
      const product: Product = {
        product_id: this.products.length + 1,
        name: data.name ?? '',
        picture: data.picture ?? '',
        description: data.description ?? '',
        price: [{
          id: this.products.length + 1,
          price: this.toNumber(data.price),
          old_price: this.toNumber(data.old_price),
          proteins: this.toNumber(data.proteins),
          fats: this.toNumber(data.fats),
          carbohydrates: this.toNumber(data.carbohydrates),
          calories: this.toNumber(data.calories),
          index: [],
        }],
        category: this.parseContext.category?.id ?? 0,
      };
      this.products.push(product);
    }
  }

  private async executeScenario(options: { collect: boolean; maxLoopIterations?: number }) {
    if (!this.tabId) throw new Error("tabId is undefined :(");

    const data = this.config.data as PresetCustom;
    for (const step of data.steps) {
      const result = await StepExecutor.execute(this.tabId, step, { loopStack: [] }, {
        skipCollect: !options.collect,
        maxLoopIterations: options.maxLoopIterations,
      });

      for (const item of this.flattenResults(result)) {
        if (item.status === 'error') throw new Error('Ошибка выполнения шага');
        if (options.collect && item.status === 'success' && item.data) this.applyCollect(item.data);
      }
    }
  }

  async checkAvailability() {
    await this.setLog({ status: "warn", title: "[Custom]:Check", value: "Проверка работы сценария..." });
    await this.setDataState({
      categoriesTotal: 0,
      categories: 0,
      productsTotal: 0,
      products: 0,
      groupsModifiersTotal: 0,
      groupsModifiers: 0,
      modifiersTotal: 0,
      modifiers: 0
    });

    try {
      await this.resolveActiveTab();
      await this.executeScenario({ collect: false, maxLoopIterations: 1 });
      await this.setLog({ status: "success", title: "[Custom]:Check", value: "Сценарий доступен" });
    } catch (e) {
      await this.setLog({ status: "danger", title: "[Custom]:Check", value: "Ошибка:" + e });
      this.stop();
      throw e;
    }
  }

  async parseRest() {
    this.categories = [];
    this.products = [];
    this.modifiers = [];
    this.modifiers_groups = [];
    this.parseContext = {};

    await this.executeScenario({ collect: true });
    await this.setDataState({
      categoriesTotal: this.categories.length,
      categories: this.categories.length,
      productsTotal: this.products.length,
      products: this.products.length,
      groupsModifiersTotal: this.modifiers_groups.length,
      groupsModifiers: this.modifiers_groups.length,
      modifiersTotal: this.modifiers.length,
      modifiers: this.modifiers.length,
    });
    await this.waitForNextStep();
  }
}
