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
  photos?: VkPhoto[],
}

interface fullResponse {
  categories: VkCatsResp[],
  items: VkItemsResp[],
}

interface VkPhotoSize {
  type: string,
  url: string,
  width: number,
  height: number
}

interface VkPhoto {
  id: number,
  owner_id: number,
  album_id?: number,
  sizes: VkPhotoSize[],
  photo_600?: string,
  photo_800?: string,
  photo_1280?: string
}

export type {
  VkItemsResp,
  fullResponse
}