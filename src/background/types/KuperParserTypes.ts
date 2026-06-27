interface ApiCategory {
  name: string;
  id: string;
  products: { slug: string; }[];
}

interface KuperResp {
  departments: ApiCategory[];
}

interface KuperProductResp {
  data: {
    product: {
      description: string,
      id: string,
      images: {
        original_url: string,
      }[],
      name: string,
      offer: {
        id: string,
        options: KuperOptionsResp[],
        unit_price: number,
      },
      volume: number,
      volume_type: string
    },
    product_properties: {
      name: "protein" | "fat" | "carbohydrate" | "energy_value",
      value: string;
    }[],
  }
}

interface KuperOptionsResp {
  id: string,
  items: {
    name: string,
    price: number,
    sku: number,
  }[],
  max_items: number,
  min_items: number,
  title: string
};

export type {
  KuperResp,
  ApiCategory,
  KuperProductResp,
  KuperOptionsResp
}