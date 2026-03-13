import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useOrders } from '../../hooks/useOrders'
import { useAuthStore } from '../../store/authStore'

export function CustomerOrderDetailPage() {
  const { orderId } = useParams()
  const user = useAuthStore((s) => s.user)
  const { orders } = useOrders(user ? { userId: user.id, role: 'customer' } : null)

  const order = useMemo(() => {
    return (orders ?? []).find((o) => o.id === orderId) ?? null
  }, [orders, orderId])

  if (!order) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="text-sm text-slate-600">Order not found.</div>
        <Link
          to="/customer/orders"
          className="mt-3 inline-block rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
        >
          Back
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              Order {order.id}
            </h1>
            <div className="mt-1 text-sm text-slate-600">
              Status: <span className="font-semibold">{order.status}</span>
            </div>
          </div>
          <Link
            to="/customer/orders"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            Back
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="text-sm font-semibold text-slate-900">Items</div>
        <div className="mt-3 space-y-2">
          {order.lines.map((l) => (
            <div
              key={l.productId}
              className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-sm"
            >
              <div className="text-slate-900">
                <span className="font-semibold">{l.productName}</span> × {l.quantity}
              </div>
              <div className="font-semibold text-slate-900">₹ {l.lineTotal}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 border-t border-slate-200 pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600">Subtotal</span>
            <span className="font-semibold text-slate-900">₹ {order.subtotal}</span>
          </div>
          <div className="mt-1 flex justify-between">
            <span className="text-slate-600">Delivery</span>
            <span className="font-semibold text-slate-900">₹ {order.deliveryFee}</span>
          </div>
          <div className="mt-2 flex justify-between text-base">
            <span className="font-semibold text-slate-900">Total</span>
            <span className="font-semibold text-slate-900">₹ {order.total}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

