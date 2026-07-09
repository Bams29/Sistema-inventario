import { useState } from 'react'

function UsuarioRow({ usuario, selected, onToggle }) {
  const [showPassword, setShowPassword] = useState(false)
  const passwordText = usuario?.password || ''
  const bullets = '•'.repeat(Math.min(passwordText.length || 8, 8))

  return (
    <div className={`usuario-row${selected ? ' selected' : ''}`} onClick={() => onToggle(usuario._id)}>
      <div className="col-nombre">{usuario.nombre}</div>
      <div className="col-password">
        <span>{showPassword ? passwordText : bullets}</span>
        <button
          type="button"
          className="toggle-row-password-btn"
          onClick={(e) => {
            e.stopPropagation()
            setShowPassword((v) => !v)
          }}
          aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
        >
          {showPassword ? 'Ocultar' : 'Ver'}
        </button>
      </div>
      <div className="col-estado">{usuario.estado || usuario.rol || 'N/A'}</div>
      <div className="col-acceso">{usuario.rol}</div>
    </div>
  )
}

export default UsuarioRow
