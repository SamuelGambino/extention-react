import type { IStep } from '../../globalTypes/parser_сonfig';
import { executeAction, type ActionPayload } from './handlers/action';
import { waitForTabComplete } from './handlers/wait';
// import { executeCollect, CollectPayload } from './handlers/collect';
// import { executeCondition, ConditionPayload } from './handlers/condition';

export class StepExecutor {
  static async execute(tabId: number, step: IStep): Promise<any> {
    console.log(`[StepExecutor] Запуск шага: ${step.type} во вкладке ${tabId}`);

    switch (step.type) {
      case 'wait':
        return await waitForTabComplete(tabId);

      case 'action':
        return await executeAction(tabId, step.params as ActionPayload);
        
      case 'collect':
        // return await executeCollect(tabId, step.payload as CollectPayload);
        throw new Error('Модуль collect еще не реализован');

      case 'condition':
        // return await executeCondition(tabId, step.payload as ConditionPayload);
        throw new Error('Модуль condition еще не реализован');

      case 'loop':
        // Логика циклов может обрабатываться здесь же, рекурсивно вызывая execute
        throw new Error('Модуль loop еще не реализован');

      default:
        throw new Error(`[StepExecutor] Неизвестный тип шага`);
    }
  }
}