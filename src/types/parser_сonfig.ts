interface ParserConfiguration {
  type: PresertOptionsType;
  source: string;
  data: PresetDataType;
};

type PresertOptionsType = 'custom' | 'api' | 'vk' | 'yandex_eda' | 'yandex_map' | 'chibbis';

type PresetDataType = PresetCustom | PresetVk | PresetYandexEda | PresetYandexMap | PresetChibbis;

interface PresetCustom {
  settings: {
    clicks: ClicksOptionsType;
    pagination: boolean;
    parameters: boolean;
    modifiers: boolean;
  };
  selectors: {
    category: CategorySection;
    product: ProductSection;
    clicks?: ClicksSection;
    pagination?: PaginationSection;
    parameters?: ParametersSection;
    modifiers?: ModifiersSection;
  }
}

type ClicksOptionsType = 'none' | 'products' | 'category' | 'all';

interface CategorySection {
  container: string;
  name?: string;
};

interface ProductSection {
  container: string;
  picture?: string;
  name: string;
  description?: string;
  weight?: string;
  price: string;
};

interface ClicksSection {
  product?: {
    open: string;
    exit?: string;
  };
  category?: {
    open: string;
    exit?: string;
  };
};

interface PaginationSection {
  container: string;
  click: string;
};

interface ParametersSection {
  container: string;
  description?: string;
  click?: string;
  price: string;
}

interface ModifiersSection {
  group: {
    container: string;
    name: string;
    type: GroupTypesType;
  };
  mod: {
    container: string;
    name: string;
    prisce: string;
  };
}

type GroupTypesType = 'one_one' | 'one_unlimited' | 'all_one' | 'all_unlimited';

interface PresetVk {
  marketId: string;
}

interface PresetYandexEda {
  apiUrl: string;
}

interface PresetYandexMap {
  category: CategorySection;
  product: ProductSection;
}

interface PresetChibbis {
  apiUrl: string;
}

export type {
  ParserConfiguration,
}