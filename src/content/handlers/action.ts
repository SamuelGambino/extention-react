import type { StepAction } from "../../globalTypes/parser_сonfig";
import type { ElementContext } from "../../globalTypes/messages";
import { queryElement } from "./dom";

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

export const handleAction = (payload: StepAction, context?: ElementContext) => {
  const { action, selector, source } = payload.params;
  const element = queryElement<HTMLElement>(selector, source, context);

  if (!element) {
    throw new Error(`Элемент по селектору "${selector}" не найден на странице.`);
  }

  switch (action) {
    case 'click':
      triggerClick(element);
      return { status: 'success' as const };

    case 'hover':
      triggerHover(element);
      return { status: 'success' as const };

    default:
      throw new Error(`Неизвестный тип действия: ${action}`);
  }
}