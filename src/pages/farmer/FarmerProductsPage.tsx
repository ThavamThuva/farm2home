import { useMemo, useState } from 'react'
import { api } from '../../api'
import type { Product } from '../../domain/types'
import { useProducts } from '../../hooks/useProducts'
import { useAuthStore } from '../../store/authStore'

const categories: Product['category'][] = [
  'Vegetables',
  'Fruits',
  'Grains',
  'Dairy',
  'Spices',
  'Honey',
  'Other',
]

const units: Product['unit'][] = ['kg', 'g', 'L', 'pcs']

export function FarmerProductsPage() {
  const user = useAuthStore((s) => s.user)
  const farmerId = user?.id
  const { products, loading, error } = useProducts(
    farmerId ? { farmerId } : { farmerId: 'missing' },
  )

  const list = useMemo(() => products ?? [], [products])
  const [form, setForm] = useState({
    name: '',
    category: 'Vegetables' as Product['category'],
    price: 0,
    unit: 'kg' as Product['unit'],
    quantityAvailable: 0,
    description: '',
    photo: '',
  })
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h1 className="text-xl font-semibold text-slate-900">My products</h1>
        <p className="mt-1 text-sm text-slate-600">
          Create products, update stock, and keep listings fresh.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="text-sm font-semibold text-slate-900">
          Add new product
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="block">
            <div className="text-sm font-medium text-slate-900">Name</div>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </label>
          <label className="block">
            <div className="text-sm font-medium text-slate-900">Category</div>
            <select
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
              value={form.category}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  category: e.target.value as Product['category'],
                }))
              }
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <div className="text-sm font-medium text-slate-900">Price</div>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
              type="number"
              min={0}
              value={form.price}
              onChange={(e) =>
                setForm((f) => ({ ...f, price: Number(e.target.value) }))
              }
            />
          </label>
          <label className="block">
            <div className="text-sm font-medium text-slate-900">Unit</div>
            <select
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
              value={form.unit}
              onChange={(e) =>
                setForm((f) => ({ ...f, unit: e.target.value as Product['unit'] }))
              }
            >
              {units.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <div className="text-sm font-medium text-slate-900">Stock</div>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
              type="number"
              min={0}
              value={form.quantityAvailable}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  quantityAvailable: Number(e.target.value),
                }))
              }
            />
          </label>
          <label className="block sm:col-span-2">
            <div className="text-sm font-medium text-slate-900">Photo URL</div>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
              value={form.photo}
              onChange={(e) => setForm((f) => ({ ...f, photo: e.target.value }))}
              placeholder="https://…"
            />
          </label>
          <label className="block sm:col-span-2">
            <div className="text-sm font-medium text-slate-900">Description</div>
            <textarea
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
            />
          </label>
        </div>

        {saveError ? (
          <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900">
            {saveError}
          </div>
        ) : null}

        <button
          type="button"
          disabled={saving || !farmerId || !form.name.trim()}
          onClick={async () => {
            if (!farmerId) return
            setSaveError(null)
            setSaving(true)
            try {
              await api.farmerUpsertProduct({
                farmerId,
                name: form.name,
                category: form.category,
                price: form.price,
                unit: form.unit,
                quantityAvailable: form.quantityAvailable,
                description: form.description,
                photos: form.photo ? [form.photo] : [],
              })
              setForm({
                name: '',
                category: 'Vegetables',
                price: 0,
                unit: 'kg',
                quantityAvailable: 0,
                description: '',
                photo: '',
              })
              window.location.reload()
            } catch (e) {
              setSaveError(
                e instanceof Error ? e.message : 'Failed to save product',
              )
            } finally {
              setSaving(false)
            }
          }}
          className="mt-4 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Add product'}
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="text-sm font-semibold text-slate-900">Current listings</div>
        {error ? (
          <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900">
            {error}
          </div>
        ) : null}
        {loading ? (
          <div className="mt-3 text-sm text-slate-600">Loading…</div>
        ) : (
          <div className="mt-4 space-y-3">
            {list.length === 0 ? (
              <div className="text-sm text-slate-600">
                No products yet. Add your first listing above.
              </div>
            ) : (
              list.map((p) => (
                <div
                  key={p.id}
                  className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      {p.name}
                    </div>
                    <div className="text-sm text-slate-600">
                      {p.category} • ₹ {p.price} / {p.unit}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-slate-600">Stock</div>
                    <input
                      type="number"
                      min={0}
                      className="w-28 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                      defaultValue={p.quantityAvailable}
                      onBlur={async (e) => {
                        if (!farmerId) return
                        const qty = Number(e.target.value)
                        await api.farmerUpsertProduct({
                          farmerId,
                          productId: p.id,
                          name: p.name,
                          category: p.category,
                          price: p.price,
                          unit: p.unit,
                          quantityAvailable: qty,
                          description: p.description,
                          photos: p.photos,
                        })
                        window.location.reload()
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

