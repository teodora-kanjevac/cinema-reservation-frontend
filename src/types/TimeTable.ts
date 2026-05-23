import type { Movie } from "./Movie"

export interface TimeTable {
  timeTableId: number
  movieId: number
  cinemaId: number
  showTime: string | Date
  hallName?: string
  movie?: Movie
}
