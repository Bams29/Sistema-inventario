import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './LoginPage.css'

export default function LoginPage() {
  const [usuario, setUsuario] = useState('')
  const [clave, setClave] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, clave })
      })

      const data = await res.json()

      if (res.ok) {
        // Guardar en localStorage
        localStorage.setItem('user', JSON.stringify(data))
        localStorage.setItem('rol', data.rol)
        localStorage.setItem('nombre', data.nombre)
        
        // Redirigir según el rol (igual que el legacy)
        if (data.rol === 'admin') {
          navigate('/usuarios')
        } else {
          navigate('/inventario')
        }
      } else {
        setError(data.message || 'Credenciales incorrectas')
      }
    } catch (err) {
      setError('Error de conexión')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="F-ingreso">
        <div className="decor decor-top-left">
          <img src="/Images/klipartz2.png" alt="Decoración" />
        </div>
        <div className="decor decor-top-right">
          <img src="/Images/klipartz.com (1).png" alt="Decoración" />
        </div>
        <div className="card-ingreso">
          <div className="card-img">
            <img src="/Images/klipartz.com.png" alt="Usuario" />
          </div>
          {error && <div className="error-message">{error}</div>}
          <form className="form-ingreso" onSubmit={handleLogin}>
            <div className="nombre-int">
              <input
                type="text"
                placeholder="Usuario"
                className="input-nombre"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="contraseña-int">
              <input
                type="password"
                placeholder="Contraseña"
                className="input-contraseña"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                disabled={loading}
              />
            </div>
            <button type="submit" className="btn-ingreso" disabled={loading}>
              {loading ? 'Cargando...' : 'Ingresar'}
            </button>
          </form>
        </div>
        <div className="decor decor-bottom-left">
          <img src="/Images/klipartz.com (1).png" alt="Decoración" />
        </div>
        <div className="decor decor-bottom-right">
          <img src="/Images/klipartz2.png" alt="Decoración" />
        </div>
      </div>
      <div className="zona-logo">
        <div className="logo">
          <img src="/Images/pngegg.png" alt="Logo" />
        </div>
        <div className="nombre">
          ¡BIENVENIDO AL <br />
          SISTEMA DE INVENTARIO <br />
          DE QUIMITEN!
        </div>
      </div>
    </div>
  )
}

