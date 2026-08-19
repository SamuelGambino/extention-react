const assert = (condition: unknown, message: string): asserts condition => {
  if (!condition) throw new Error(message);
};

const { getState, updateState } = await import("../src/background/storage.ts");

await updateState(() => ({
  parsing: { isReady: true, isRunning: true },
  data: {
    categories: 0,
    categoriesTotal: 0,
    products: 0,
    productsTotal: 0,
  },
  logs: [],
}));

await Promise.all([
  updateState(async (state) => {
    await new Promise((resolve) => setTimeout(resolve, 5));
    return {
      ...state,
      data: { ...state.data, productsTotal: 12 },
    };
  }),
  updateState((state) => ({
    ...state,
    logs: [...(state.logs ?? []), { status: "success", title: "[Test]", value: "Состояние сохранено" }],
  })),
  updateState((state) => ({
    ...state,
    parsing: { ...state.parsing, isRunning: false },
  })),
]);

const state = await getState();
assert(state.data.productsTotal === 12, "Обновление прогресса не должно теряться при параллельной записи.");
assert(state.logs?.length === 1, "Добавление лога не должно перезаписывать данные прогресса.");
assert(state.parsing.isRunning === false, "Обновление статуса не должно перезаписывать лог или прогресс.");

console.log("atomic parser state regression checks passed");
