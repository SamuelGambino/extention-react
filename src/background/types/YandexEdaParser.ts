interface YandexEdaResp {
  payload: {
    categories: {
      id: number,
      name: string,
      items: YandexEdaRespItem[],
    }[],
  }
}

interface YandexEdaRespItem {
  id: number,
  name: string,
  description: string,
  price: number,
  optionsGroups: YandexEdaRespGroup[],
  picture: {
    uri: string,
  },
  weight: string,
  measure: {
    value: number,
    measure_unit: string,
  }
}

interface YandexEdaRespGroup {
  id: number,
  name: string,
  options: {
    id: number,
    name: string,
    price: number
  }[],
  required: boolean,
  minSelected: number,
  maxSelected: number,
}

interface Categories {
  id: number,
  name: string,
  parent: number,
}

interface Product {
  product_id: number,
  name: string,
  picture: string,
  description: string,
  price: {
    id: number,
    price: number,
    index: number[],
  }[],
  category: number,
  modifiers: number[];
}

interface ModGroups {
  id: number;
  name: string,
  type: 'one_one',
  required: false,
  minimum: 1,
  maximum: 10,
  modifiers: Mods[],
};

interface Mods {
  id: number,
  name: string,
  price: number,
  group_id: number,
}

export type {
  Categories,
  Product,
  ModGroups,
  Mods,
  YandexEdaResp,
  YandexEdaRespItem,
  YandexEdaRespGroup
}