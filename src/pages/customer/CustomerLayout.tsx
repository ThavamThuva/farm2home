import { DashboardLayout } from '../../components/DashboardLayout'

export function CustomerLayout() {
  return (
    <DashboardLayout
      title="Customer"
      items={[
        { to: '/customer', label: 'Overview' },
        { to: '/customer/orders', label: 'My orders' },
        { to: '/customer/profile', label: 'Profile' },
      ]}
    />
  )
}

