import type { Order, Product, Review, User } from '../domain/types'
import { uid } from '../lib/id'
import { loadJson, saveJson } from '../lib/storage'

const LS_KEY = 'farm2home.mockdb.v1'

export interface MockDb {
  users: User[]
  products: Product[]
  orders: Order[]
  reviews: Review[]
}

function nowIso() {
  return new Date().toISOString()
}

function seed(): MockDb {
  const createdAt = nowIso()

  const admin: User = {
    id: 'u_admin',
    role: 'admin',
    name: 'Admin',
    email: 'admin@farm2home.local',
    password: 'admin123',
    createdAt,
  }

  const farmer1: User = {
    id: 'u_farmer_1',
    role: 'farmer',
    name: 'Suresh (Green Valley Farms)',
    email: 'farmer1@farm2home.local',
    password: 'farmer123',
    createdAt,
  }

  const farmer2: User = {
    id: 'u_farmer_2',
    role: 'farmer',
    name: 'Meena (Sunrise Dairy)',
    email: 'farmer2@farm2home.local',
    password: 'farmer123',
    createdAt,
  }

  const customer1: User = {
    id: 'u_customer_1',
    role: 'customer',
    name: 'Priya',
    email: 'customer1@farm2home.local',
    password: 'customer123',
    createdAt,
  }

  const baseProducts: Omit<Product, 'id'>[] = [
    {
      farmerId: farmer1.id,
      name: 'Tomato (Fresh)',
      category: 'Vegetables',
      price: 32,
      unit: 'kg',
      quantityAvailable: 120,
      description:
        'Naturally grown tomatoes harvested this morning. Great for curries, salads, and chutneys.',
      photos: [
        'https://images.unsplash.com/photo-1546470427-e1b7f5c0b6ab?auto=format&fit=crop&w=1200&q=80',
      ],
      createdAt,
      updatedAt: createdAt,
    },
    {
      farmerId: farmer1.id,
      name: 'Banana (Yelakki)',
      category: 'Fruits',
      price: 68,
      unit: 'kg',
      quantityAvailable: 60,
      description:
        'Small, sweet, aromatic bananas. Perfect for snacks and smoothies.',
      photos: [
        'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=1200&q=80',
      ],
      createdAt,
      updatedAt: createdAt,
    },
    {
      farmerId: farmer1.id,
      name: 'Basmati Rice',
      category: 'Grains',
      price: 98,
      unit: 'kg',
      quantityAvailable: 200,
      description: 'Long-grain aromatic basmati rice. Cleaned and packed.',
      photos: [
        'https://images.unsplash.com/photo-1604909053261-4f9c7f1c2e88?auto=format&fit=crop&w=1200&q=80',
      ],
      createdAt,
      updatedAt: createdAt,
    },
    {
      farmerId: farmer2.id,
      name: 'Cow Milk (A2)',
      category: 'Dairy',
      price: 62,
      unit: 'L',
      quantityAvailable: 80,
      description:
        'Fresh A2 cow milk. Hygienically packed. Same-day delivery available.',
      photos: [
        'https://images.unsplash.com/photo-1585238342028-4ae1b3ee1236?auto=format&fit=crop&w=1200&q=80',
      ],
      createdAt,
      updatedAt: createdAt,
    },
    {
      farmerId: farmer2.id,
      name: 'Ghee (Homemade)',
      category: 'Dairy',
      price: 680,
      unit: 'pcs',
      quantityAvailable: 25,
      description:
        'Traditional homemade ghee. Rich aroma and flavor. Jar (500ml).',
      photos: [
        'https://images.unsplash.com/photo-1625944525527-2a6b1e7f7d58?auto=format&fit=crop&w=1200&q=80',
      ],
      createdAt,
      updatedAt: createdAt,
    },
    {
      farmerId: farmer1.id,
      name: 'Turmeric Powder',
      category: 'Spices',
      price: 180,
      unit: 'pcs',
      quantityAvailable: 40,
      description: 'Stone-ground turmeric powder. Pack (250g).',
      photos: [
        'https://images.unsplash.com/photo-1615484477778-ca3b77940c25?auto=format&fit=crop&w=1200&q=80',
      ],
      createdAt,
      updatedAt: createdAt,
    },
    {
      farmerId: farmer2.id,
      name: 'Wildflower Honey',
      category: 'Honey',
      price: 420,
      unit: 'pcs',
      quantityAvailable: 30,
      description: 'Raw, unfiltered honey sourced from wildflower nectar. 500g.',
      photos: [
        'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=1200&q=80',
      ],
      createdAt,
      updatedAt: createdAt,
    },
  ]

  const products: Product[] = baseProducts.map((p) => ({ ...p, id: uid('p') }))

  const reviews: Review[] = [
    {
      id: uid('r'),
      productId: products[0]!.id,
      customerId: customer1.id,
      rating: 5,
      comment: 'Very fresh and tasty. Will buy again.',
      createdAt,
    },
    {
      id: uid('r'),
      productId: products[3]!.id,
      customerId: customer1.id,
      rating: 4,
      comment: 'Good quality milk. Delivered on time.',
      createdAt,
    },
  ]

  return {
    users: [admin, farmer1, farmer2, customer1],
    products,
    orders: [],
    reviews,
  }
}

export function getDb(): MockDb {
  const existing = loadJson<MockDb>(LS_KEY)
  if (existing) return existing
  const seeded = seed()
  saveJson(LS_KEY, seeded)
  return seeded
}

export function setDb(db: MockDb) {
  saveJson(LS_KEY, db)
}

