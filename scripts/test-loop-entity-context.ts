type CollectedItem = {
  name: string;
  picture?: string;
  description?: string;
  price?: number;
  weight?: string;
};

type CustomParserTestGlobal = typeof globalThis & {
  __customParserCollectResponses?: CollectedItem[];
};

const assert = (condition: unknown, message: string): asserts condition => {
  if (!condition) throw new Error(message);
};

const { Custom } = await import("../src/background/parsers/Custom.ts");

const createConfig = (steps: unknown[]) => ({
  tabId: "test-tab",
  type: "custom",
  source: "https://example.test",
  data: { steps },
});

const parseWithResponses = async (steps: unknown[], responses: CollectedItem[]) => {
  (globalThis as CustomParserTestGlobal).__customParserCollectResponses = [...responses];
  const parser = new Custom(createConfig(steps), "parse");
  await parser.parseRest();
  return parser as unknown as {
    categories: Array<{ name: string }>;
    products: Array<{ name: string; description: string; price: Array<{ price: number; index: number[] }> }>;
  };
};

const productContextSteps = [
  {
    type: "loop",
    params: { entity: "product", selector: ".product-card" },
    children: [
      { type: "collect", params: { entity: "product", name: ".card-title", weight: ".card-weight" } },
      { type: "action", params: { action: "click", selector: ".card" } },
      { type: "collect", params: { entity: "product", name: ".modal-title", description: ".modal-description", price: ".modal-price" } },
    ],
  },
];

const productContextParser = await parseWithResponses(productContextSteps, [
  { name: "Суп", weight: "500 г" },
  { name: "Суп", description: "Описание из модального окна", price: 349 },
]);

assert(productContextParser.products.length === 1, "Контекстный цикл product не должен создавать дубликат товара.");
assert(productContextParser.products[0].description === "Описание из модального окна", "Повторный collect product должен дополнить описание товара.");
assert(productContextParser.products[0].price.length === 1, "Повторный collect product с ценой должен добавить единственный параметр товара.");
assert(productContextParser.products[0].price[0].price === 349, "Параметр должен получить цену из модального окна.");
assert(productContextParser.products[0].price[0].index[0] === 500, "Вес из карточки должен сохраниться как индекс параметра.");

const untypedLoopSteps = [
  {
    type: "loop",
    params: { selector: ".anything" },
    children: [
      { type: "collect", params: { entity: "product", name: ".first" } },
      { type: "collect", params: { entity: "product", name: ".second" } },
    ],
  },
];

const untypedLoopParser = await parseWithResponses(untypedLoopSteps, [
  { name: "Первый товар" },
  { name: "Второй товар" },
]);
assert(untypedLoopParser.products.length === 2, "Цикл без сущности должен сохранять независимое поведение collect.");

const categoryContextSteps = [
  {
    type: "loop",
    params: { entity: "category", selector: ".category-card" },
    children: [
      { type: "collect", params: { entity: "category", name: ".category-short-name" } },
      { type: "collect", params: { entity: "category", name: ".category-full-name" } },
    ],
  },
];

const categoryContextParser = await parseWithResponses(categoryContextSteps, [
  { name: "Напитки" },
  { name: "Напитки и коктейли" },
]);
assert(categoryContextParser.categories.length === 1, "Контекстный цикл category не должен создавать дубликат категории.");
assert(categoryContextParser.categories[0].name === "Напитки и коктейли", "Повторный collect category должен дополнить текущую категорию.");

console.log("loop entity context regression checks passed");
