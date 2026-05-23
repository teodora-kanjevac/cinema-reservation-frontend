export interface Movie {
  id: string | number
  title: string
  director: Director
  actors: Actor[]
  genres: Genre[]
  poster: string
  releaseDate: Date
  description?: string
  runTime?: number
}

export interface Genre {
  id: number
  name: string
}

export interface Actor {
  id: number
  name: string
}

export interface Director {
  id: number
  name: string
}
