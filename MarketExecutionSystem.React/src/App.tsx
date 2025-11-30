import React, { useCallback, useEffect, useState } from 'react'
import { fetchOrders, fetchTrades } from './api/client'
import type { Order, TradeLog } from './types'
import { OrderForm } from './components/OrderForm'
import { OrdersTable } from './components/OrdersTable'
import { TradesTable } from './components/TradesTable'
import { useInterval } from './hooks/useInterval'

// 🔥 NEW IMPORTS FOR LIVE FEED
import { useLivePrices } from './hooks/useLivePrices'
import { LiveTicker } from './components/LiveTicker'

const REFRESH_MS = 5000

const App: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [trades, setTrades] = useState<TradeLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 🌐 API Base URL for Live Stream
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://localhost:63415'

  // 🔥 REAL-TIME MARKET FEED
  const liveTick = useLivePrices(API_BASE)

  const loadData = useCallback(async () => {
    try {
      setError(null)
      const [o, t] = await Promise.all([fetchOrders(), fetchTrades()])
      setOrders(o)
      setTrades(t)
    } catch (err: any) {
      setError(err?.message ?? 'Failed to load data from API')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadData()
  }, [loadData])

  // Keep tables refreshing but UI moves live
  useInterval(() => {
    void loadData()
  }, REFRESH_MS)

  const handleOrderPlaced = () => {
    void loadData()
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <div className="app-title">Market Execution System</div>
          <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '0.15rem' }}>
            Real-time order routing + execution demo (.NET 8 + React)
          </div>

          {/* 🔥 LIVE PRICE FEED ON SCREEN */}
          <LiveTicker tick={liveTick} />
        </div>

        <div className="app-badge">
          <span className="chip-dot" /> Live Simulator
        </div>
      </header>

      <main className="app-main">
        <section className="card">
          <div className="card-header">
            <div>
              <div className="card-title">New Order</div>
              <div className="card-subtitle">Simulated market/limit order</div>
            </div>
            <span className="chip">
              API: <code>POST /api/orders</code>
            </span>
          </div>
          <OrderForm onOrderPlaced={handleOrderPlaced} />
        </section>

        <section className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Recent Executions</div>
              <div className="card-subtitle">Latest fills (live price driven)</div>
            </div>
            <span className="chip">
              API: <code>GET /api/trades</code>
            </span>
          </div>
          {loading && !trades.length
            ? <div className="helper">Loading trades...</div>
            : <TradesTable trades={trades} />}
        </section>

        <section className="card" style={{ gridColumn: '1 / -1' }}>
          <div className="card-header">
            <div>
              <div className="card-title">Order Book</div>
              <div className="card-subtitle">All active/filled orders</div>
            </div>
            <span className="chip">
              API: <code>GET /api/orders</code>
            </span>
          </div>
          {loading && !orders.length
            ? <div className="helper">Loading orders...</div>
            : <OrdersTable orders={orders} />}
          {error && (
            <div className="helper" style={{ color: '#fecaca', marginTop: '0.35rem' }}>
              {error}
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        <div>
          Backend: .NET 8 API & EF Core • Frontend: React + Vite + SignalR Live Feed
        </div>
        <div>
          Base URL set via <code>VITE_API_BASE_URL</code>
        </div>
      </footer>
    </div>
  )
}

export default App
