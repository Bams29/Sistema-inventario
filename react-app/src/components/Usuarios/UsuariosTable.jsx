import { useState, useEffect } from 'react'
import UsuarioRow from './UsuarioRow'
import UsuarioModal from './UsuarioModal'
import './Usuarios.css'

function UsuariosTable() {
  const [usuarios, setUsuarios] = useState([])
  const [filteredUsuarios, setFilteredUsuarios] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIds, setSelectedIds] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingUsuario, setEditingUsuario] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadUsuarios = async () => {
    try {
      const res = await fetch('/api/users')
      if (!res.ok) throw new Error('Error al cargar usuarios')
      const data = await res.json()
      setUsuarios(data)
      setFilteredUsuarios(data)
    } catch (err) {
      console.error(err)
      alert('Error al cargar usuarios')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsuarios()
  }, [])

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsuarios(usuarios)
      return
    }

    const term = searchTerm.toLowerCase()
    setFilteredUsuarios(
      usuarios.filter((usuario) =>
        usuario.nombre?.toLowerCase().includes(term) ||
        usuario.estado?.toLowerCase().includes(term) ||
        usuario.rol?.toLowerCase().includes(term)
      )
    )
  }, [searchTerm, usuarios])

  const toggleSelect = (id) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    )
  }

  const openAddModal = () => {
    setEditingUsuario(null)
    setModalOpen(true)
  }

  const openEditModal = () => {
    if (selectedIds.length === 0) {
      alert('Seleccione un usuario para editar')
      return
    }
    if (selectedIds.length > 1) {
      alert('Seleccione solo un usuario para editar')
      return
    }
    const usuario = usuarios.find((item) => item._id === selectedIds[0])
    setEditingUsuario(usuario)
    setModalOpen(true)
  }

  const deleteSelected = async () => {
    if (selectedIds.length === 0) {
      alert('Seleccione al menos un usuario para eliminar')
      return
    }
    if (!confirm(`Eliminar ${selectedIds.length} usuario(s)?`)) return

    try {
      await Promise.all(
        selectedIds.map((id) =>
          fetch(`/api/users/${id}`, { method: 'DELETE' })
        )
      )
      setSelectedIds([])
      loadUsuarios()
    } catch (err) {
      console.error(err)
      alert('Error al eliminar usuarios')
    }
  }

  const handleSave = async (data) => {
    try {
      const method = editingUsuario ? 'PUT' : 'POST'
      const url = editingUsuario ? `/api/users/${editingUsuario._id}` : '/api/users'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!res.ok) throw new Error('Error al guardar usuario')
      setModalOpen(false)
      setSelectedIds([])
      loadUsuarios()
    } catch (err) {
      console.error(err)
      alert('Error al guardar usuario')
    }
  }

  return (
    <div className="Zona-Tarjetas">
      <div className="Zona-Superior">
        <div className="Botones-Accion">
          <button className="Accion-btn" onClick={openAddModal}>Agregar</button>
          <button className="Accion-btn" onClick={deleteSelected}>Eliminar</button>
          <button className="Accion-btn" onClick={openEditModal}>Editar</button>
        </div>
        <input
          type="text"
          className="Barra-Busqueda"
          placeholder="Buscar usuario..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="usuarios-table">
        <div className="usuarios-header">
          <div className="col-nombre">Nombre</div>
          <div className="col-password">Contraseña</div>
          <div className="col-estado">Estado</div>
          <div className="col-acceso">Nivel de Acceso</div>
        </div>
        <div className="usuarios-rows">
          {loading ? (
            <div style={{ padding: '20px' }}>Cargando usuarios...</div>
          ) : filteredUsuarios.length === 0 ? (
            <div style={{ padding: '20px' }}>No hay usuarios disponibles</div>
          ) : (
            filteredUsuarios.map((usuario) => (
              <UsuarioRow
                key={usuario._id}
                usuario={usuario}
                selected={selectedIds.includes(usuario._id)}
                onToggle={toggleSelect}
              />
            ))
          )}
        </div>
      </div>

      <UsuarioModal
        isOpen={modalOpen}
        usuario={editingUsuario}
        isEditing={Boolean(editingUsuario)}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  )
}

export default UsuariosTable
