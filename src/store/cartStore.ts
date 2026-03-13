import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartLine, ID } from '../domain/types'

interface CartState {
  lines: CartLine[]
  add: (productId: ID, quantity?: number) => void
  remove: (productId: ID) => void
  setQuantity: (productId: ID, quantity: number) => void
  clear: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      add(productId, quantity = 1) {
        const lines = [...get().lines]
        const idx = lines.findIndex((l) => l.productId === productId)
        if (idx >= 0) {
          lines[idx] = { productId, quantity: lines[idx]!.quantity + quantity }
        } else {
          lines.push({ productId, quantity })
        }
        set({ lines })
      },
      remove(productId) {
        set({ lines: get().lines.filter((l) => l.productId !== productId) })
      },
      setQuantity(productId, quantity) {
        const q = Math.max(1, Math.floor(quantity || 1))
        set({
          lines: get().lines.map((l) =>
            l.productId === productId ? { ...l, quantity: q } : l,
          ),
        })
      },
      clear() {
        set({ lines: [] })
      },
    }),
    { name: 'farm2home.cart.v1' },
  ),
)

