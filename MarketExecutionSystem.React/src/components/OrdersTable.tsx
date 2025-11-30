import React from 'react'
import type { Order } from '../types'

interface Props {
  orders: Order[]
}

function statusClass (status: string): string {
  switch (status) {
    case 'Executed':
      return 'badge-status badge-executed'
    case 'Failed':
      return 'badge-status badge-failed'
    default:
      return 'badge-status badge-pending'
  }
}

export const OrdersTable: React.FC<Props> = ({ orders }) => {
  if (!orders.length) {
    return <div className="helper">No orders yet. Place a new order to see it here.</div>
  }

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Symbol</th>
            <th>Side</th>
            <th>Qty</th>
            <th>Limit</th>
            <th>Status</th>
            <th>Created (UTC)</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.orderId}>
              <td>{o.orderId}</td>
              <td>{o.symbol}</td>
              <td>{o.orderType}</td>
              <td>{o.quantity}</td>
              <td>{o.price.toFixed(2)}</td>
              <td>
                <span className={statusClass(o.status)}>
                  {o.status}
                </span>
              </td>
              <td>{new Date(o.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}