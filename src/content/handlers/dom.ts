import type { ContentStepContext } from "../content";

export const getLoopRoot = (context?: ContentStepContext): ParentNode => {
  if (!context?.loopStack?.length) return document;

  let root: ParentNode = document;
  for (const loop of context.loopStack) {
    const elements = Array.from(root.querySelectorAll(loop.selector));
    const element = elements[loop.index];
    if (!element) return document;
    root = element;
  }

  return root;
}

export const queryScopedElement = (selector: string, context?: ContentStepContext): Element | null => {
  const root = getLoopRoot(context);
  return root.querySelector(selector) ?? document.querySelector(selector);
}

export const queryScopedElements = (selector: string, context?: ContentStepContext): Element[] => {
  const root = getLoopRoot(context);
  const elements = Array.from(root.querySelectorAll(selector));
  return elements.length ? elements : Array.from(document.querySelectorAll(selector));
}
