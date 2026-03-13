import { NavLink, Outlet } from 'react-router-dom'

function itemClass({ isActive }: { isActive: boolean }) {
  return isActive
    ? 'rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800'
    : 'rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50'
}

export function DashboardLayout(props: {
  title: string
  items: { to: string; label: string }[]
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-4">
      <aside className="lg:col-span-1">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="text-sm font-semibold text-slate-900">
            {props.title}
          </div>
          <nav className="mt-3 grid gap-1">
            {props.items.map((it) => (
              <NavLink key={it.to} to={it.to} className={itemClass} end={it.to.split('/').length <= 2}>
                {it.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
      <section className="lg:col-span-3">
        <Outlet />
      </section>
    </div>
  )
}

