import type { Movie } from './Movie'

export interface Wishlist {
  wishlistId: number
  userId: number
  createdAt: Date
  items: WishlistItem[]
}

export interface WishlistItem {
  wishlistItemId: number
  wishlistId: number
  movieId: number
  createdAt: Date
  movie?: Movie
}
