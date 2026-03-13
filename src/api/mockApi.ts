import type {
  CartLine,
  DeliveryOption,
  ID,
  Order,
  OrderStatus,
  Product,
  Review,
  User,
  UserRole,
} from '../domain/types'
import { uid } from '../lib/id'
import { getDb, setDb } from './mockDb'

function nowIso() {
  return new Date().toISOString()
}

function delay(ms = 200) {
  return new Promise((r) => setTimeout(r, ms))
}

function requireUser(id: ID): User {
  const db = getDb()
  const user = db.users.find((u) => u.id === id)
  if (!user) throw new Error('User not found')
  return user
}

export interface Session {
  token: string
  user: Pick<User, 'id' | 'role' | 'name' | 'email'>
}

export async function login(email: string, password: string): Promise<Session> {
  await delay()
  const db = getDb()
  const user = db.users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
  )
  if (!user) throw new Error('Invalid email or password')
  return {
    token: uid('token'),
    user: { id: user.id, role: user.role, name: user.name, email: user.email },
  }
}

export async function register(input: {
  name: string
  email: string
  password: string
  role: Exclude<UserRole, 'admin'>
}): Promise<Session> {
  await delay()
  const db = getDb()
  const email = input.email.toLowerCase().trim()
  if (db.users.some((u) => u.email.toLowerCase() === email))
    throw new Error('Email already registered')

  const user: User = {
    id: uid('u'),
    role: input.role,
    name: input.name.trim(),
    email,
    password: input.password,
    createdAt: nowIso(),
  }
  db.users.unshift(user)
  setDb(db)
  return {
    token: uid('token'),
    user: { id: user.id, role: user.role, name: user.name, email: user.email },
  }
}

export async function listProducts(params?: {
  q?: string
  category?: Product['category'] | 'All'
  farmerId?: ID
}): Promise<Product[]> {
  await delay()
  const db = getDb()
  const q = params?.q?.toLowerCase().trim()
  const category = params?.category && params.category !== 'All' ? params.category : undefined

  return db.products
    .filter((p) => (!params?.farmerId ? true : p.farmerId === params.farmerId))
    .filter((p) => (!category ? true : p.category === category))
    .filter((p) => {
      if (!q) return true
      return (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      )
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function getProduct(productId: ID): Promise<Product> {
  await delay()
  const db = getDb()
  const p = db.products.find((x) => x.id === productId)
  if (!p) throw new Error('Product not found')
  return p
}

export async function listReviews(productId: ID): Promise<Review[]> {
  await delay()
  const db = getDb()
  return db.reviews
    .filter((r) => r.productId === productId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function addReview(input: {
  productId: ID
  customerId: ID
  rating: 1 | 2 | 3 | 4 | 5
  comment: string
}): Promise<Review> {
  await delay()
  requireUser(input.customerId)
  await getProduct(input.productId)

  const db = getDb()
  const review: Review = {
    id: uid('r'),
    productId: input.productId,
    customerId: input.customerId,
    rating: input.rating,
    comment: input.comment.trim(),
    createdAt: nowIso(),
  }
  db.reviews.unshift(review)
  setDb(db)
  return review
}

export async function farmerUpsertProduct(input: {
  farmerId: ID
  productId?: ID
  name: string
  category: Product['category']
  price: number
  unit: Product['unit']
  quantityAvailable: number
  description: string
  photos: string[]
}): Promise<Product> {
  await delay()
  const farmer = requireUser(input.farmerId)
  if (farmer.role !== 'farmer') throw new Error('Only farmers can manage products')

  const db = getDb()
  const ts = nowIso()

  if (!input.productId) {
    const p: Product = {
      id: uid('p'),
      farmerId: input.farmerId,
      name: input.name.trim(),
      category: input.category,
      price: input.price,
      unit: input.unit,
      quantityAvailable: input.quantityAvailable,
      description: input.description.trim(),
      photos: input.photos.filter(Boolean),
      createdAt: ts,
      updatedAt: ts,
    }
    db.products.unshift(p)
    setDb(db)
    return p
  }

  const idx = db.products.findIndex((p) => p.id === input.productId)
  if (idx < 0) throw new Error('Product not found')
  const existing = db.products[idx]!
  if (existing.farmerId !== input.farmerId) throw new Error('Not allowed')

  const updated: Product = {
    ...existing,
    name: input.name.trim(),
    category: input.category,
    price: input.price,
    unit: input.unit,
    quantityAvailable: input.quantityAvailable,
    description: input.description.trim(),
    photos: input.photos.filter(Boolean),
    updatedAt: ts,
  }
  db.products[idx] = updated
  setDb(db)
  return updated
}

export async function createOrder(input: {
  customerId: ID
  cart: CartLine[]
  deliveryOption: DeliveryOption
  phone: string
  addressOrNotes: string
}): Promise<Order> {
  await delay()
  const customer = requireUser(input.customerId)
  if (customer.role !== 'customer') throw new Error('Only customers can place orders')

  const db = getDb()
  const ts = nowIso()

  const lines = input.cart
    .map((line) => {
      const p = db.products.find((x) => x.id === line.productId)
      if (!p) return null
      const qty = Math.max(1, Math.min(line.quantity, p.quantityAvailable))
      const lineTotal = p.price * qty
      return {
        productId: p.id,
        productName: p.name,
        unitPrice: p.price,
        quantity: qty,
        lineTotal,
        farmerId: p.farmerId,
      }
    })
    .filter(Boolean) as Order['lines']

  if (lines.length === 0) throw new Error('Cart is empty')

  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0)
  const deliveryFee = input.deliveryOption === 'delivery' ? Math.min(60, Math.round(subtotal * 0.02)) : 0
  const total = subtotal + deliveryFee

  // reduce stock
  for (const l of lines) {
    const p = db.products.find((x) => x.id === l.productId)
    if (!p) continue
    p.quantityAvailable = Math.max(0, p.quantityAvailable - l.quantity)
    p.updatedAt = ts
  }

  const order: Order = {
    id: uid('o'),
    customerId: input.customerId,
    status: 'paid',
    deliveryOption: input.deliveryOption,
    phone: input.phone.trim(),
    addressOrNotes: input.addressOrNotes.trim(),
    lines,
    subtotal,
    deliveryFee,
    total,
    createdAt: ts,
    updatedAt: ts,
  }

  db.orders.unshift(order)
  setDb(db)
  return order
}

export async function listOrders(params: {
  userId: ID
  role: UserRole
}): Promise<Order[]> {
  await delay()
  const db = getDb()
  if (params.role === 'admin') return db.orders
  if (params.role === 'customer')
    return db.orders.filter((o) => o.customerId === params.userId)
  // farmer: any order containing their products
  return db.orders.filter((o) => o.lines.some((l) => l.farmerId === params.userId))
}

export async function updateOrderStatus(input: {
  actorId: ID
  status: OrderStatus
  orderId: ID
}): Promise<Order> {
  await delay()
  const actor = requireUser(input.actorId)
  const db = getDb()
  const idx = db.orders.findIndex((o) => o.id === input.orderId)
  if (idx < 0) throw new Error('Order not found')
  const order = db.orders[idx]!

  const can =
    actor.role === 'admin' ||
    (actor.role === 'farmer' && order.lines.some((l) => l.farmerId === actor.id))
  if (!can) throw new Error('Not allowed')

  const updated: Order = { ...order, status: input.status, updatedAt: nowIso() }
  db.orders[idx] = updated
  setDb(db)
  return updated
}

export async function adminListUsers(adminId: ID): Promise<User[]> {
  await delay()
  const admin = requireUser(adminId)
  if (admin.role !== 'admin') throw new Error('Not allowed')
  const db = getDb()
  return db.users
}

