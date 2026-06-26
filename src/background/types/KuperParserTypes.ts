interface ApiProduct {
  name: string;
  description: string;
  price: number;
  volume?: string;
  volume_type?: string;
  image_urls: string[];
  canonical_url: string;
  labels?: string[];
  modifiers?: string[];
}

interface ApiCategory {
  name: string;
  products: ApiProduct[];
}

interface KuperResp {
  departments: ApiCategory[];
}

export type {
  KuperResp,
  ApiCategory,
  ApiProduct,
}