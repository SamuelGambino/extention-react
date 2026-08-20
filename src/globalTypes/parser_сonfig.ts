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

type IStep = StepCollect | StepLoop | StepAction | StepWait | StepCondition;

type StepCollect = CollectCategoryOrGroup | CollectProduct | CollectModifier | CollectProductParameter;

interface BaseCollect extends baseStep {
  type: "collect",
}

interface CollectCategoryOrGroup extends BaseCollect {
  params: {
    entity?: "category" | "modifier_group",
    name: string,
    source?: "document" | "element",
  }
}

interface CollectProduct extends BaseCollect {
  params: {
    entity?: "product",
    name: string,
    source?: "document" | "element",
    picture?: string,
    description?: string,
    price?: string,
    old_price?: string,
    proteins?: string,
    fats?: string,
    carbohydrates?: string,
    calories?: string,
    weight?: string,
  }
}

interface CollectModifier extends BaseCollect {
  params: {
    entity: "modifier",
    name: string,
    source?: "document" | "element",
    price: string,
  }
}

interface CollectProductParameter extends BaseCollect {
  params: {
    entity: "product_parameter",
    name?: string,
    source?: "document" | "element",
    price: string,
    old_price?: string,
    proteins?: string,
    fats?: string,
    carbohydrates?: string,
    calories?: string,
    index?: string,
  }
}

type ContextEntity = Exclude<StepCollect["params"]["entity"], undefined>;
type LoopContextStrategy = "snapshot" | "dynamic" | "keyed";
type LoopContextKeyType = "text" | "attribute";

interface StepLoop extends baseStep {
  type: "loop",
  params: {
    entity?: ContextEntity,
    source?: "document" | "element",
    selector: string,
    contextStrategy?: LoopContextStrategy,
    keyType?: LoopContextKeyType,
    keyAttribute?: string,
  }
  children: IStep[];
}

type Actions = "click" | "hover"

interface StepAction extends baseStep {
  type: "action",
  params: {
    action: Actions,
    source?: "document" | "element",
    selector: string;
  }
}

type StepWait = StepWaitTimeout | StepWaitElement | StepWaitNavigation;

interface StepWaitTimeout {
  type: "wait";
  params: {
    mode: "timeout";
    duration: number;
  };
}

interface StepWaitElement {
  type: "wait";
  params: {
    mode: "element"; 
    source?: "document" | "element",
    selector: string; 
  };
}

interface StepWaitNavigation {
  type: "wait";
  params: {
    mode: "navigation";
  };
}

interface StepCondition extends baseStep {
  type: "condition",
  params: {
    source?: "document" | "element",
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
  StepCollect,
  LoopContextStrategy,
  LoopContextKeyType,
}