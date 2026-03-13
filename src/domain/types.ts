export type UserRole = 'customer' | 'farmer' | 'admin'

export type DeliveryOption = 'delivery' | 'pickup'

export type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'confirmed'
  | 'packed'
  | 'shipped'
  | 'ready_for_pickup'
  | 'delivered'
  | 'cancelled'

export type ID = string

export interface User {
  id: ID
  role: UserRole
  name: string
  email: string
  password: string
  createdAt: string
}

export interface Product {
  id: ID
  farmerId: ID
  name: string
  category:
    | 'Vegetables'
    | 'Fruits'
    | 'Grains'
    | 'Dairy'
    | 'Spices'
    | 'Honey'
    | 'Other'
  price: number
  unit: 'kg' | 'g' | 'L' | 'pcs'
  quantityAvailable: number
  description: string
  photos: string[]
  createdAt: string
  updatedAt: string
}

export interface Review {
  id: ID
  productId: ID
  customerId: ID
  rating: 1 | 2 | 3 | 4 | 5
  comment: string
  createdAt: string
}

export interface CartLine {
  productId: ID
  quantity: number
}

export interface OrderLine {
  productId: ID
  productName: string
  unitPrice: number
  quantity: number
  lineTotal: number
  farmerId: ID
}

export interface Order {
  id: ID
  customerId: ID
  status: OrderStatus
  deliveryOption: DeliveryOption
  phone: string
  addressOrNotes: string
  lines: OrderLine[]
  subtotal: number
  deliveryFee: number
  total: number
  createdAt: string
  updatedAt: string
}

