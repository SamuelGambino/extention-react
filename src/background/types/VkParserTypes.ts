interface VkCatsResp {
  id: number,
  title: string,
}

interface VkItemsResp {
  id: number,
  title: string,
  thumb_photo: string,
  description: string,
  price: {
    amount: string
  },
}

interface fullResponse {
  categories: VkCatsResp[],
  items: VkItemsResp[],
}

export type {
  VkItemsResp,
  fullResponse
}