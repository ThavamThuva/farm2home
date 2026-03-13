import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export function LoginPage() {
  const nav = useNavigate()
  const login = useAuthStore((s) => s.login)
  const isAuthed = useAuthStore((s) => s.isAuthed)
  const [email, setEmail] = useState('customer1@farm2home.local')
  const [password, setPassword] = useState('customer123')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const demo = useMemo(
    () => [
      { label: 'Customer demo', email: 'customer1@farm2home.local', pw: 'customer123' },
      { label: 'Farmer demo', email: 'farmer1@farm2home.local', pw: 'farmer123' },
      { label: 'Admin demo', email: 'admin@farm2home.local', pw: 'admin123' },
    ],
    [],
  )

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h1 className="text-xl font-semibold text-slate-900">Login</h1>
        <p className="mt-1 text-sm text-slate-600">
          Sign in as a customer, farmer, or admin.
        </p>

        {isAuthed ? (
          <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-900">
            You’re already signed in.{' '}
            <button
              type="button"
              onClick={() => nav('/dashboard')}
              className="font-semibold underline"
            >
              Go to dashboard
            </button>
          </div>
        ) : null}

        <form className="mt-6 space-y-4">
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
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
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
                await login(email, password)
                nav('/dashboard')
              } catch (e) {
                setError(e instanceof Error ? e.message : 'Login failed')
              } finally {
                setLoading(false)
              }
            }}
            className="w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Login'}
          </button>
        </form>

        <div className="mt-6">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Demo accounts
          </div>
          <div className="mt-2 grid gap-2">
            {demo.map((d) => (
              <button
                type="button"
                key={d.label}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm font-semibold text-slate-900 hover:bg-slate-50"
                onClick={() => {
                  setEmail(d.email)
                  setPassword(d.pw)
                }}
              >
                {d.label}
                <span className="ml-2 text-xs font-medium text-slate-500">
                  ({d.email})
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 text-sm text-slate-600">
          New here?{' '}
          <Link className="font-semibold text-emerald-700" to="/register">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  )
}

