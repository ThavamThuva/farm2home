import { useEffect, useState } from 'react'
import type { Product } from '../domain/types'
import { api } from '../api'

export function useProducts(params: {
  q?: string
  category?: Product['category'] | 'All'
  farmerId?: string
}) {
  const [products, setProducts] = useState<Product[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    api
      .listProducts(params)
      .then((p) => {
        if (!cancelled) setProducts(p)
      })
      .catch((e) => {
        if (!cancelled)
          setError(e instanceof Error ? e.message : 'Failed to load products')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.q, params.category, params.farmerId])

  return { products, error, loading }
}

