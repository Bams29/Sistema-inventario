import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navigation from './components/Navigation'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import AvisosPage from './pages/AvisosPage'
import RecibosPage from './pages/RecibosPage'
import UsuariosPage from './pages/UsuariosPage'
import InventarioPage from './pages/InventarioPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <div className="app-container">
              <Navigation />
              <div className="content-area">
                <Routes>
                  <Route path="/" element={<Navigate to="/avisos" replace />} />
                  <Route path="/avisos" element={<ProtectedRoute element={<AvisosPage />} />} />
                  <Route path="/inventario" element={<ProtectedRoute element={<InventarioPage />} />} />
                  <Route path="/recibos" element={<ProtectedRoute element={<RecibosPage />} />} />
                  <Route path="/usuarios" element={<ProtectedRoute element={<UsuariosPage />} />} />
                </Routes>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
