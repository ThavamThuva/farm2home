import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api'
import { useProduct } from '../hooks/useProduct'
import { useAuthStore } from '../store/authStore'
import { useCartStore } from '../store/cartStore'

export function ProductPage() {
  const { productId } = useParams()
  const { product, reviews, loading, error } = useProduct(productId)
  const add = useCartStore((s) => s.add)
  const user = useAuthStore((s) => s.user)
  const isAuthed = useAuthStore((s) => s.isAuthed)
  const [rating, setRating] = useState<1 | 2 | 3 | 4 | 5>(5)
  const [comment, setComment] = useState('')
  const [reviewError, setReviewError] = useState<string | null>(null)
  const [reviewLoading, setReviewLoading] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Product details
          </h1>
          <p className="text-sm text-slate-600">ID: {productId}</p>
        </div>
        <Link
          to="/"
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
        >
          Back
        </Link>
      </div>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {product?.photos?.[0] ? (
            <img
              src={product.photos[0]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-slate-100" />
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xl font-semibold text-slate-900">
                {loading ? 'Loading…' : product?.name ?? 'Product'}
              </div>
              <div className="mt-1 text-sm text-slate-600">
                {product ? `${product.category} • Stock ${product.quantityAvailable} ${product.unit}` : '—'}
              </div>
            </div>
            <div className="text-xl font-semibold text-slate-900">
              ₹ {product?.price ?? 0}
              {product ? (
                <span className="text-xs font-medium text-slate-500">
                  {' '}
                  / {product.unit}
                </span>
              ) : null}
            </div>
          </div>

          <div className="mt-4 text-sm text-slate-600">
            {product?.description ?? '—'}
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              disabled={!product || product.quantityAvailable <= 0}
              onClick={() => {
                if (!product) return
                add(product.id, 1)
              }}
              className="flex-1 rounded-xl bg-emerald-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Add to cart
            </button>
            <Link
              to="/checkout"
              className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-center text-sm font-semibold text-slate-900 hover:bg-slate-50"
            >
              Buy now
            </Link>
          </div>
        </div>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Reviews</h2>
        <div className="mt-3 space-y-3">
          {(reviews ?? []).length === 0 ? (
            <div className="text-sm text-slate-600">No reviews yet.</div>
          ) : (
            (reviews ?? []).map((r) => (
              <div key={r.id} className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-slate-900">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                    <span className="ml-2 text-xs font-medium text-slate-500">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-sm text-slate-700">{r.comment}</div>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 p-4">
          <div className="text-sm font-semibold text-slate-900">
            Add your review
          </div>
          {!isAuthed || user?.role !== 'customer' ? (
            <div className="mt-2 text-sm text-slate-600">
              Please <Link className="font-semibold text-emerald-700" to="/login">login</Link> as a customer to post a review.
            </div>
          ) : (
            <>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <div className="text-sm font-medium text-slate-900">
                    Rating
                  </div>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value) as typeof rating)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                  >
                    <option value={5}>5</option>
                    <option value={4}>4</option>
                    <option value={3}>3</option>
                    <option value={2}>2</option>
                    <option value={1}>1</option>
                  </select>
                </label>
                <label className="block sm:col-span-2">
                  <div className="text-sm font-medium text-slate-900">
                    Comment
                  </div>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                    rows={3}
                    placeholder="Share your experience…"
                  />
                </label>
              </div>
              {reviewError ? (
                <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900">
                  {reviewError}
                </div>
              ) : null}
              <button
                type="button"
                disabled={reviewLoading || !productId || !comment.trim()}
                onClick={async () => {
                  if (!productId || !user) return
                  setReviewError(null)
                  setReviewLoading(true)
                  try {
                    await api.addReview({
                      productId,
                      customerId: user.id,
                      rating,
                      comment,
                    })
                    setComment('')
                    // simplest refresh: hard reload product hook by re-navigating not needed; just reload page
                    window.location.reload()
                  } catch (e) {
                    setReviewError(
                      e instanceof Error ? e.message : 'Failed to submit review',
                    )
                  } finally {
                    setReviewLoading(false)
                  }
                }}
                className="mt-4 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {reviewLoading ? 'Posting…' : 'Post review'}
              </button>
            </>
          )}
        </div>
      </section>
    </div>
  )
}

