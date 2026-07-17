import browser from "webextension-polyfill";

export interface ActionPayload {
  action: 'click' | 'hover';
  selector: string;
}

export async function executeAction(tabId: number, payload: ActionPayload): Promise<any> {
  try {
    const response = await browser.tabs.sendMessage(tabId, {
      module: 'action',
      data: payload
    });

    return response;
  } catch (error: any) {
    throw error;
  }
}