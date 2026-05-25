import type { Movie } from './Movie'

export interface TimeTable {
  timeTableId: number
  movieId: number
  cinemaId: number
  showTime: string | Date
  hallName?: string
  movie?: Movie
}

export interface ScreeningSlot {
  timeTableId: number
  time: string
  type: string
  seatsLeft: number
  price: number
}

export interface CinemaScreenings {
  cinemaId: number
  name: string
  address: string
  slots: ScreeningSlot[]
}

export interface ScreeningDate {
  date: string
  label: string
  dayNum: string
  cinemas: CinemaScreenings[]
}

export interface SeatInfo {
  row: number
  col: number
  taken: boolean
  premium: boolean
}

export interface SeatMapResponse {
  timeTableId: number
  rows: number
  cols: number
  seats: SeatInfo[]
}
