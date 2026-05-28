export interface User {
  userId: number
  firstName: string
  lastName: string
  email: string
  gender: 'm' | 'f'
  dateOfBirth?: Date
  verifiedAt?: Date
}
