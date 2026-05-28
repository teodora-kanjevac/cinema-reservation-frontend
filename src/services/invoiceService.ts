import client from '@/config/api'
import type { Invoice, InvoiceItem } from '@/types/Invoice'

export const invoiceService = {
  async getCart(): Promise<Invoice> {
    const response = await client.get<Invoice>('/invoices/cart')
    return response.data
  },

  async getItemCountInCart(): Promise<number> {
    const response = await client.get<number>('/invoices/cart/count')
    return response.data
  },

  async addToCart(timeTableId: number, seats: any): Promise<InvoiceItem> {
    const response = await client.post<InvoiceItem>('/invoices/cart/add', { timeTableId, seats })
    return response.data
  },

  async removeFromCart(invoiceItemId: number): Promise<void> {
    await client.delete(`/invoices/cart/remove/${invoiceItemId}`)
  },

  async removeAllFromCart(): Promise<void> {
    await client.delete(`/invoices/cart/remove/all`)
  },

  async checkout(paymentDetails: { purchaseId: string; counterName: string }): Promise<void> {
    await client.post('/invoices/checkout', paymentDetails)
  },

  async getUserBookings(): Promise<Invoice[]> {
    const response = await client.get<Invoice[]>('/invoices/bookings')
    return response.data
  },
}
