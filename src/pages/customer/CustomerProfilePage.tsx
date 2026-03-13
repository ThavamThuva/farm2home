import { useAuthStore } from '../../store/authStore'

export function CustomerProfilePage() {
  const user = useAuthStore((s) => s.user)
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h1 className="text-xl font-semibold text-slate-900">Profile</h1>
        <p className="mt-1 text-sm text-slate-600">
          Basic profile info (mock).
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm">
        <div className="grid gap-2">
          <div>
            <span className="text-slate-600">Name: </span>
            <span className="font-semibold text-slate-900">{user?.name}</span>
          </div>
          <div>
            <span className="text-slate-600">Email: </span>
            <span className="font-semibold text-slate-900">{user?.email}</span>
          </div>
          <div>
            <span className="text-slate-600">Role: </span>
            <span className="font-semibold text-slate-900">{user?.role}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

