export interface User {
  userId: number
  firstName: string
  lastName: string
  email: string
  gender: 'm' | 'f'
  dateOfBirth?: Date
  verifiedAt?: Date
}

export interface UserStats {
  userId: number
  moviesWatched: number
  totalMoneySpent: number
  wishlistItemCount: number
}
