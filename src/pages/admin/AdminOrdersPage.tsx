import { api } from '../../api'
import type { OrderStatus } from '../../domain/types'
import { useOrders } from '../../hooks/useOrders'
import { useAuthStore } from '../../store/authStore'

const statuses: OrderStatus[] = [
  'paid',
  'confirmed',
  'packed',
  'shipped',
  'ready_for_pickup',
  'delivered',
  'cancelled',
]

export function AdminOrdersPage() {
  const user = useAuthStore((s) => s.user)
  const { orders, loading, error } = useOrders(
    user ? { userId: user.id, role: 'admin' } : null,
  )

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h1 className="text-xl font-semibold text-slate-900">Orders</h1>
        <p className="mt-1 text-sm text-slate-600">
          All orders in the system (mock DB).
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
          <div className="text-sm text-slate-600">No orders yet.</div>
        ) : (
          <div className="space-y-3">
            {(orders ?? []).map((o) => (
              <div key={o.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      Order {o.id}
                    </div>
                    <div className="text-sm text-slate-600">
                      Customer: {o.customerId} • {new Date(o.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      defaultValue={o.status}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                      onChange={async (e) => {
                        if (!user) return
                        const status = e.target.value as OrderStatus
                        await api.updateOrderStatus({
                          actorId: user.id,
                          orderId: o.id,
                          status,
                        })
                        window.location.reload()
                      }}
                    >
                      <option value={o.status}>{o.status}</option>
                      {statuses
                        .filter((s) => s !== o.status)
                        .map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                    </select>
                    <div className="rounded-xl bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-900">
                      ₹ {o.total}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

