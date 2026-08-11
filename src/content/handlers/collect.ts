import type { StepCollect } from "../../globalTypes/parser_сonfig";
import type { ContentStepContext } from "../content";
import { queryScopedElement } from "./dom";

const readValue = (selector?: string, context?: ContentStepContext): string => {
  if (!selector) return '';

  const element = queryScopedElement(selector, context) as HTMLElement | HTMLImageElement | null;
  if (!element) return '';

  if ('value' in element && typeof element.value === 'string') return element.value.trim();
  if (element instanceof HTMLImageElement) return element.currentSrc || element.src || '';

  return (element.textContent ?? '').trim();
}

export const handleCollect = (payload: StepCollect & { context?: ContentStepContext }) => {
  const params = payload.params;
  const data = Object.fromEntries(
    Object.entries(params).map(([key, value]) => [key, key === 'entity' ? value : readValue(value, payload.context)])
  );

  return { status: 'success', data };
}
