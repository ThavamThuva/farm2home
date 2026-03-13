import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api'
import type { DeliveryOption } from '../domain/types'
import { useCartDetails } from '../hooks/useCartDetails'
import { useAuthStore } from '../store/authStore'
import { useCartStore } from '../store/cartStore'

export function CheckoutPage() {
  const nav = useNavigate()
  const { isAuthed, user } = useAuthStore()
  const { lines, clear } = useCartStore()
  const { subtotal } = useCartDetails(lines)
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>('delivery')
  const [phone, setPhone] = useState('')
  const [addressOrNotes, setAddressOrNotes] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const deliveryFee = useMemo(() => {
    if (!subtotal) return 0
    return deliveryOption === 'delivery'
      ? Math.min(60, Math.round(subtotal * 0.02))
      : 0
  }, [subtotal, deliveryOption])

  const total = subtotal + deliveryFee

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h1 className="text-xl font-semibold text-slate-900">Checkout</h1>
        <p className="mt-1 text-sm text-slate-600">
          Delivery or pickup, secure payment, and order confirmation.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        {!isAuthed || user?.role !== 'customer' ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            Please{' '}
            <Link to="/login" className="font-semibold underline">
              login as a customer
            </Link>{' '}
            to place an order.
          </div>
        ) : null}

        <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
          <div className="text-slate-600">Total payable</div>
          <div className="font-semibold text-slate-900">₹ {total}</div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <div className="text-sm font-medium text-slate-900">
              Delivery option
            </div>
            <select
              value={deliveryOption}
              onChange={(e) => setDeliveryOption(e.target.value as DeliveryOption)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-200"
            >
              <option value="delivery">Delivery (fee ₹ {deliveryFee})</option>
              <option value="pickup">Pickup (free)</option>
            </select>
          </label>
          <label className="block">
            <div className="text-sm font-medium text-slate-900">Phone</div>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-200"
              placeholder="10-digit phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </label>
        </div>

        <label className="mt-4 block">
          <div className="text-sm font-medium text-slate-900">
            Address (delivery) / Pickup notes
          </div>
          <textarea
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-200"
            rows={4}
            placeholder="House, street, landmark…"
            value={addressOrNotes}
            onChange={(e) => setAddressOrNotes(e.target.value)}
          />
        </label>

        {error ? (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900">
            {error}
          </div>
        ) : null}

        <button
          type="button"
          disabled={
            loading ||
            !isAuthed ||
            user?.role !== 'customer' ||
            lines.length === 0 ||
            !phone.trim()
          }
          onClick={async () => {
            if (!user) return
            setError(null)
            setLoading(true)
            try {
              const order = await api.createOrder({
                customerId: user.id,
                cart: lines,
                deliveryOption,
                phone,
                addressOrNotes,
              })
              clear()
              nav(`/customer/orders/${order.id}`)
            } catch (e) {
              setError(e instanceof Error ? e.message : 'Checkout failed')
            } finally {
              setLoading(false)
            }
          }}
          className="mt-6 w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Processing…' : 'Pay & Place order (mock)'}
        </button>
      </div>
    </div>
  )
}

