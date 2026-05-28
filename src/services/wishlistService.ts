import client from '@/config/api'
import type { Wishlist } from '@/types/Wishlist'

export const wishlistService = {
  async getWishlist(): Promise<Wishlist> {
    const response = await client.get<Wishlist>('/wishlists')
    return response.data
  },

  async addItem(movieId: number): Promise<void> {
    await client.post('/wishlists/add', { movieId })
  },

  async removeItem(movieId: number): Promise<void> {
    await client.delete(`/wishlists/${movieId}`)
  },
}
