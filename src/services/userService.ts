import client from '@/config/api'
import type { User } from '@/types/User'

export const userService = {
  async getUserInfo(): Promise<User> {
    const response = await client.get<User>('/users/info')
    return response.data
  },

  async editUser(user: any): Promise<User> {
    const response = await client.put<User>('/users/info', user)
    return response.data
  },

  async changePassword(oldPass: string, newPass: string): Promise<void> {
    await client.put('/users/password', { oldPassword: oldPass, newPassword: newPass })
  },
}
