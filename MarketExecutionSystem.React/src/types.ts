export type OrderStatus = 'Pending' | 'Executed' | 'Failed'

export type OrderType = 'Buy' | 'Sell'

export interface Order {
  orderId: number
  symbol: string
  orderType: OrderType
  quantity: number
  price: number
  status: OrderStatus
  createdAt: string
}

export interface TradeLog {
  tradeId: number
  orderId: number
  symbol: string
  executedPrice: number
  quantity: number
  timeExecuted: string
}