import { useState, useEffect } from 'react'
import InsumoCard from './InsumoCard'
import InventarioModal from './InventarioModal'
import './Inventario.css'

function InventarioList() {
  const [insumos, setInsumos] = useState([])
  const [filtered, setFiltered] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIds, setSelectedIds] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingInsumo, setEditingInsumo] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadInsumos = async () => {
    try {
      const res = await fetch('/api/insumos')
      if (!res.ok) throw new Error('Error al cargar insumos')
      const data = await res.json()
      setInsumos(data)
      setFiltered(data)
    } catch (err) {
      console.error(err)
      alert('Error al cargar insumos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInsumos()
  }, [])

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFiltered(insumos)
      return
    }

    const term = searchTerm.toLowerCase()
    setFiltered(
      insumos.filter((insumo) =>
        insumo.nombre?.toLowerCase().includes(term)
      )
    )
  }, [searchTerm, insumos])

  const toggleSelect = (id) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    )
  }

  const openAddModal = () => {
    setEditingInsumo(null)
    setModalOpen(true)
  }

  const openEditModal = () => {
    if (selectedIds.length === 0) {
      alert('Seleccione un insumo para editar')
      return
    }
    if (selectedIds.length > 1) {
      alert('Seleccione solo un insumo para editar')
      return
    }
    const insumo = insumos.find((item) => item._id === selectedIds[0])
    setEditingInsumo(insumo)
    setModalOpen(true)
  }

  const deleteSelected = async () => {
    if (selectedIds.length === 0) {
      alert('Seleccione al menos un insumo para eliminar')
      return
    }
    if (!confirm(`Eliminar ${selectedIds.length} insumo(s)?`)) return

    try {
      await Promise.all(
        selectedIds.map((id) =>
          fetch(`/api/insumos/${id}`, { method: 'DELETE' })
        )
      )
      setSelectedIds([])
      loadInsumos()
    } catch (err) {
      console.error(err)
      alert('Error al eliminar insumos')
    }
  }

  const handleSave = async (data) => {
    try {
      const method = editingInsumo ? 'PUT' : 'POST'
      const url = editingInsumo ? `/api/insumos/${editingInsumo._id}` : '/api/insumos'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!res.ok) throw new Error('Error al guardar insumo')
      setModalOpen(false)
      setSelectedIds([])
      loadInsumos()
    } catch (err) {
      console.error(err)
      alert('Error al guardar insumo')
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
          placeholder="Buscar insumo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="Tarjetas-Grid">
        {loading ? (
          <p>Cargando insumos...</p>
        ) : filtered.length === 0 ? (
          <p>No hay insumos disponibles</p>
        ) : (
          filtered.map((insumo) => (
            <InsumoCard
              key={insumo._id}
              insumo={insumo}
              selected={selectedIds.includes(insumo._id)}
              onToggle={toggleSelect}
            />
          ))
        )}
      </div>

      <InventarioModal
        isOpen={modalOpen}
        insumo={editingInsumo}
        isEditing={Boolean(editingInsumo)}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  )
}

export default InventarioList
