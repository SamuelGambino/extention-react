const state = {
  parser_state: {
    data: {},
    parsing: {},
    logs: [],
  },
};

const recordState = () => {
  globalThis.__customParserStateHistory ??= [];
  globalThis.__customParserStateHistory.push(structuredClone(state));
};

const browser = {
  storage: {
    local: {
      get: async (key) => ({ [key]: state[key] }),
      set: async (value) => {
        Object.assign(state, value);
        recordState();
      },
    },
  },
  tabs: {
    query: async () => [{ id: 1 }],
    sendMessage: async (_tabId, payload) => {
      if (payload.action === "PING") return { status: "READY" };

      if (payload.type === "loop-items") {
        const count = globalThis.__customParserLoopCounts?.shift() ?? 1;
        return {
          status: "success",
          data: Array.from({ length: count }, (_, index) => ({
            selector: payload.selector,
            index,
            id: `test-context-${index}`,
          })),
        };
      }

      if (payload.type === "collect") {
        const response = globalThis.__customParserCollectResponses?.shift();
        if (!response) throw new Error("Для шага collect не настроен тестовый ответ.");
        return { status: "success", data: response };
      }

      return { status: "success" };
    },
    onUpdated: {
      addListener: () => undefined,
      removeListener: () => undefined,
    },
    get: async () => ({ status: "complete" }),
  },
};

export default browser;
