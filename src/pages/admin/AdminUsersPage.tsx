import { useEffect, useState } from 'react'
import { api } from '../../api'
import type { User } from '../../domain/types'
import { useAuthStore } from '../../store/authStore'

export function AdminUsersPage() {
  const user = useAuthStore((s) => s.user)
  const [users, setUsers] = useState<User[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    if (!user) return
    api
      .adminListUsers(user.id)
      .then((u) => {
        if (!cancelled) setUsers(u)
      })
      .catch((e) => {
        if (!cancelled)
          setError(e instanceof Error ? e.message : 'Failed to load users')
      })
    return () => {
      cancelled = true
    }
  }, [user])

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h1 className="text-xl font-semibold text-slate-900">Users</h1>
        <p className="mt-1 text-sm text-slate-600">
          Farmers, customers, and admins (mock DB).
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900">
          {error}
        </div>
      ) : null}

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="overflow-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600">
                <th className="py-2 pr-3">Name</th>
                <th className="py-2 pr-3">Email</th>
                <th className="py-2 pr-3">Role</th>
                <th className="py-2 pr-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {(users ?? []).map((u) => (
                <tr key={u.id} className="border-b border-slate-100">
                  <td className="py-2 pr-3 font-semibold text-slate-900">
                    {u.name}
                  </td>
                  <td className="py-2 pr-3 text-slate-700">{u.email}</td>
                  <td className="py-2 pr-3 text-slate-700">{u.role}</td>
                  <td className="py-2 pr-3 text-slate-700">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(users ?? []).length === 0 ? (
            <div className="mt-3 text-sm text-slate-600">No users.</div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

