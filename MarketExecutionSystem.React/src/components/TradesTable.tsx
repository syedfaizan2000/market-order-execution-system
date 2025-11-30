import React from 'react'
import type { TradeLog } from '../types'

interface Props {
  trades: TradeLog[]
}

export const TradesTable: React.FC<Props> = ({ trades }) => {
  if (!trades.length) {
    return <div className="helper">No executions yet. Once prices hit, fills will appear here.</div>
  }

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>Trade #</th>
            <th>Order #</th>
            <th>Symbol</th>
            <th>Exec Price</th>
            <th>Qty</th>
            <th>Time (UTC)</th>
          </tr>
        </thead>
        <tbody>
          {trades.map(t => (
            <tr key={t.tradeId}>
              <td>{t.tradeId}</td>
              <td>{t.orderId}</td>
              <td>{t.symbol}</td>
              <td>{t.executedPrice.toFixed(2)}</td>
              <td>{t.quantity}</td>
              <td>{new Date(t.timeExecuted).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}