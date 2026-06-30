// https://clientweb.flowwow.com/apiuser/shop/categories/?shopId=92913&lang=ru
interface FlowwowCategoryResp {
  id: number,
  name: string,
  products?: {
    id: number,
    price: number
  }[]
}

// https://clientweb.flowwow.com/apiuser/products/search/?property=%7B%22owner_shop_ids%22%3A%5B92913%5D%2C%22range_type_ids%22%3A%5B16%5D%2C%22currency%22%3A%22RUB%22%2C%22city%22%3A141%2C%22all_shop_work_time%22%3A1%7D&lang=ru&currency=RUB&limit=20&filters=%7B%7D&page=1
// { // property
//   owner_shop_ids: [92913], // id магазина
//   range_type_ids: [16], // id категории
//   currency: "RUB",
//   city: 141,
//   all_shop_work_time: 1
// }
// lang = ru &
// currency=RUB &
// limit=60 & // макс - 60
// filters=% 7B % 7D & // всегда пустой {}
// page=1 // если в ответе total > 60 - перебор страниц

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
// https://clientweb.flowwow.com/apiuser/products/search/?property=%7B%22owner_shop_ids%22%3A%5B92913%5D%2C%22range_type_ids%22%3A%5B395%5D%2C%22currency%22%3A%22RUB%22%2C%22city%22%3A141%2C%22all_shop_work_time%22%3A1%7D&lang=ru&currency=RUB&limit=20&filters=%7B%7D&page=1

// https://clientweb.flowwow.com/apiuser/products/info/?id=72931267&city_id=141&lang=ru&currency=RUB&locale=ru
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