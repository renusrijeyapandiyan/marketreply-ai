import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { SellerProvider } from './context/SellerContext.jsx'
import './styles/index.css'
import './styles/animations.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SellerProvider>
          <App />
        </SellerProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
