import type { ElementContext } from "../../globalTypes/messages";

type Source = "document" | "element" | undefined;

const resolveContextElement = (context?: ElementContext): Element => {
  if (!context?.length) throw new Error("Для source=element не задан контекст элемента.");

  let root: ParentNode = document;
  let current: Element | undefined;

  for (const frame of context) {
    current = root.querySelectorAll(frame.selector)[frame.index];
    if (!current) {
      throw new Error(`Контекстный элемент "${frame.selector}" с индексом ${frame.index} не найден.`);
    }
    root = current;
  }

  return current as Element;
}

export const getRoot = (source: Source, context?: ElementContext): ParentNode => {
  if (source === "element") return resolveContextElement(context);
  return document;
}

export const queryElement = <T extends Element = Element>(selector: string, source: Source, context?: ElementContext): T | null => {
  return getRoot(source, context).querySelector(selector) as T | null;
}

export const queryElementsCount = (selector: string, source: Source, context?: ElementContext): number => {
  return getRoot(source, context).querySelectorAll(selector).length;
}

export const getText = (selector: string | undefined, source: Source, context?: ElementContext): string => {
  if (!selector) return "";
  const element = queryElement<HTMLElement>(selector, source, context);
  return element?.innerText?.trim() || element?.textContent?.trim() || "";
}

export const getAttributeOrText = (selector: string | undefined, source: Source, context?: ElementContext): string => {
  if (!selector) return "";
  const element = queryElement<HTMLElement>(selector, source, context);
  if (!element) return "";

  if (element instanceof HTMLImageElement) return element.currentSrc || element.src || "";
  if (element instanceof HTMLAnchorElement) return element.href || getText(selector, source, context);
  return element.getAttribute("content") || element.getAttribute("src") || element.getAttribute("href") || getText(selector, source, context);
}