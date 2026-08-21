export const terms = {
  actions: {
    checkState: "Check state",
    parse: "Parse",
    next: "Next",
    stop: "Stop",
    parseBySteps: "Parse by steps",
  },
  footer: {
    developer: "developer",
  },
  form: {
    main: "Main",
    configuration: "Configuration",
    scenarioBuilder: "Scenario Builder",
    preset: "Preset",
    source: "Source",
    autoFill: "Auto-Fill",
    addStep: "+ Add step",
    apiUrl: "API URL",
  },
  state: {
    title: "State",
    preset: "Preset",
    source: "Source",
  },
  parserNames: {
    custom: "Custom",
    vk: "VK",
    yandex: "Yandex",
    chibbis: "Chibbis",
    whatsapp: "WhatsApp",
    kuper: "Kuper",
    flowwow: "Flowwow",
    base: "BaseParser",
    exporter: "Exporter",
  },
  logPhases: {
    check: "Check",
    parse: "Parse",
    auth: "Auth",
    export: "Export",
  },
} as const;

export type ParserName = keyof typeof terms.parserNames;
export type LogPhase = keyof typeof terms.logPhases;

export const formatLogScope = (parser: ParserName, phase?: LogPhase): string => {
  const parserName = terms.parserNames[parser];
  return phase ? `[${parserName}]:${terms.logPhases[phase]}` : `[${parserName}]`;
};
