interface ParserState {
  availability: {
    isReady: boolean;
    message?: string;
  };
  parsing: {
    type?: PresertOptionsType;
    source?: string;
    isRunning: boolean;
    categories: number;
    categoriesTotal: number;
    products: number;
    productsTotal: number;
    groupsModifiers?: number;
    groupsModifiersTotal?: number;
    modifiers?: number;
    modifiersTotal?: number;
  }
  logs?: {
    status: "success" | "warn" | "danger"
    title: string;
    value: string;
  }[];
};

type PresertOptionsType = 'custom' | 'api' | 'vk' | 'yandex_eda' | 'yandex_map' | 'chibbis';

export type {
  ParserState
}