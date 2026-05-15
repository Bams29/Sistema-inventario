import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navigation from './components/Navigation'
import AvisosPage from './pages/AvisosPage'
import RecibosPage from './pages/RecibosPage'
import UsuariosPage from './pages/UsuariosPage'

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navigation />
        <div className="content-area">
          <Routes>
            <Route path="/" element={<Navigate to="/avisos" replace />} />
            <Route path="/avisos" element={<AvisosPage />} />
            <Route path="/recibos" element={<RecibosPage />} />
            <Route path="/usuarios" element={<UsuariosPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
