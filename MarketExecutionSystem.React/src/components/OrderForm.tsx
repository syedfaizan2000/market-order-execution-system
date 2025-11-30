import React, { useState } from 'react'
import type { OrderType } from '../types'
import { placeOrder } from '../api/client'

interface Props {
  onOrderPlaced: () => void
}

const symbols = ['PSX-OGDC', 'PSX-HBL', 'PSX-ENGRO']

export const OrderForm: React.FC<Props> = ({ onOrderPlaced }) => {
  const [symbol, setSymbol] = useState(symbols[0])
  const [orderType, setOrderType] = useState<OrderType>('Buy')
  const [quantity, setQuantity] = useState(100)
  const [price, setPrice] = useState(110)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (!quantity || quantity <= 0 || !price || price <= 0) {
        throw new Error('Quantity and price must be greater than zero.')
      }
      await placeOrder({ symbol, orderType, quantity, price })
      onOrderPlaced()
    } catch (err: any) {
      setError(err?.message ?? 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="field-row">
        <div className="field">
          <label className="label">Symbol</label>
          <select
            className="select"
            value={symbol}
            onChange={e => setSymbol(e.target.value)}
          >
            {symbols.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label className="label">Side</label>
          <select
            className="select"
            value={orderType}
            onChange={e => setOrderType(e.target.value as OrderType)}
          >
            <option value="Buy">Buy</option>
            <option value="Sell">Sell</option>
          </select>
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label className="label">Quantity</label>
          <input
            className="input"
            type="number"
            min={1}
            value={quantity}
            onChange={e => setQuantity(Number(e.target.value))}
          />
        </div>
        <div className="field">
          <label className="label">Limit Price</label>
          <input
            className="input"
            type="number"
            min={0}
            step="0.01"
            value={price}
            onChange={e => setPrice(Number(e.target.value))}
          />
        </div>
      </div>

      {error && (
        <div className="helper" style={{ color: '#fecaca', marginBottom: '0.4rem' }}>
          {error}
        </div>
      )}

      <button className="btn" type="submit" disabled={loading}>
        {loading ? 'Placing...' : 'Place Order'}
      </button>
      <div className="helper" style={{ marginTop: '0.35rem' }}>
        Orders will auto-execute when simulated market price reaches your limit.
      </div>
    </form>
  )
}