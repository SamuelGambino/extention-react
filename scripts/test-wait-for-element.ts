type Queryable = {
  querySelector: (selector: string) => unknown | null;
  querySelectorAll?: (selector: string) => ArrayLike<unknown>;
};

const assert = (condition: unknown, message: string): asserts condition => {
  if (!condition) throw new Error(message);
};

const documentRoot = {
  querySelector: (() => {
    let attempts = 0;
    const modalCloseButton = { id: "modal-close" };

    return (selector: string) => {
      attempts += 1;
      return selector === '[aria-label="close-modal"]' && attempts >= 3 ? modalCloseButton : null;
    };
  })(),
  querySelectorAll: () => [],
};

globalThis.document = documentRoot as unknown as Document;

const { createElementContexts, getRoot, releaseElementContexts, waitForElement } = await import("../src/content/handlers/dom.ts");

const closeButton = await waitForElement(
  '[aria-label="close-modal"]',
  "document",
  undefined,
  100,
  1,
);
assert((closeButton as { id: string }).id === "modal-close", "Кнопка модального окна должна быть найдена после рендеринга.");

const nestedProduct = {
  querySelector: (selector: string) => selector === ".title" ? { textContent: "Товар" } : null,
};
const nestedDocumentRoot: Queryable = {
  querySelector: () => null,
  querySelectorAll: (selector: string) => selector === ".product-card" ? [nestedProduct] : [],
};
globalThis.document = nestedDocumentRoot as unknown as Document;

const title = await waitForElement(
  ".title",
  "element",
  [{ selector: ".product-card", index: 0 }],
  10,
  1,
);
assert((title as { textContent: string }).textContent === "Товар", "Контекст вложенного цикла должен оставаться доступным.");

const originalProduct = {
  id: "original-product",
  isConnected: true,
  querySelector: () => null,
  querySelectorAll: () => [],
};
const replacementProduct = {
  id: "replacement-product",
  isConnected: true,
  querySelector: () => null,
  querySelectorAll: () => [],
};
let productCards = [originalProduct];
globalThis.document = {
  querySelector: () => null,
  querySelectorAll: (selector: string) => selector === ".product-card" ? productCards : [],
} as unknown as Document;

const contexts = createElementContexts(".product-card", "document");
productCards = [replacementProduct];
const preservedRoot = getRoot("element", [contexts[0]]);
assert((preservedRoot as { id: string }).id === "original-product", "Контекст цикла не должен переключаться на элемент с тем же индексом после изменения DOM.");

releaseElementContexts(contexts);
let releasedContextFailed = false;
try {
  getRoot("element", [contexts[0]]);
} catch {
  releasedContextFailed = true;
}
assert(releasedContextFailed, "Освобожденный контекст не должен повторно находить другой элемент по индексу.");

const oldDynamicOption = { id: "old-dynamic-option", isConnected: false, querySelector: () => null, querySelectorAll: () => [] };
const newDynamicOption = { id: "new-dynamic-option", isConnected: true, querySelector: () => null, querySelectorAll: () => [] };
let dynamicOptions = [oldDynamicOption];
globalThis.document = {
  querySelector: () => null,
  querySelectorAll: (selector: string) => selector === ".size-option" ? dynamicOptions : [],
} as unknown as Document;

const dynamicContexts = createElementContexts(".size-option", "document", undefined, "dynamic");
dynamicOptions = [newDynamicOption];
const dynamicRoot = getRoot("element", [dynamicContexts[0]]);
assert((dynamicRoot as { id: string }).id === "new-dynamic-option", "Dynamic-контекст должен заново находить элемент по индексу после перерисовки списка.");

const smallOption = { id: "small-old", textContent: "Маленькая порция", isConnected: false, querySelector: () => null, querySelectorAll: () => [] };
const largeOption = { id: "large-old", textContent: "Большая порция", isConnected: false, querySelector: () => null, querySelectorAll: () => [] };
const refreshedSmallOption = { id: "small-new", textContent: "Маленькая порция", isConnected: true, querySelector: () => null, querySelectorAll: () => [] };
const refreshedLargeOption = { id: "large-new", textContent: "Большая порция", isConnected: true, querySelector: () => null, querySelectorAll: () => [] };
let keyedOptions = [smallOption, largeOption];
globalThis.document = {
  querySelector: () => null,
  querySelectorAll: (selector: string) => selector === ".size-option" ? keyedOptions : [],
} as unknown as Document;

const keyedContexts = createElementContexts(".size-option", "document", undefined, "keyed", "text");
keyedOptions = [refreshedLargeOption, refreshedSmallOption];
const keyedRoot = getRoot("element", [keyedContexts[1]]);
assert((keyedRoot as { id: string }).id === "large-new", "Keyed-контекст должен находить вариант по сохраненному ключу после изменения порядка и пересоздания DOM.");

const oldAttributeOption = {
  id: "attribute-old",
  isConnected: false,
  getAttribute: (name: string) => name === "data-size-id" ? "large" : null,
  querySelector: () => null,
  querySelectorAll: () => [],
};
const newAttributeOption = {
  id: "attribute-new",
  isConnected: true,
  getAttribute: (name: string) => name === "data-size-id" ? "large" : null,
  querySelector: () => null,
  querySelectorAll: () => [],
};
let attributeOptions = [oldAttributeOption];
globalThis.document = {
  querySelector: () => null,
  querySelectorAll: (selector: string) => selector === ".size-option" ? attributeOptions : [],
} as unknown as Document;

const attributeContexts = createElementContexts(".size-option", "document", undefined, "keyed", "attribute", "data-size-id");
attributeOptions = [newAttributeOption];
const attributeRoot = getRoot("element", [attributeContexts[0]]);
assert((attributeRoot as { id: string }).id === "attribute-new", "Keyed-контекст по атрибуту должен повторно находить новый DOM-элемент с тем же ключом.");

console.log("waitForElement regression checks passed");
