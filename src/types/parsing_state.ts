interface ParserState {
  parsing: {
    isReady: boolean;
    message?: string;
    type?: PresertOptionsType;
    source?: string;
    isRunning: boolean;
    waitingForStep?: boolean;
  };
  data: {
    categories: number;
    categoriesTotal: number;
    products: number;
    productsTotal: number;
    groupsModifiers?: number;
    groupsModifiersTotal?: number;
    modifiers?: number;
    modifiersTotal?: number;
  }
  logs?: Log[];
};

interface Log {
  status: "success" | "warn" | "danger"
  title: string;
  value: string;
}

type PresertOptionsType = 'custom' | 'api' | 'vk' | 'yandex_eda' | 'yandex_map' | 'chibbis';

export type {
  ParserState,
  Log
}