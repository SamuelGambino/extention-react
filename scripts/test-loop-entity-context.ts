type CollectedItem = {
  name: string;
  picture?: string;
  description?: string;
  price?: number;
  weight?: string;
};

type StoredParserState = {
  parser_state: {
    data: Record<string, number>;
  };
};

type CustomParserTestGlobal = typeof globalThis & {
  __customParserCollectResponses?: CollectedItem[];
  __customParserLoopCounts?: number[];
  __customParserStateHistory?: StoredParserState[];
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

const parseWithResponses = async (steps: unknown[], responses: CollectedItem[], loopCounts: number[] = [1]) => {
  const testGlobal = globalThis as CustomParserTestGlobal;
  testGlobal.__customParserCollectResponses = [...responses];
  testGlobal.__customParserLoopCounts = [...loopCounts];
  testGlobal.__customParserStateHistory = [];
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

const progressSteps = [
  {
    type: "loop",
    params: { entity: "category", selector: ".category-card" },
    children: [
      { type: "collect", params: { entity: "category", name: ".category-name" } },
      {
        type: "loop",
        params: { entity: "product", selector: ".product-card" },
        children: [
          { type: "collect", params: { entity: "product", name: ".product-name" } },
        ],
      },
    ],
  },
];

await parseWithResponses(progressSteps, [
  { name: "Категория 1" },
  { name: "Товар 1" },
  { name: "Товар 2" },
  { name: "Товар 3" },
  { name: "Категория 2" },
  { name: "Товар 4" },
  { name: "Товар 5" },
], [2, 3, 2]);

const progressHistory = (globalThis as CustomParserTestGlobal).__customParserStateHistory ?? [];
const progressData = progressHistory.map((state) => state.parser_state.data);
const finalProgress = progressData.at(-1);

assert(progressData.some((data) => data.categoriesTotal === 2), "При входе в цикл категорий должен записываться общий счетчик категорий.");
assert(progressData.some((data) => data.productsTotal === 3), "При обработке первой категории должен добавляться размер ее цикла товаров.");
assert(progressData.some((data) => data.productsTotal === 5), "При обработке следующей категории общий счетчик товаров должен накапливаться.");
assert(finalProgress?.categories === 2 && finalProgress.categoriesTotal === 2, "Итоговый прогресс категорий должен отражать все обработанные итерации.");
assert(finalProgress?.products === 5 && finalProgress.productsTotal === 5, "Итоговый прогресс товаров должен отражать все обработанные итерации.");

const modifierProgressSteps = [
  {
    type: "loop",
    params: { entity: "modifier_group", selector: ".modifier-group" },
    children: [
      { type: "collect", params: { entity: "modifier_group", name: ".group-name" } },
      {
        type: "loop",
        params: { entity: "modifier", selector: ".modifier" },
        children: [
          { type: "collect", params: { entity: "modifier", name: ".modifier-name", price: ".modifier-price" } },
        ],
      },
    ],
  },
];

await parseWithResponses(modifierProgressSteps, [
  { name: "Размер" },
  { name: "Маленький", price: 0 },
  { name: "Большой", price: 100 },
  { name: "Добавки" },
  { name: "Сыр", price: 50 },
], [2, 2, 1]);

const modifierProgressHistory = (globalThis as CustomParserTestGlobal).__customParserStateHistory ?? [];
const modifierProgress = modifierProgressHistory.at(-1)?.parser_state.data;
assert(modifierProgress?.groupsModifiers === 2 && modifierProgress.groupsModifiersTotal === 2, "Прогресс групп модификаторов должен учитывать все контекстные итерации.");
assert(modifierProgress?.modifiers === 3 && modifierProgress.modifiersTotal === 3, "Прогресс модификаторов должен динамически накапливаться во вложенных циклах.");

console.log("loop entity context regression checks passed");
