const state = {
  parser_state: {
    data: {},
    parsing: {},
    logs: [],
  },
};

const browser = {
  storage: {
    local: {
      get: async (key) => ({ [key]: state[key] }),
      set: async (value) => Object.assign(state, value),
    },
  },
  tabs: {
    query: async () => [{ id: 1 }],
    sendMessage: async (_tabId, payload) => {
      if (payload.action === "PING") return { status: "READY" };

      if (payload.type === "loop-items") {
        return { status: "success", data: 1 };
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
