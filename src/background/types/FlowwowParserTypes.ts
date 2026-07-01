interface FlowwowCategoryResp {
  id: number,
  name: string,
  products?: {
    id: number,
    price: number
  }[]
}

interface SearchProperties {
  owner_shop_ids: number[];
  range_type_ids: number[];
  currency: string;
  city: number;
  all_shop_work_time: number;
}

interface FlowwowProductsResp {
  items: {
    id: number,
    price: number
  }[],
  total: number,
}

interface FlowwowProductInfoResp {
  data: {
    id: number,
    name: string,
    size: {
      width: number,
      height: number
    },
    is_available: true,
    description: {
      show: string,
      hide: string
    },
    rangeProperties: {
      title: string,
      items: string[],
      type: string
    }[],
    photo: string
  }
};

export type {
  FlowwowCategoryResp,
  SearchProperties,
  FlowwowProductsResp,
  FlowwowProductInfoResp,
}