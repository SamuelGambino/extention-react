interface ChibbisResp {
  menu: ChibbisCategoryResp[];
}

interface ChibbisCategoryResp {
  id: string,
  name: string,
  products: ChibbisProductResp[],
}

interface ChibbisProductResp {
  id: string,
  name: string,
  price: number,
  description: string | null,
  imageUrls: string[],
  weight: {
    value: number,
    measure: number
  },
  modifierGroups: ChibbisModGroupResp[] | [],
  nutrition: {
    calories: number,
    fats: number,
    proteins: number,
    carbohydrates: number
  } | null,
}

interface ChibbisModGroupResp {
  id: string,
  name: string,
  modifiers: ChibbisModResp[],
  minSelectedModifiers: number,
  maxSelectedModifiers: number,
  required: boolean
}

interface ChibbisModResp {
  id: string,
  name: string,
  price: number,
  required: boolean,
}

export type {
  ChibbisResp,
  ChibbisProductResp,
  ChibbisModGroupResp,
}