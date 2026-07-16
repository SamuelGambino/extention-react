import browser from "webextension-polyfill";
import { waitForTabComplete } from './tabUtils.ts';

export interface ActionPayload {
  action: 'click' | 'hover';
  selector: string;
}

export async function executeAction(tabId: number, payload: ActionPayload): Promise<any> {
  await waitForTabComplete(tabId);

  try {
    const response = await browser.tabs.sendMessage(tabId, {
      module: 'action',
      data: payload
    });

    return response;

  } catch (error: any) {
    const errorMessage = error.message || '';
    const isNavigationError = 
      errorMessage.includes('closed before a response') || 
      errorMessage.includes('Receiving end does not exist');

    if (isNavigationError) {
      console.log(`[Action Module] Действие вызвало перезагрузку вкладки ${tabId}. Ожидаем...`);
      
      await waitForTabComplete(tabId);
      
      return { 
        status: 'success', 
        reloaded: true, 
        message: 'Action completed and triggered page reload' 
      };
    }

    throw error;
  }
}