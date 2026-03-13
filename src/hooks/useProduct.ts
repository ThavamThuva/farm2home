import { useEffect, useState } from 'react'
import type { Product, Review } from '../domain/types'
import { api } from '../api'

export function useProduct(productId: string | undefined) {
  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    if (!productId) {
      setProduct(null)
      setReviews(null)
      return
    }
    setLoading(true)
    setError(null)
    Promise.all([api.getProduct(productId), api.listReviews(productId)])
      .then(([p, r]) => {
        if (cancelled) return
        setProduct(p)
        setReviews(r)
      })
      .catch((e) => {
        if (!cancelled)
          setError(e instanceof Error ? e.message : 'Failed to load product')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [productId])

  return { product, reviews, error, loading }
}

