import { useEffect, useState } from 'react'
import type { Order } from '../domain/types'
import { api } from '../api'

export function useOrders(params: { userId: string; role: 'customer' | 'farmer' | 'admin' } | null) {
  const [orders, setOrders] = useState<Order[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    if (!params) {
      setOrders(null)
      return
    }
    setLoading(true)
    setError(null)
    api
      .listOrders(params)
      .then((o) => {
        if (!cancelled) setOrders(o)
      })
      .catch((e) => {
        if (!cancelled)
          setError(e instanceof Error ? e.message : 'Failed to load orders')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [params?.userId, params?.role])

  return { orders, error, loading }
}

