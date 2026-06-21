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

export type {
  YandexEdaResp,
  YandexEdaRespItem,
  YandexEdaRespGroup
}