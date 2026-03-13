import { Link } from 'react-router-dom'
import { useOrders } from '../../hooks/useOrders'
import { useAuthStore } from '../../store/authStore'

export function CustomerOrdersPage() {
  const user = useAuthStore((s) => s.user)
  const { orders, loading, error } = useOrders(
    user ? { userId: user.id, role: 'customer' } : null,
  )

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h1 className="text-xl font-semibold text-slate-900">My orders</h1>
        <p className="mt-1 text-sm text-slate-600">
          Track status and view order details.
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900">
          {error}
        </div>
      ) : null}

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        {loading ? (
          <div className="text-sm text-slate-600">Loading…</div>
        ) : (orders ?? []).length === 0 ? (
          <div className="text-sm text-slate-600">
            No orders yet.{' '}
            <Link className="font-semibold text-emerald-700" to="/">
              Browse products
            </Link>
            .
          </div>
        ) : (
          <div className="space-y-3">
            {(orders ?? []).map((o) => (
              <Link
                key={o.id}
                to={`/customer/orders/${o.id}`}
                className="block rounded-2xl border border-slate-200 p-4 hover:bg-slate-50"
              >
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm font-semibold text-slate-900">
                    Order {o.id}
                  </div>
                  <div className="text-sm font-semibold text-slate-900">
                    ₹ {o.total}
                  </div>
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  Status: {o.status} • {new Date(o.createdAt).toLocaleString()}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

