import client from '@/config/api'
import type { RegisterPayload } from '@/types/Register'

export const authService = {
  async register(payload: RegisterPayload): Promise<void> {
    await client.post('/auth/register', payload)
  },

  async login(email: string, password: string): Promise<any> {
    const response = await client.post('/auth/login', { email, password })

    localStorage.setItem('accessToken', response.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.user))

    return response.data
  },

  async verifyCode(email: string, code: string): Promise<any> {
    const response = await client.post('/auth/verify', { email, code })

    localStorage.setItem('accessToken', response.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.user))

    return response.data
  },

  async resendCode(email: string): Promise<void> {
    await client.post('/auth/resend-code', email)
  },

  async logout(): Promise<void> {
    try {
      await client.post('/auth/logout')
    } finally {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('user')
    }
  },

  getCurrentUser(): any | null {
    const userRaw = localStorage.getItem('user')
    return userRaw ? JSON.parse(userRaw) : null
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken')
  },
}
