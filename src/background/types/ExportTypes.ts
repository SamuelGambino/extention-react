interface Categories {
  id: number | string,
  name: string,
  parent: number,
}

interface Product {
  product_id: number | string,
  name: string,
  picture: string,
  description: string,
  price: {
    id: number | string,
    price: number,
    proteins?: number,
    fats?: number,
    carbohydrates?: number,
    calories?: number,
    index: number[],
  }[],
  category: number | string,
  modifiers?: (number | string)[];
}

interface ModGroups {
  id: number | string;
  name: string,
  type: 'one_one' | 'one_unlimited' | 'all_one' | 'all_unlimited',
  required: boolean,
  minimum: number,
  maximum: number,
  modifiers: Mods[],
};

interface Mods {
  id: number | string,
  name: string,
  price: number,
  group_id: number | string,
}

interface ExportData {
  categories: Categories[],
  products: Product[],
  modifiers: Mods[],
  modifiers_groups: ModGroups[],
}

export type {
  Categories,
  Product,
  ModGroups,
  Mods,
  ExportData
}