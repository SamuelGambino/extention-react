import type { StepAction } from "../../globalTypes/parser_сonfig";
import type { ElementContext } from "../../globalTypes/messages";
import { waitForElement } from "./dom";

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

[
  { 
    "selector": ".container .row .card", 
    "index": 0, 
    "strategy": "snapshot", 
    "id": "custom-parser-context-1792145458733-0" 
  }, 
  { 
    "selector": ".card__switch .card__option", 
    "index": 0, 
    "strategy": "snapshot", 
    "id": "custom-parser-context-1792145458736-27" 
  }
]

export const handleAction = async (payload: StepAction, context?: ElementContext) => {
  const { action, selector, source } = payload.params;
  const element = await waitForElement<HTMLElement>(selector, source, context);

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