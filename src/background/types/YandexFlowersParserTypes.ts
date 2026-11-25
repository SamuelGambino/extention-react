interface YandexFlowersSlugResp {
  payload: {
    foundPlace: {
      place: {
        slug: string;
      }
    }
  }
}

// https://flowers.yandex.ru/api/v2/menu/goods?auto_translate=false
interface YandexFlowersCategoriesReq {
  slug: string;
  maxDepth: number;
}

interface YandexFlowersCategoriesResp {
  payload: {
    categories: {
      id: number,
      name: string,
    }[],
  }
}

interface YandexFlowersFullMenuReq {
  slug: string,
  categories: {
    id: number,
    min_items_count: number,
    max_items_count: number
  }[]
}

interface YandexFlowersFullMenuResp {
  categories: {
    id: number,
    name: string,
    items: YandexFlowersRespItem[],
  }[]
}

interface YandexFlowersRespItem {
  uid: number,
  name: string,
  description: string,
  price: number,
  promoPrice?: number,
  optionsGroups: YandexFlowersRespGroup[],
  picture: {
    url: string,
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

interface YandexFlowersRespGroup {
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
  YandexFlowersRespItem,
  YandexFlowersRespGroup,
  YandexFlowersSlugResp,
  YandexFlowersCategoriesReq,
  YandexFlowersFullMenuReq,
  YandexFlowersFullMenuResp,
  YandexFlowersCategoriesResp
}