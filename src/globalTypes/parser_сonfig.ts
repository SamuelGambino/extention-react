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
  steps: IStep[];
  requestDelay?: number;
  waitAfterClick?: number;
}

interface baseStep {
  type: StepType;
}

type IStep = StepCollect | StepLoop | StepAction | StepWait | StepCondition | CollectCategoryOrGroup | CollectProduct;

// interface StepNavigate extends baseStep {
//   type: "navigate",
//   params: {
//     mode: "url" | "back" | "reload",
//     url?: string
//   }
// }

type StepCollect = CollectCategoryOrGroup | CollectProduct;

interface BaseCollect extends baseStep {
  type: "collect",
  entity?: "category" | "product" | "modifier" | "modifier_group",
}

interface CollectCategoryOrGroup extends BaseCollect {
  entity?: "category" | "modifier_group",
  params: {
    name: string,
  }
}

interface CollectProduct extends BaseCollect {
  entity?: "product" | "modifier",
  params: {
    name: string,
    picture?: string,
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

interface StepLoop extends baseStep {
  type: "loop",
  params: {
    source: string
  }
  children: IStep[];
}

type Actions = "click" | "hover"

interface StepAction extends baseStep {
  type: "action",
  action: Actions,
  params: {
    selector: string;
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
    exists: boolean;
    selector: string;
  }
  children: IStep[];
}

type StepType = "collect" | "action" | "wait" | "condition" | "loop";

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
  PresetWhatsApp,
  StepType,
  IStep,
  PresetCustom,
  StepLoop,
  StepCondition,
  StepAction,
  StepWait,
  StepCollect
}