import type { TimeTable } from './TimeTable'

export interface Cinema {
  cinemaId: number
  name: string
  address: string
  createdAt: Date
  updatedAt?: Date
  timeTables: TimeTable[]
}
