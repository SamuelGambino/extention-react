interface YandexEdaResp {
  payload: {
    categories: {
      name: string,
      items: {
        id: number,
        name: string,
        description: string,
        price: number,
        optionsGroups: {
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
        }[],
        picture: {
          uri: string,
        },
        weight: string,
        measure: {
          value: number,
          measure_unit: string,
        }
      }[],
    }[],
  }
}

interface Categories {
  id: string,
  name: string,
  parent: number,
}

interface Product {
  product_id: string,
  name: string,
  picture: string,
  description: string,
  price: {
    id: string,
    price: string,
    index: number[],
  }[],
  category: string,
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
  YandexEdaResp
}