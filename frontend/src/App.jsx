import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

import { CustomerHome } from './pages/CustomerHome';
import { ShopPage } from './pages/ShopPage';
import { Cart } from './pages/Cart';
import { OrderConfirmation } from './pages/OrderConfirmation';
import { OrderHistory } from './pages/OrderHistory';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { OwnerDashboard } from './pages/OwnerDashboard';
import { OwnerInventory } from './pages/OwnerInventory';
import { OwnerOrders } from './pages/OwnerOrders';
import { NotFound } from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen bg-background">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public / Customer Routes */}
                <Route path="/" element={<CustomerHome />} />
                <Route path="/shop/:id" element={<ShopPage />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/order/:id/confirmation" element={<OrderConfirmation />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Customer Routes */}
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute allowedRoles={['customer', 'shop_owner']}>
                      <OrderHistory />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Shop Owner Routes */}
                <Route
                  path="/owner/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['shop_owner']}>
                      <OwnerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/owner/inventory"
                  element={
                    <ProtectedRoute allowedRoles={['shop_owner']}>
                      <OwnerInventory />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/owner/orders"
                  element={
                    <ProtectedRoute allowedRoles={['shop_owner']}>
                      <OwnerOrders />
                    </ProtectedRoute>
                  }
                />

                {/* 404 Multiverse */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

