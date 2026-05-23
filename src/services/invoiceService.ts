import client from '@/config/api'
import type { Invoice, InvoiceItem } from '@/types/Invoice'

export const invoiceService = {
  async getCart(): Promise<Invoice> {
    const response = await client.get<Invoice>('/cart')
    return response.data
  },

  async addToCart(timeTableId: number, price: number, count: number): Promise<InvoiceItem> {
    const response = await client.post<InvoiceItem>('/cart/add', { timeTableId, price, count })
    return response.data
  },

  async removeFromCart(invoiceItemId: number): Promise<void> {
    await client.delete(`/cart/remove/${invoiceItemId}`)
  },

  async checkout(paymentDetails: { pursId: string; pursCounter: string }): Promise<void> {
    await client.post('/cart/checkout', paymentDetails)
  },
}
