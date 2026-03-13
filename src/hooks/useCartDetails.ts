import { useEffect, useMemo, useState } from 'react'
import type { CartLine, Product } from '../domain/types'
import { api } from '../api'

export function useCartDetails(lines: CartLine[]) {
  const [productsById, setProductsById] = useState<Record<string, Product>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    const ids = Array.from(new Set(lines.map((l) => l.productId)))
    if (ids.length === 0) {
      setProductsById({})
      return
    }
    setLoading(true)
    Promise.all(ids.map((id) => api.getProduct(id).catch(() => null))).then(
      (products) => {
        if (cancelled) return
        const map: Record<string, Product> = {}
        for (const p of products) if (p) map[p.id] = p
        setProductsById(map)
        setLoading(false)
      },
    )
    return () => {
      cancelled = true
    }
  }, [lines])

  const subtotal = useMemo(() => {
    return lines.reduce((sum, l) => {
      const p = productsById[l.productId]
      if (!p) return sum
      return sum + p.price * l.quantity
    }, 0)
  }, [lines, productsById])

  return { productsById, subtotal, loading }
}

