import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home.jsx'
import Login from '../pages/Login.jsx'
import Register from '../pages/Register.jsx'
import Dashboard from '../pages/Dashboard.jsx'
import SellerSettings from '../pages/SellerSettings.jsx'
import BuyerAnalyzer from '../pages/BuyerAnalyzer.jsx'
import ConversationHistory from '../pages/ConversationHistory.jsx'
import Analytics from '../pages/Analytics.jsx'
import NotFound from '../pages/NotFound.jsx'
import ProtectedRoute from '../components/auth/ProtectedRoute.jsx'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/seller-settings" element={<ProtectedRoute><SellerSettings /></ProtectedRoute>} />
      <Route path="/buyer-analyzer" element={<ProtectedRoute><BuyerAnalyzer /></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><ConversationHistory /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
