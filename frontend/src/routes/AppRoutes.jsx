import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home.jsx'
import Dashboard from '../pages/Dashboard.jsx'
import SellerSettings from '../pages/SellerSettings.jsx'
import SellerDirectory from '../pages/SellerDirectory.jsx'
import BuyerAnalyzer from '../pages/BuyerAnalyzer.jsx'
import ConversationHistory from '../pages/ConversationHistory.jsx'
import Analytics from '../pages/Analytics.jsx'
import NotFound from '../pages/NotFound.jsx'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/seller-settings" element={<SellerSettings />} />
      <Route path="/sellers" element={<SellerDirectory />} />
      <Route path="/buyer-analyzer" element={<BuyerAnalyzer />} />
      <Route path="/history" element={<ConversationHistory />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}