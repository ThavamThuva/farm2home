import { Navigate, Outlet } from 'react-router-dom'
import type { UserRole } from '../../domain/types'
import { useAuthStore } from '../../store/authStore'

export function RequireRole(props: { role: UserRole | UserRole[] }) {
  const { isAuthed, user } = useAuthStore()
  const roles = Array.isArray(props.role) ? props.role : [props.role]

  if (!isAuthed || !user) return <Navigate to="/login" replace />
  if (!roles.includes(user.role)) return <Navigate to="/" replace />
  return <Outlet />
}

