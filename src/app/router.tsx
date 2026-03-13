import { Routes, Route } from "react-router-dom";
import { AppShell } from "./shell/AppShell";
import { RequireRole } from "./guards/RequireRole";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { ProductPage } from "../pages/ProductPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { DashboardRedirectPage } from "../pages/DashboardRedirectPage";
import { CustomerLayout } from "../pages/customer/CustomerLayout";
import { CustomerHomePage } from "../pages/customer/CustomerHomePage";
import { CustomerOrdersPage } from "../pages/customer/CustomerOrdersPage";
import { CustomerOrderDetailPage } from "../pages/customer/CustomerOrderDetailPage";
import { CustomerProfilePage } from "../pages/customer/CustomerProfilePage";
import { FarmerLayout } from "../pages/farmer/FarmerLayout";
import { FarmerHomePage } from "../pages/farmer/FarmerHomePage";
import { FarmerProductsPage } from "../pages/farmer/FarmerProductsPage";
import { FarmerOrdersPage } from "../pages/farmer/FarmerOrdersPage";
import { AdminLayout } from "../pages/admin/AdminLayout";
import { AdminHomePage } from "../pages/admin/AdminHomePage";
import { AdminUsersPage } from "../pages/admin/AdminUsersPage";
import { AdminOrdersPage } from "../pages/admin/AdminOrdersPage";

export const Router = () => (
  <Routes>
    <Route path="/" element={<AppShell />}>
      <Route index element={<HomePage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="products/:productId" element={<ProductPage />} />
      <Route path="cart" element={<CartPage />} />
      <Route path="checkout" element={<CheckoutPage />} />
      <Route path="dashboard" element={<DashboardRedirectPage />} />

      {/* Customer routes */}
      <Route path="customer" element={<RequireRole role="customer" />}>
        <Route element={<CustomerLayout />}>
          <Route index element={<CustomerHomePage />} />
          <Route path="orders" element={<CustomerOrdersPage />} />
          <Route path="orders/:orderId" element={<CustomerOrderDetailPage />} />
          <Route path="profile" element={<CustomerProfilePage />} />
        </Route>
      </Route>

      {/* Farmer routes */}
      <Route path="farmer" element={<RequireRole role="farmer" />}>
        <Route element={<FarmerLayout />}>
          <Route index element={<FarmerHomePage />} />
          <Route path="products" element={<FarmerProductsPage />} />
          <Route path="orders" element={<FarmerOrdersPage />} />
        </Route>
      </Route>

      {/* Admin routes */}
      <Route path="admin" element={<RequireRole role="admin" />}>
        <Route element={<AdminLayout />}>
          <Route index element={<AdminHomePage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Routes>
);
