import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../domain/types'
import { useProducts } from '../hooks/useProducts'
import { useCartStore } from '../store/cartStore'

const categories = [
  'All',
  'Vegetables',
  'Fruits',
  'Grains',
  'Dairy',
  'Spices',
  'Honey',
] as const satisfies readonly (Product['category'] | 'All')[]

export function HomePage() {
  const [q, setQ] = useState('')
  const [category, setCategory] = useState<(typeof categories)[number]>('All')
  const { products, loading, error } = useProducts({ q, category })
  const add = useCartStore((s) => s.add)

  const list = useMemo(() => products ?? [], [products])

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">
              Fresh produce, directly from farmers
            </h1>
            <p className="text-slate-600">
              Browse, order, and choose delivery or pickup. No middlemen.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/register"
              className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Create account
            </Link>
            <Link
              to="/login"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <label className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-sm font-semibold text-slate-900">Search</div>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products, categories…"
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
          />
        </label>
        <label className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-sm font-semibold text-slate-900">Category</div>
          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value as (typeof categories)[number])
            }
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-sm font-semibold text-slate-900">
            Farmer dashboard
          </div>
          <div className="mt-1 text-sm text-slate-600">
            List products, manage stock, and fulfill orders.
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-sm font-semibold text-slate-900">
            Customer checkout
          </div>
          <div className="mt-1 text-sm text-slate-600">
            Add to cart, choose delivery/pickup, pay securely.
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-sm font-semibold text-slate-900">Admin panel</div>
          <div className="mt-1 text-sm text-slate-600">
            Manage users, products, and orders centrally.
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            Categories
          </h2>
          <div className="flex flex-wrap gap-2">
            {categories
              .filter((c) => c !== 'All')
              .map((c) => (
              <span
                key={c}
                className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
        {error ? (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900">
            {error}
          </div>
        ) : null}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="animate-pulse rounded-2xl border border-slate-200 p-4"
                >
                  <div className="h-32 rounded-xl bg-slate-100" />
                  <div className="mt-3 h-4 w-2/3 rounded bg-slate-100" />
                  <div className="mt-2 h-4 w-1/2 rounded bg-slate-100" />
                  <div className="mt-4 h-9 rounded-xl bg-slate-100" />
                </div>
              ))
            : list.map((p) => (
                <div key={p.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="h-32 overflow-hidden rounded-xl bg-slate-100">
                    {p.photos[0] ? (
                      <img
                        src={p.photos[0]}
                        alt={p.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : null}
                  </div>
                  <div className="mt-3 flex items-start justify-between gap-2">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        {p.name}
                      </div>
                      <div className="text-sm text-slate-600">
                        {p.category} • Stock {p.quantityAvailable} {p.unit}
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-slate-900">
                      ₹ {p.price}
                      <span className="text-xs font-medium text-slate-500">
                        {' '}
                        / {p.unit}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Link
                      to={`/products/${p.id}`}
                      className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-center text-sm font-semibold text-slate-900 hover:bg-slate-50"
                    >
                      View
                    </Link>
                    <button
                      type="button"
                      onClick={() => add(p.id, 1)}
                      className="flex-1 rounded-xl bg-emerald-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={p.quantityAvailable <= 0}
                    >
                      {p.quantityAvailable <= 0 ? 'Out of stock' : 'Add'}
                    </button>
                  </div>
                </div>
              ))}
        </div>
      </section>
    </div>
  )
}

