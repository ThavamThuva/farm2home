import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

export function CustomerHomePage() {
  const user = useAuthStore((s) => s.user)
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h1 className="text-xl font-semibold text-slate-900">
          Welcome{user ? `, ${user.name}` : ''}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          View your orders, manage your profile, and keep shopping.
        </p>
        <div className="mt-4 flex gap-3">
          <Link
            to="/"
            className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Browse marketplace
          </Link>
          <Link
            to="/customer/orders"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            My orders
          </Link>
        </div>
      </div>
    </div>
  )
}

