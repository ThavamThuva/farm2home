import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserRole } from '../domain/types'
import { api } from '../api'

type SessionUser = {
  id: string
  role: UserRole
  name: string
  email: string
}

interface AuthState {
  token: string | null
  user: SessionUser | null
  isAuthed: boolean
  login: (email: string, password: string) => Promise<void>
  register: (input: {
    name: string
    email: string
    password: string
    role: Exclude<UserRole, 'admin'>
  }) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthed: false,
      async login(email, password) {
        const session = await api.login(email, password)
        set({ token: session.token, user: session.user, isAuthed: true })
      },
      async register(input) {
        const session = await api.register(input)
        set({ token: session.token, user: session.user, isAuthed: true })
      },
      logout() {
        const { token } = get()
        if (token) set({ token: null, user: null, isAuthed: false })
        else set({ token: null, user: null, isAuthed: false })
      },
    }),
    { name: 'farm2home.auth.v1' },
  ),
)

