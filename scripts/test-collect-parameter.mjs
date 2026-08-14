import { createServer } from "vite";

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const parameterElements = {
  ".parameter-name": { innerText: "Большая порция" },
  ".parameter-price": { innerText: "349,90 ₽" },
  ".parameter-old-price": { innerText: "399 ₽" },
  ".parameter-proteins": { innerText: "12,5" },
  ".parameter-index": { innerText: "2, 10" },
};

globalThis.document = {
  querySelector: (selector) => parameterElements[selector] ?? null,
  querySelectorAll: () => [],
};

const server = await createServer({
  configFile: false,
  appType: "custom",
  server: { middlewareMode: true },
});

try {
  const { handleCollect } = await server.ssrLoadModule("/src/content/handlers/collect.ts");
  const parameterResponse = handleCollect({
    type: "collect",
    params: {
      entity: "product_parameter",
      name: ".parameter-name",
      price: ".parameter-price",
      old_price: ".parameter-old-price",
      proteins: ".parameter-proteins",
      index: ".parameter-index",
    },
  });
  const parameter = parameterResponse.data;

  assert(parameter.name === "Большая порция", "Должно извлекаться имя параметра.");
  assert(parameter.price === 349.9, "Должна извлекаться цена параметра.");
  assert(parameter.old_price === 399, "Должна извлекаться старая цена параметра.");
  assert(parameter.proteins === 12.5, "Должен извлекаться нутриент параметра.");
  assert(parameter.index === "2, 10", "Должен извлекаться индекс параметра.");

  console.log("product_parameter collection regression checks passed");
} finally {
  await server.close();
}
