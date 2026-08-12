import { NavLink, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './Navigation.css'

function Navigation() {
  const [collapsed, setCollapsed] = useState(false)
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

  // initialize mobile nav state and persist it across visits
  useEffect(() => {
    const saved = localStorage.getItem('navCollapsed')
    if (saved !== null) {
      setCollapsed(saved === 'true')
    } else {
      const shouldCollapse = window.innerWidth <= 425
      setCollapsed(shouldCollapse)
      localStorage.setItem('navCollapsed', shouldCollapse.toString())
    }

    const onResize = () => {
      // preserve the user's chosen state; don't auto-change on resize
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // toggle body class so content can shift when nav is open on mobile
  useEffect(() => {
    if (typeof document === 'undefined') return
    if (!collapsed) {
      document.body.classList.add('nav-open')
    } else {
      document.body.classList.remove('nav-open')
    }
    return () => document.body.classList.remove('nav-open')
  }, [collapsed])

  return (
    <>
      <button
        className="nav-toggle"
        aria-expanded={!collapsed}
        aria-label={collapsed ? 'Mostrar navegación' : 'Ocultar navegación'}
        onClick={() => {
          const next = !collapsed
          setCollapsed(next)
          localStorage.setItem('navCollapsed', next.toString())
        }}
      >
        <span className="hamburger" />
      </button>

      <div className={`Barra-Navegacion ${collapsed ? 'mobile-collapsed' : ''}`}>
        <div className="Logo-Ingreso">
          <div className="Logo-Link">
            <img src="/Images/klipartz.com.png" alt="Ir a ingreso" className="Logo-Imagen" />
            <span className="Logo-Tooltip">Esto es un logo</span>
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
    </>
  )
}

export default Navigation
