import { DashboardLayout } from '../../components/DashboardLayout'

export function FarmerLayout() {
  return (
    <DashboardLayout
      title="Farmer"
      items={[
        { to: '/farmer', label: 'Overview' },
        { to: '/farmer/products', label: 'My products' },
        { to: '/farmer/orders', label: 'Orders' },
      ]}
    />
  )
}

