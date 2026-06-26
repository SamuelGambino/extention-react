interface WhatsAppRespProducts {
  data: {
    xwa_product_catalog_get_single_collection: {
      collection: {
        products: {
          id: number,
          name: string,
          price: number,
          description: string
        }[]
      }
    }
  }
}

interface WhatsAppNomenclature {
  collections: {
    name: string,
    id: string,
    products?: {
      id: number,
      name: string,
      price: number,
      description: string
    }[]
  }[]
}

interface WhatsAppRespCategories {
  data: {
    xwa_product_catalog_get_collections: {
      collections: {
        name: string,
        id: string,
      }[]
    }
  }
}

interface WhatsAppPayloadCatalogs {
  access_token: string,
  doc_id: string,
  variables: {
    request: {
      collections: {
        biz_jid: string,
        collection_limit: string,
        item_limit: string,
        after: string,
        width: string,
        height: string,
        variant_thumbnail_height: null,
        variant_thumbnail_width: null
      }
    }
  },
  lang: "ru_US"
}

interface WhatsAppPayloadProducts {
  access_token: string,
  doc_id: string,
  variables: {
    request: {
      collection: {
        biz_jid: string,
        id: string,
        limit: string,
        width: string,
        height: string,
        variant_thumbnail_height: null,
        variant_thumbnail_width: null,
      },
    },
  },
  lang: string,
}

export type {
  WhatsAppRespCategories,
  WhatsAppRespProducts,
  WhatsAppPayloadCatalogs,
  WhatsAppPayloadProducts,
  WhatsAppNomenclature
}