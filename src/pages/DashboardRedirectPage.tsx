import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export function DashboardRedirectPage() {
  const { isAuthed, user } = useAuthStore()

  if (!isAuthed || !user) return <Navigate to="/login" replace />

  if (user.role === 'farmer') return <Navigate to="/farmer" replace />
  if (user.role === 'admin') return <Navigate to="/admin" replace />
  return <Navigate to="/customer" replace />
}

