import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useCartStore } from '../../store/cartStore'

function cx({ isActive }: { isActive: boolean }) {
  return isActive
    ? 'text-emerald-700'
    : 'text-slate-600 hover:text-slate-900'
}

export function AppShell() {
  const nav = useNavigate()
  const { isAuthed, user, logout } = useAuthStore()
  const cartCount = useCartStore((s) =>
    s.lines.reduce((sum, l) => sum + l.quantity, 0),
  )

  return (
    <div className="min-h-dvh bg-slate-50">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid size-9 place-items-center rounded-xl bg-emerald-600 text-white">
              F2H
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-slate-900">
                Farm2Home
              </div>
              <div className="text-xs text-slate-500">
                Direct from farmers
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <NavLink to="/" className={cx} end>
              Marketplace
            </NavLink>
            <NavLink to="/cart" className={cx}>
              Cart{cartCount ? ` (${cartCount})` : ''}
            </NavLink>
            {!isAuthed ? (
              <NavLink to="/login" className={cx}>
                Login
              </NavLink>
            ) : (
              <>
                <NavLink to="/dashboard" className={cx}>
                  Dashboard
                </NavLink>
                <button
                  type="button"
                  onClick={() => {
                    logout()
                    nav('/')
                  }}
                  className="text-slate-600 hover:text-slate-900"
                >
                  Logout
                </button>
              </>
            )}
          </nav>

          <div className="md:hidden">
            <Link
              to="/cart"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800"
            >
              Cart{cartCount ? ` (${cartCount})` : ''}
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {isAuthed && user ? (
          <div className="mb-4 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            Signed in as <span className="font-semibold">{user.name}</span> (
            {user.role})
          </div>
        ) : null}
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} Farm2Home</div>
          <div className="flex gap-4">
            <Link to="/" className="hover:text-slate-900">
              Browse
            </Link>
            <Link to="/register" className="hover:text-slate-900">
              Become a farmer
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

