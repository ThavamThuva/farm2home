import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

export function FarmerHomePage() {
  const user = useAuthStore((s) => s.user)
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h1 className="text-xl font-semibold text-slate-900">
          Farmer dashboard{user ? ` — ${user.name}` : ''}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Manage your products, stock, and orders.
        </p>
        <div className="mt-4 flex gap-3">
          <Link
            to="/farmer/products"
            className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Manage products
          </Link>
          <Link
            to="/farmer/orders"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            View orders
          </Link>
        </div>
      </div>
    </div>
  )
}

