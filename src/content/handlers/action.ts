import browser from "webextension-polyfill";
import type { StepAction } from "../../globalTypes/parser_сonfig";

const triggerHover = (element: HTMLElement): void => {
  const mouseOverEvent = new MouseEvent('mouseover', {
    bubbles: true,
    cancelable: true,
    view: window
  });
  const mouseEnterEvent = new MouseEvent('mouseenter', {
    bubbles: true,
    cancelable: true,
    view: window
  });
  
  element.dispatchEvent(mouseOverEvent);
  element.dispatchEvent(mouseEnterEvent);
}

const triggerClick = (element: HTMLElement): void => {
  element.click();
}

export const handleAction = (payload: StepAction) => {
  const { action, selector } = payload.params;
  
  const element = document.querySelector(selector) as HTMLElement;
  
  if (!element) {
    throw new Error(`Элемент по селектору "${selector}" не найден на странице.`);
  }

  switch (action) {
    case 'click':
      triggerClick(element);
      return { status: 'success', message: `Успешный клик по "${selector}"` };
      
    case 'hover':
      triggerHover(element);
      return { status: 'success', message: `Успешный ховер на "${selector}"` };
      
    default:
      throw new Error(`Неизвестный тип действия: ${action}`);
  }
}