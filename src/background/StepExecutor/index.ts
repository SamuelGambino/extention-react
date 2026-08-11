import type { IStep, StepAction, StepCondition, StepLoop, StepWait } from '../../globalTypes/parser_сonfig';
import { executeAction } from './handlers/action';
import { waitForTabComplete, waitUntilContentReady } from './handlers/wait';
import browser from "webextension-polyfill";

export interface StepExecutionContext {
  loopStack: { selector: string; index: number }[];
}

export interface StepExecutionOptions {
  skipCollect?: boolean;
  maxLoopIterations?: number;
}

export class StepExecutor {
  private static async ensureContentReady(tabId: number): Promise<void> {
    let isReady = false;
    for (let i = 0; i < 10; i++) {
      try {
        await browser.tabs.sendMessage(tabId, { action: "PING" });
        isReady = true;
        break;
      } catch {
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    }

    if (!isReady) throw new Error("Контент-скрипт не ответил вовремя");
  }

  static async execute(tabId: number, step: IStep, context: StepExecutionContext = { loopStack: [] }, options: StepExecutionOptions = {}): Promise<unknown> {
    await StepExecutor.ensureContentReady(tabId);

    switch (step.type) {
      case 'wait': {
        const waitStep = step as StepWait;
        if (waitStep.params.mode === 'timeout') {
          await new Promise((resolve) => setTimeout(resolve, waitStep.params.duration));
          return;
        }
        if (waitStep.params.mode === 'navigation') {
          await waitForTabComplete(tabId);
          await waitUntilContentReady(tabId);
        }
        if (waitStep.params.mode === 'element') {
          return await browser.tabs.sendMessage(tabId, { ...waitStep, context });
        }
        return;
      }

      case 'action':
        return await executeAction(tabId, step as StepAction, context);

      case 'collect':
        if (options.skipCollect) return { status: 'skipped' };
        return await browser.tabs.sendMessage(tabId, { ...step, context });

      case 'condition': {
        const conditionStep = step as StepCondition;
        const response = await browser.tabs.sendMessage(tabId, { ...conditionStep, context }) as { status: string; matched: boolean };
        if (response.status !== 'success') return response;
        if (response.matched) {
          const results = [];
          for (const child of conditionStep.children) {
            results.push(await StepExecutor.execute(tabId, child, context, options));
          }
          return { status: 'success', matched: true, results };
        }
        return { status: 'success', matched: false, results: [] };
      }

      case 'loop': {
        const loopStep = step as StepLoop;
        const response = await browser.tabs.sendMessage(tabId, { type: 'loop', params: loopStep.params, context }) as { status: string; count: number };
        if (response.status !== 'success') return response;

        const results = [];
        const iterations = options.maxLoopIterations === undefined ? response.count : Math.min(response.count, options.maxLoopIterations);
        for (let index = 0; index < iterations; index++) {
          const childContext = {
            loopStack: [...context.loopStack, { selector: loopStep.params.source, index }]
          };
          for (const child of loopStep.children) {
            results.push(await StepExecutor.execute(tabId, child, childContext, options));
          }
        }
        return { status: 'success', count: response.count, results };
      }

      default:
        throw new Error(`[StepExecutor] Неизвестный тип шага`);
    }
  }
}
