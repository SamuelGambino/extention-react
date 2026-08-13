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

const { waitForElement } = await import("../src/content/handlers/dom.ts");

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

console.log("waitForElement regression checks passed");
