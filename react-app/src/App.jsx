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
        {/* Login es la ruta principal */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Rutas protegidas con Layout */}
        <Route
          path="/*"
          element={
            <div className="app-container">
              <Navigation />
              <div className="content-area">
                <Routes>
                  <Route path="/avisos" element={<ProtectedRoute element={<AvisosPage />} />} />
                  <Route path="/inventario" element={<ProtectedRoute element={<InventarioPage />} />} />
                  <Route path="/recibos" element={<ProtectedRoute element={<RecibosPage />} />} />
                  <Route path="/usuarios" element={<ProtectedRoute element={<UsuariosPage />} />} />
                  <Route path="/*" element={<Navigate to="/inventario" replace />} />
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
