import type { ElementContext, ElementContextFrame } from "../../globalTypes/messages";

type Source = "document" | "element" | undefined;

const contextElements = new Map<string, Element>();
let contextSequence = 0;

const createContextId = () => `custom-parser-context-${Date.now()}-${contextSequence++}`;

const resolveContextElement = (context?: ElementContext): Element => {
  if (!context?.length) throw new Error("Для source=element не задан контекст элемента.");

  let root: ParentNode = document;
  let current: Element | undefined;

  for (const frame of context) {
    if (frame.id) {
      const savedElement = contextElements.get(frame.id);
      if (!savedElement || savedElement.isConnected === false) {
        throw new Error(`Контекстный элемент "${frame.selector}" больше не существует на странице.`);
      }
      current = savedElement;
    } else {
      current = root.querySelectorAll(frame.selector)[frame.index];
      if (!current) {
        throw new Error(`Контекстный элемент "${frame.selector}" с индексом ${frame.index} не найден.`);
      }
    }
    root = current;
  }

  return current as Element;
};

export const getRoot = (source: Source, context?: ElementContext): ParentNode => {
  if (source === "element") return resolveContextElement(context);
  return document;
};

export const queryElement = <T extends Element = Element>(selector: string, source: Source, context?: ElementContext): T | null => {
  return getRoot(source, context).querySelector(selector) as T | null;
};

export const waitForElement = async <T extends Element = Element>(
  selector: string,
  source: Source,
  context?: ElementContext,
  timeoutMs = 10_000,
  pollIntervalMs = 100,
): Promise<T> => {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    const element = queryElement<T>(selector, source, context);
    if (element) return element;

    await new Promise<void>((resolve) => setTimeout(resolve, pollIntervalMs));
  }

  throw new Error(`Элемент по селектору "${selector}" не найден за ${timeoutMs}мс.`);
};

export const createElementContexts = (selector: string, source: Source, context?: ElementContext): ElementContextFrame[] => {
  const root = getRoot(source, context);
  return Array.from(root.querySelectorAll(selector)).map((element, index) => {
    const id = createContextId();
    contextElements.set(id, element);
    return { selector, index, id };
  });
};

export const releaseElementContexts = (context?: ElementContext) => {
  context?.forEach((frame) => {
    if (frame.id) contextElements.delete(frame.id);
  });
};

export const queryElementsCount = (selector: string, source: Source, context?: ElementContext): number => {
  return getRoot(source, context).querySelectorAll(selector).length;
};

export const getText = (selector: string | undefined, source: Source, context?: ElementContext): string => {
  if (!selector) return "";
  const element = queryElement<HTMLElement>(selector, source, context);
  return element?.innerText?.trim() || element?.textContent?.trim() || "";
};

export const getAttributeOrText = (selector: string | undefined, source: Source, context?: ElementContext): string => {
  if (!selector) return "";
  const element = queryElement<HTMLElement>(selector, source, context);
  if (!element) return "";

  if (element instanceof HTMLImageElement) return element.currentSrc || element.src || "";
  if (element instanceof HTMLAnchorElement) return element.href || getText(selector, source, context);
  return element.getAttribute("content") || element.getAttribute("src") || element.getAttribute("href") || getText(selector, source, context);
};
