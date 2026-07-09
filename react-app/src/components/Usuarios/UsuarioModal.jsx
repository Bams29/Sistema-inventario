import { useState, useEffect } from 'react'

function UsuarioModal({ isOpen, usuario, onClose, onSave, isEditing }) {
  if (!isOpen) return null

  const [nombre, setNombre] = useState(usuario?.nombre || '')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [estado, setEstado] = useState(usuario?.estado || '')
  const [acceso, setAcceso] = useState(usuario?.rol || '')

  useEffect(() => {
    setNombre(usuario?.nombre || '')
    setPassword('')
    setEstado(usuario?.estado || '')
    setAcceso(usuario?.rol || '')
  }, [usuario])

  useEffect(() => {
    setShowPassword(false)
  }, [isEditing])

  const handleSubmit = () => {
    const missing = []
    if (!nombre.trim()) missing.push('nombre')
    if (!estado.trim()) missing.push('estado')
    if (!acceso.trim()) missing.push('acceso')

    if (missing.length) {
      if (isEditing) {
        console.error('PUT /api/usuarios: campos faltantes antes de actualizar usuario', { missing, nombre, estado, acceso })
      }
      if (missing.includes('nombre')) {
        alert('Ingrese el nombre del usuario')
        return
      }
      if (missing.includes('estado')) {
        alert('Seleccione un estado')
        return
      }
      if (missing.includes('acceso')) {
        alert('Seleccione un nivel de acceso')
        return
      }
    }

    onSave({
      _id: usuario?._id,
      nombre: nombre.trim(),
      password: password.trim() || usuario?.password,
      estado: estado.trim(),
      rol: acceso.trim()
    })
  }

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="card-agregar" role="dialog" aria-modal="true">
        <form className="form-ingreso" onSubmit={(e) => { e.preventDefault(); handleSubmit() }}>
          <div className="nombre-int">
            <input
              type="text"
              placeholder="Nombre"
              className="input-nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div className="nombre-int">
            <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder={isEditing ? 'Contraseña (actual) o nueva' : 'Contraseña'}
                className="input-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showPassword ? 'Ocultar' : 'Ver'}
              </button>
            </div>
          </div>
          <div className="nombre-int">
            <select
              className="input-estado"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
            >
              <option value="">Seleccionar Estado</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
          <div className="nombre-int">
            <select
              className="input-acceso"
              value={acceso}
              onChange={(e) => setAcceso(e.target.value)}
            >
              <option value="">Seleccionar Nivel de Acceso</option>
              <option value="Empleado">Empleado</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <div className="modal-actions">
            <button type="submit" className="btn-agregar">
              {isEditing ? 'Guardar' : 'Agregar'}
            </button>
            <button type="button" className="btn-cancelar" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default UsuarioModal
