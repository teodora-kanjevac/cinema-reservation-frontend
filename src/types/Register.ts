export interface RegisterPayload {
  firstName: string
  lastName: string
  email: string
  gender: 'm' | 'f'
  password?: string
}
