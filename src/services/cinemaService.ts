import client from '@/config/api'
import type { Cinema } from '@/types/Cinema'

export const cinemaService = {
  async getAll(): Promise<Cinema[]> {
    const response = await client.get('/cinemas')
    return response.data
  },

  async getById(cinemaId: number): Promise<Cinema> {
    const response = await client.get(`/cinemas/${cinemaId}`)
    return response.data
  },

  async create(payload: any): Promise<Cinema> {
    const response = await client.post('/cinemas/create', payload)
    return response.data
  },

  async update(cinemaId: number, payload: any): Promise<Cinema> {
    const response = await client.put(`/cinemas/edit/${cinemaId}`, payload)
    return response.data
  },

  async remove(cinemaId: number): Promise<void> {
    await client.delete(`/cinemas/${cinemaId}`)
  },
}
