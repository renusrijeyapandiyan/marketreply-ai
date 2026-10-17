import { Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/layout/Navbar.jsx'
import Footer from './components/layout/Footer.jsx'
import SellerLayout from './components/layout/SellerLayout.jsx'
import ProtectedRoute from './components/auth/ProtectedRoute.jsx'
import Home from './pages/Home.jsx'
import ProductPage from './pages/ProductPage.jsx'
import Cart from './pages/Cart.jsx'
import Orders from './pages/Orders.jsx'
import AuthPage from './pages/AuthPage.jsx'
import NotFound from './pages/NotFound.jsx'
import SellerDashboard from './pages/seller/SellerDashboard.jsx'
import SellerProducts from './pages/seller/SellerProducts.jsx'
import ProductForm from './pages/seller/ProductForm.jsx'
import SellerOrders from './pages/seller/SellerOrders.jsx'
import SellerChats from './pages/seller/SellerChats.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <ScrollToTop />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/register" element={<AuthPage mode="register" />} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/seller" element={<ProtectedRoute><SellerLayout /></ProtectedRoute>}>
            <Route index element={<SellerDashboard />} />
            <Route path="products" element={<SellerProducts />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/:id/edit" element={<ProductForm />} />
            <Route path="orders" element={<SellerOrders />} />
            <Route path="chats" element={<SellerChats />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
