import { DashboardLayout } from '../../components/DashboardLayout'

export function AdminLayout() {
  return (
    <DashboardLayout
      title="Admin"
      items={[
        { to: '/admin', label: 'Overview' },
        { to: '/admin/users', label: 'Users' },
        { to: '/admin/orders', label: 'Orders' },
      ]}
    />
  )
}

