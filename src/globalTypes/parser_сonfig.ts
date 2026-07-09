interface ParserConfig {
  actualTab?: string;
  tabs: ParserTabConfig[];
}

interface ParserTabConfig {
  tabName?: string;
  tabId: string;
  type: PresertOptionsType;
  source: string;
  data: PresetDataType;
};

type PresertOptionsType = 'custom' | 'vk' | 'yandex' | 'chibbis' | 'whatsapp' | 'kuper' | 'flowwow';

type PresetDataType = PresetCustom | PresetVk | PresetByApi | PresetWhatsApp;

interface PresetCustom {
  steps: Step[];
  requestDelay?: number;
  waitAfterClick?: number;
}

interface baseStep {
  type: StepType;
  params: Record<string, any>;
  children?: Step[];
}

type Step = StepNavigate | StepCollect | StepLoop | StepAction | StepWait | StepCondition | StepFind | CollectCategoryOrGroup | CollectProduct | CollectModifier;

interface StepNavigate extends baseStep {
  type: "navigate",
  params: {
    mode: "url" | "back" | "reload",
    url?: string
  }
}

interface StepCollect extends baseStep {
  type: "collect",
  entity?: "category" | "product" | "modifier" | "modifier_group",
}

interface CollectCategoryOrGroup extends StepCollect {
  entity?: "category" | "modifier_group",
  params: {
    name: string,
  }
}

interface CollectProduct extends StepCollect {
  entity?: "product",
  params: {
    name: string,
    picture: string,
    description?: string,
    price: string,
    old_price?: string,
    proteins?: string,
    fats?: string,
    carbohydrates?: string,
    calories?: string,
    weight?: string,
  }
}

interface CollectModifier extends StepCollect {
  entity?: "modifier",
  params: {
    name: string,
    price: number,
  }
}

interface StepLoop extends baseStep {
  type: "loop",
  params: {
    source: string
  }
  children: Step[];
}

interface StepAction extends baseStep {
  type: "action",
  params: {
    command: "click";
  }
}

interface StepWait extends baseStep {
  type: "wait",
  params: {
    duration: number;
  }
}

interface StepCondition extends baseStep {
  type: "condition",
  params: {
    selector: string;
  }
}

interface StepFind extends baseStep {
  type: "find",
  params: {
    selector: string;
  }
}

type StepType = "navigate" | "collect" | "extract" | "action" | "wait" | "condition" | "loop" | "find";

interface PresetVk {
  marketId: string;
}

interface PresetByApi {
  apiUrl: string;
}

interface PresetWhatsApp {
  paylodCatalogs: string;
  paylodProducts: string;
}

export type {
  ParserTabConfig,
  ParserConfig,
  PresetByApi,
  PresetVk,
  PresetWhatsApp
}