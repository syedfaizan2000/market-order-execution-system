import axios from 'axios'
import type { Order, TradeLog, OrderType } from './types'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:63415'

export const api = axios.create({
  baseURL,
  timeout: 10000
})

export interface PlaceOrderPayload {
  symbol: string
  orderType: OrderType
  quantity: number
  price: number
}

export async function fetchOrders (): Promise<Order[]> {
  const res = await api.get<Order[]>('/api/orders')
  return res.data
}

export async function fetchTrades (): Promise<TradeLog[]> {
  const res = await api.get<TradeLog[]>('/api/trades')
  return res.data
}

export async function placeOrder (payload: PlaceOrderPayload): Promise<Order> {
  const res = await api.post<Order>('/api/orders', payload)
  return res.data
}