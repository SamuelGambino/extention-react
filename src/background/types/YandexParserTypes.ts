interface YandexResp {
  payload: {
    categories: {
      id: number,
      name: string,
      items: YandexRespItem[],
    }[],
  }
}

interface YandexRespItem {
  id: number,
  name: string,
  description: string,
  price: number,
  optionsGroups: YandexRespGroup[],
  picture: {
    uri: string,
  },
  weight: string,
  measure: {
    value: number,
    measure_unit: string,
  },
  nutrients?: {
    calories: {
      value: number
    },
    proteins: {
      value: number
    },
    fats: {
      value: number
    },
    carbohydrates: {
      value: number
    },
  }
}

interface YandexRespGroup {
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
  YandexResp,
  YandexRespItem,
  YandexRespGroup
}