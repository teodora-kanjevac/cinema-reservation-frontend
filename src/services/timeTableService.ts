import client from '@/config/api'
import type { ScreeningDate, SeatMapResponse, TimeTable } from '@/types/TimeTable'

export const timeTableService = {
  async getScreeningsForMovie(movieId: number | string): Promise<ScreeningDate[]> {
    const response = await client.get(`/time-tables/movie/${movieId}/screenings`)
    return response.data
  },

  async getSeatMap(timeTableId: number): Promise<SeatMapResponse> {
    const response = await client.get(`/time-tables/${timeTableId}/seats`)
    return response.data
  },

  async getAvailable(): Promise<TimeTable[]> {
    const response = await client.get('/time-tables/available')
    return response.data
  },

  async getAll(): Promise<TimeTable[]> {
    const response = await client.get('/time-tables')
    return response.data
  },

  async getById(timeTableId: number): Promise<TimeTable> {
    const response = await client.get(`/time-tables/${timeTableId}`)
    return response.data
  },

  async create(payload: any): Promise<TimeTable> {
    const response = await client.post('/time-tables/create', payload)
    return response.data
  },

  async update(timeTableId: number, payload: any): Promise<TimeTable> {
    const response = await client.put(`/time-tables/edit/${timeTableId}`, payload)
    return response.data
  },

  async remove(timeTableId: number): Promise<void> {
    await client.delete(`/time-tables/${timeTableId}`)
  },
}
