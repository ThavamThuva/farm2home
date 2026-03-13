import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from './shell/AppShell'
import { RequireRole } from './guards/RequireRole'
import { HomePage } from '../pages/HomePage'
import { LoginPage } from '../pages/LoginPage'
import { RegisterPage } from '../pages/RegisterPage'
import { ProductPage } from '../pages/ProductPage'
import { CartPage } from '../pages/CartPage'
import { CheckoutPage } from '../pages/CheckoutPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { DashboardRedirectPage } from '../pages/DashboardRedirectPage'
import { CustomerLayout } from '../pages/customer/CustomerLayout'
import { CustomerHomePage } from '../pages/customer/CustomerHomePage'
import { CustomerOrdersPage } from '../pages/customer/CustomerOrdersPage'
import { CustomerOrderDetailPage } from '../pages/customer/CustomerOrderDetailPage'
import { CustomerProfilePage } from '../pages/customer/CustomerProfilePage'
import { FarmerLayout } from '../pages/farmer/FarmerLayout'
import { FarmerHomePage } from '../pages/farmer/FarmerHomePage'
import { FarmerProductsPage } from '../pages/farmer/FarmerProductsPage'
import { FarmerOrdersPage } from '../pages/farmer/FarmerOrdersPage'
import { AdminLayout } from '../pages/admin/AdminLayout'
import { AdminHomePage } from '../pages/admin/AdminHomePage'
import { AdminUsersPage } from '../pages/admin/AdminUsersPage'
import { AdminOrdersPage } from '../pages/admin/AdminOrdersPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'products/:productId', element: <ProductPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'dashboard', element: <DashboardRedirectPage /> },
      {
        path: 'customer',
        element: <RequireRole role="customer" />,
        children: [
          {
            element: <CustomerLayout />,
            children: [
              { index: true, element: <CustomerHomePage /> },
              { path: 'orders', element: <CustomerOrdersPage /> },
              { path: 'orders/:orderId', element: <CustomerOrderDetailPage /> },
              { path: 'profile', element: <CustomerProfilePage /> },
            ],
          },
        ],
      },
      {
        path: 'farmer',
        element: <RequireRole role="farmer" />,
        children: [
          {
            element: <FarmerLayout />,
            children: [
              { index: true, element: <FarmerHomePage /> },
              { path: 'products', element: <FarmerProductsPage /> },
              { path: 'orders', element: <FarmerOrdersPage /> },
            ],
          },
        ],
      },
      {
        path: 'admin',
        element: <RequireRole role="admin" />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { index: true, element: <AdminHomePage /> },
              { path: 'users', element: <AdminUsersPage /> },
              { path: 'orders', element: <AdminOrdersPage /> },
            ],
          },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

