import type { TimeTable } from './TimeTable'

export interface Invoice {
  invoiceId: number
  userId: number
  pursId: string | null
  pursTime: string | Date | null
  pursCounter: string | null
  createdAt: string | Date
  invoiceItems: InvoiceItem[]
}

export interface InvoiceItem {
  invoiceItemId: number
  invoiceId: number
  timeTableId: number
  pricePerItem: number
  count: number
  createdAt: string | Date
  updatedAt: string | Date | null
  timeTable?: TimeTable
}
