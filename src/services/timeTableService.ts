import client from '@/config/api'
import type { ScreeningDate, SeatMapResponse } from '@/types/TimeTable'

export const timeTableService = {
  async getScreeningsForMovie(movieId: number | string): Promise<ScreeningDate[]> {
    const response = await client.get(`/time-tables/movie/${movieId}/screenings`)
    return response.data
  },

  async getSeatMap(timeTableId: number): Promise<SeatMapResponse> {
    const response = await client.get(`/time-tables/${timeTableId}/seats`)
    return response.data
  },
}
