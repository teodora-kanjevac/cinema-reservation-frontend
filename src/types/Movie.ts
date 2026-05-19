export interface Movie {
  id: string | number
  title: string
  director: string
  genres: Genre[]
  poster: string
  releaseDate: Date
  rating: number
  description?: string
  duration?: number
}

export interface Genre {
  id: number
  name: string
}
