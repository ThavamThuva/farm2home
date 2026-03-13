import { Link } from 'react-router-dom'
import { useCartDetails } from '../hooks/useCartDetails'
import { useCartStore } from '../store/cartStore'

export function CartPage() {
  const { lines, setQuantity, remove, clear } = useCartStore()
  const { productsById, subtotal } = useCartDetails(lines)
  const deliveryFee = subtotal ? Math.min(60, Math.round(subtotal * 0.02)) : 0
  const total = subtotal + deliveryFee

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h1 className="text-xl font-semibold text-slate-900">Your cart</h1>
          {(lines ?? []).length === 0 ? (
            <>
              <p className="mt-1 text-sm text-slate-600">
                Your cart is empty. Browse the marketplace to add items.
              </p>
              <Link
                to="/"
                className="mt-4 inline-block rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Browse products
              </Link>
            </>
          ) : (
            <>
              <div className="mt-4 space-y-3">
                {lines.map((l) => {
                  const p = productsById[l.productId]
                  if (!p) return null
                  return (
                    <div
                      key={l.productId}
                      className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="size-14 overflow-hidden rounded-xl bg-slate-100">
                          {p.photos[0] ? (
                            <img
                              src={p.photos[0]}
                              alt={p.name}
                              className="h-full w-full object-cover"
                            />
                          ) : null}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-900">
                            {p.name}
                          </div>
                          <div className="text-sm text-slate-600">
                            ₹ {p.price} / {p.unit}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3 sm:justify-end">
                        <input
                          type="number"
                          min={1}
                          className="w-24 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                          value={l.quantity}
                          onChange={(e) =>
                            setQuantity(l.productId, Number(e.target.value))
                          }
                        />
                        <div className="w-28 text-right text-sm font-semibold text-slate-900">
                          ₹ {p.price * l.quantity}
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(l.productId)}
                          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
              <button
                type="button"
                onClick={clear}
                className="mt-4 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              >
                Clear cart
              </button>
            </>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-900">Subtotal</div>
          <div className="text-sm font-semibold text-slate-900">₹ {subtotal}</div>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="text-sm text-slate-600">Delivery</div>
          <div className="text-sm text-slate-600">₹ {deliveryFee}</div>
        </div>
        <div className="mt-4 border-t border-slate-200 pt-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900">Total</div>
            <div className="text-sm font-semibold text-slate-900">₹ {total}</div>
          </div>
        </div>

        <Link
          to="/checkout"
          className="mt-6 block w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Checkout
        </Link>
      </div>
    </div>
  )
}

