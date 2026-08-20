import type { ElementContext, ElementContextFrame } from "../../globalTypes/messages";
import type { LoopContextKeyType, LoopContextStrategy } from "../../globalTypes/parser_сonfig";

type Source = "document" | "element" | undefined;

const contextElements = new Map<string, Element>();
let contextSequence = 0;

const createContextId = () => `custom-parser-context-${Date.now()}-${contextSequence++}`;

const normalizeContextKey = (value: string | null | undefined) => value?.replace(/\s+/g, " ").trim() ?? "";

const getElementKey = (element: Element, keyType: LoopContextKeyType, keyAttribute?: string): string => {
  if (keyType === "attribute") {
    if (!keyAttribute?.trim()) throw new Error("Для keyed-контекста по атрибуту укажите имя атрибута ключа.");
    return normalizeContextKey(element.getAttribute(keyAttribute));
  }

  return normalizeContextKey(element.textContent);
};

const resolveDynamicElement = (root: ParentNode, frame: ElementContextFrame): Element => {
  const element = root.querySelectorAll(frame.selector)[frame.index];
  if (!element) {
    throw new Error(`Контекстный элемент "${frame.selector}" с индексом ${frame.index} не найден.`);
  }
  return element;
};

const resolveKeyedElement = (root: ParentNode, frame: ElementContextFrame): Element => {
  if (!frame.key) throw new Error(`Для keyed-контекста "${frame.selector}" не сохранен ключ элемента.`);

  const keyType = frame.keyType ?? "text";
  const matches = Array.from(root.querySelectorAll(frame.selector)).filter((element) => (
    getElementKey(element, keyType, frame.keyAttribute) === frame.key
  ));

  if (matches.length === 0) {
    throw new Error(`Элемент keyed-контекста "${frame.selector}" с ключом "${frame.key}" не найден.`);
  }
  if (matches.length > 1) {
    throw new Error(`Ключ "${frame.key}" для "${frame.selector}" не уникален. Выберите атрибут с уникальным значением.`);
  }

  return matches[0];
};

const resolveContextElement = (context?: ElementContext): Element => {
  if (!context?.length) throw new Error("Для source=element не задан контекст элемента.");

  let root: ParentNode = document;
  let current: Element | undefined;

  for (const frame of context) {
    const strategy: LoopContextStrategy = frame.strategy ?? (frame.id ? "snapshot" : "dynamic");

    if (strategy === "snapshot") {
      const savedElement = frame.id ? contextElements.get(frame.id) : undefined;
      if (!savedElement || savedElement.isConnected === false) {
        throw new Error(`Контекстный элемент "${frame.selector}" больше не существует на странице.`);
      }
      current = savedElement;
    } else if (strategy === "keyed") {
      current = resolveKeyedElement(root, frame);
    } else {
      current = resolveDynamicElement(root, frame);
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

export const createElementContexts = (
  selector: string,
  source: Source,
  context?: ElementContext,
  contextStrategy: LoopContextStrategy = "snapshot",
  keyType: LoopContextKeyType = "text",
  keyAttribute?: string,
): ElementContextFrame[] => {
  const root = getRoot(source, context);
  const elements = Array.from(root.querySelectorAll(selector));
  const keys = new Set<string>();

  return elements.map((element, index) => {
    const frame: ElementContextFrame = { selector, index, strategy: contextStrategy };

    if (contextStrategy === "snapshot") {
      const id = createContextId();
      contextElements.set(id, element);
      frame.id = id;
      return frame;
    }

    if (contextStrategy === "keyed") {
      const key = getElementKey(element, keyType, keyAttribute);
      if (!key) throw new Error(`Не удалось получить ключ для элемента "${selector}". Выберите другой тип ключа или атрибут.`);
      if (keys.has(key)) throw new Error(`Ключ "${key}" для "${selector}" не уникален. Выберите атрибут с уникальным значением.`);

      keys.add(key);
      frame.key = key;
      frame.keyType = keyType;
      frame.keyAttribute = keyAttribute;
    }

    return frame;
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
