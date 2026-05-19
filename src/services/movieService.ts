import client from '@/config/api'
import type { Genre, Movie } from '@/types/Movie'

export const movieService = {
  async getAllMovies(): Promise<Movie[]> {
    const response = await client.get<Movie[]>('/movies')
    return response.data
  },

  async getMovieById(id: string | number): Promise<Movie> {
    const response = await client.get<Movie>(`/movies/${id}`)
    return response.data
  },

  async getGenres(): Promise<Genre[]> {
    const response = await client.get<Genre[]>('/movies/genres')
    return response.data
  },
}
