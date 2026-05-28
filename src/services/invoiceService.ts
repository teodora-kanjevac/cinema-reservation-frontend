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

  async downloadReceipt(invoiceId: number, pursId: string) {
    try {
      const response = await client.get(`/invoices/${invoiceId}/download`, {
        responseType: 'blob',
      })

      const blob = response.data
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `receipt-${pursId}.pdf`)
      document.body.appendChild(link)
      link.click()

      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Could not fetch receipt document stream downstream asset:', err)
    }
  },
}
