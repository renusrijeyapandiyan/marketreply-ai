import Navbar from './components/common/Navbar.jsx'
import Sidebar from './components/common/Sidebar.jsx'
import Footer from './components/common/Footer.jsx'
import AppRoutes from './routes/AppRoutes.jsx'
import { useAuth } from './hooks/useAuth.js'

export default function App() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <div className="flex flex-1">
        {isAuthenticated && <Sidebar />}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-10 py-8">
          <div className="max-w-6xl mx-auto animate-in">
            <AppRoutes />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}
