import { useState, useEffect } from 'react'

function UsuarioModal({ isOpen, usuario, onClose, onSave, isEditing }) {
  if (!isOpen) return null

  const [nombre, setNombre] = useState(usuario?.nombre || '')
  const [password, setPassword] = useState('')
  const [estado, setEstado] = useState(usuario?.estado || '')
  const [acceso, setAcceso] = useState(usuario?.rol || '')

  useEffect(() => {
    setNombre(usuario?.nombre || '')
    setPassword('')
    setEstado(usuario?.estado || '')
    setAcceso(usuario?.rol || '')
  }, [usuario])

  const handleSubmit = () => {
    if (!nombre.trim()) {
      alert('Ingrese el nombre del usuario')
      return
    }
    if (!estado.trim()) {
      alert('Seleccione un estado')
      return
    }
    if (!acceso.trim()) {
      alert('Seleccione un nivel de acceso')
      return
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
            <input
              type="password"
              placeholder="Contraseña"
              className="input-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
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
