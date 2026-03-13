import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { UserRole } from '../domain/types'
import { useAuthStore } from '../store/authStore'

export function RegisterPage() {
  const nav = useNavigate()
  const register = useAuthStore((s) => s.register)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Exclude<UserRole, 'admin'>>('customer')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h1 className="text-xl font-semibold text-slate-900">Create account</h1>
        <p className="mt-1 text-sm text-slate-600">
          Register as a customer or farmer (admin is created by the system).
        </p>

        <form className="mt-6 space-y-4">
          <label className="block">
            <div className="text-sm font-medium text-slate-900">Full name</div>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-200"
              placeholder="Your name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <label className="block">
            <div className="text-sm font-medium text-slate-900">Email</div>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-200"
              placeholder="you@example.com"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="block">
            <div className="text-sm font-medium text-slate-900">Password</div>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-200"
              placeholder="••••••••"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <label className="block">
            <div className="text-sm font-medium text-slate-900">Role</div>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as typeof role)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-200"
            >
              <option value="customer">Customer</option>
              <option value="farmer">Farmer</option>
            </select>
          </label>

          {error ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900">
              {error}
            </div>
          ) : null}

          <button
            type="button"
            disabled={loading}
            onClick={async () => {
              setError(null)
              setLoading(true)
              try {
                await register({ name, email, password, role })
                nav('/dashboard')
              } catch (e) {
                setError(e instanceof Error ? e.message : 'Registration failed')
              } finally {
                setLoading(false)
              }
            }}
            className="w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Creating…' : 'Create account'}
          </button>
        </form>

        <div className="mt-6 text-sm text-slate-600">
          Already have an account?{' '}
          <Link className="font-semibold text-emerald-700" to="/login">
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}

