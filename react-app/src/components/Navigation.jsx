import { NavLink, useNavigate } from 'react-router-dom'
import './Navigation.css'

function Navigation() {
  const rol = localStorage.getItem('rol')
  const nombre = localStorage.getItem('nombre')
  const showUsuarios = rol === 'admin'
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('rol')
    localStorage.removeItem('nombre')
    navigate('/login')
  }

  return (
    <div className="Barra-Navegacion">
      <div className="Logo-Ingreso">
        <div className="Logo-Link">
          <img src="/Images/klipartz.com.png" alt="Ir a ingreso" className="Logo-Imagen" />
          <span className="Logo-Tooltip">Ir a ingreso</span>
        </div>
      </div>
      <NavLink to="/inventario" className={({ isActive }) => isActive ? 'active-link' : ''}>
        <button className="Inventario-btn" type="button">
          <img src="/Images/klipartz.com (1).png" alt="Inventario" className="Nav-Icon" />
          Inventario
        </button>
      </NavLink>
      <NavLink to="/avisos" className={({ isActive }) => isActive ? 'active-link' : ''}>
        <button className="Avisos-btn" type="button">
          <img src="/Images/Advertencia.png" alt="Avisos" className="Nav-Icon" />
          Avisos
        </button>
      </NavLink>
      <NavLink to="/recibos" className={({ isActive }) => isActive ? 'active-link' : ''}>
        <button className="Recibos-btn" type="button">
          <img src="/Images/Recibo.png" alt="Recibos" className="Nav-Icon" />
          Recibos
        </button>
      </NavLink>
      {showUsuarios && (
        <NavLink to="/usuarios" className={({ isActive }) => isActive ? 'active-link' : ''}>
          <button className="Inventario-btn" type="button">
            <img src="/Images/klipartz.com.png" alt="Usuarios" className="Nav-Icon" />
            Usuarios
          </button>
        </NavLink>
      )}
      <div className="user-info">
        <span className="user-name">{nombre}</span>
        <button className="logout-btn" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}

export default Navigation
