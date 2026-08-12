import { useState, useEffect } from 'react'
import ReciboCard from './ReciboCard'
import ReciboModal from './ReciboModal'
import './Recibos.css'

function RecibosList() {
  const [recibos, setRecibos] = useState([])
  const [filteredRecibos, setFilteredRecibos] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIds, setSelectedIds] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingRecibo, setEditingRecibo] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadRecibos = async () => {
    try {
      const res = await fetch('/api/recibos')
      if (!res.ok) throw new Error('Error al cargar recibos')
      const data = await res.json()
      setRecibos(data)
      setFilteredRecibos(data)
    } catch (err) {
      console.error(err)
      alert('Error al cargar recibos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRecibos()
  }, [])

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredRecibos(recibos)
      return
    }

    const term = searchTerm.toLowerCase()
    setFilteredRecibos(
      recibos.filter((recibo) =>
        recibo.valor?.toLowerCase().includes(term) ||
        recibo.insumos?.toLowerCase().includes(term) ||
        recibo.empleado?.toLowerCase().includes(term) ||
        recibo.fecha?.toLowerCase().includes(term)
      )
    )
  }, [searchTerm, recibos])

  const toggleSelect = (id) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    )
  }

  const openAddModal = () => {
    setEditingRecibo(null)
    setModalOpen(true)
  }

  const openEditModal = () => {
    if (selectedIds.length === 0) {
      alert('Seleccione un recibo para editar')
      return
    }
    if (selectedIds.length > 1) {
      alert('Seleccione solo un recibo para editar')
      return
    }
    const recibo = recibos.find((item) => item._id === selectedIds[0])
    setEditingRecibo(recibo)
    setModalOpen(true)
  }

  const deleteSelected = async () => {
    if (selectedIds.length === 0) {
      alert('Seleccione al menos un recibo para eliminar')
      return
    }
    if (!confirm(`Eliminar ${selectedIds.length} recibo(s)?`)) return

    try {
      await Promise.all(
        selectedIds.map((id) =>
          fetch(`/api/recibos/${id}`, { method: 'DELETE' })
        )
      )
      setSelectedIds([])
      loadRecibos()
    } catch (err) {
      console.error(err)
      alert('Error al eliminar recibos')
    }
  }

  const handleSave = async (data) => {
    try {
      const method = editingRecibo ? 'PUT' : 'POST'
      const url = editingRecibo ? `/api/recibos/${editingRecibo._id}` : '/api/recibos'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!res.ok) throw new Error('Error al guardar recibo')
      setModalOpen(false)
      setSelectedIds([])
      loadRecibos()
    } catch (err) {
      console.error(err)
      alert('Error al guardar recibo')
    }
  }

  return (
    <div className="Zona-Tarjetas">
      <div className="Zona-Superior">
        <input
          type="text"
          className="Barra-Busqueda"
          placeholder="Buscar recibo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="Botones-Accion">
          <button className="Accion-btn" onClick={openAddModal}>Agregar</button>
          <button className="Accion-btn" onClick={deleteSelected}>Eliminar</button>
          <button className="Accion-btn" onClick={openEditModal}>Editar</button>
        </div>
      </div>

      <div className="Tarjetas-Grid">
        {loading ? (
          <p>Cargando recibos...</p>
        ) : filteredRecibos.length === 0 ? (
          <p>No hay recibos disponibles</p>
        ) : (
          filteredRecibos.map((recibo) => (
            <ReciboCard
              key={recibo._id}
              recibo={recibo}
              selected={selectedIds.includes(recibo._id)}
              onToggle={toggleSelect}
            />
          ))
        )}
      </div>

      <ReciboModal
        isOpen={modalOpen}
        recibo={editingRecibo}
        isEditing={Boolean(editingRecibo)}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  )
}

export default RecibosList
