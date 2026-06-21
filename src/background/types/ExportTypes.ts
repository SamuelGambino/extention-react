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
  modifiers?: number[];
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