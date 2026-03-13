import { useAuthStore } from '../../store/authStore'

export function AdminHomePage() {
  const user = useAuthStore((s) => s.user)
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h1 className="text-xl font-semibold text-slate-900">
          Admin panel{user ? ` — ${user.name}` : ''}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Manage users and monitor orders.
        </p>
      </div>
    </div>
  )
}

