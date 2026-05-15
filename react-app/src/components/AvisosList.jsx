import { useState, useEffect } from 'react'
import AvisoCard from './AvisoCard'
import AvisoPopup from './AvisoPopup'
import './AvisosList.css'

function AvisosList() {
  const [avisos, setAvisos] = useState([])
  const [filteredAvisos, setFilteredAvisos] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAviso, setSelectedAviso] = useState(null)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  // Cargar avisos desde API
  useEffect(() => {
    const fetchAvisos = async () => {
      try {
        const res = await fetch('/api/avisos')
        if (!res.ok) throw new Error('Error al cargar avisos')
        const data = await res.json()
        setAvisos(data)
        setFilteredAvisos(data)
      } catch (err) {
        console.error('Error fetching avisos:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAvisos()
  }, [])

  // Filtrar avisos por búsqueda
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredAvisos(avisos)
      return
    }

    const term = searchTerm.toLowerCase()
    const filtered = avisos.filter(aviso =>
      (aviso.mensaje && aviso.mensaje.toLowerCase().includes(term)) ||
      (aviso.Nombre_producto && aviso.Nombre_producto.toLowerCase().includes(term)) ||
      (aviso.fecha && aviso.fecha.includes(term)) ||
      (aviso.aviso_id && aviso.aviso_id.toLowerCase().includes(term)) ||
      (aviso._id && aviso._id.toLowerCase().includes(term))
    )
    setFilteredAvisos(filtered)
  }, [searchTerm, avisos])

  const handleAvisoClick = (aviso) => {
    setSelectedAviso(aviso)
    setIsPopupOpen(true)
  }

  return (
    <div className="Zona-Tarjetas">
      <div className="Zona-Superior">
        <input
          type="text"
          className="Barra-Busqueda"
          placeholder="Buscar aviso..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="Tarjetas-Grid">
        {loading ? (
          <p>Cargando avisos...</p>
        ) : filteredAvisos.length === 0 ? (
          <p>No hay avisos disponibles</p>
        ) : (
          filteredAvisos.map(aviso => (
            <AvisoCard
              key={aviso._id || aviso.aviso_id}
              aviso={aviso}
              onClick={() => handleAvisoClick(aviso)}
            />
          ))
        )}
      </div>
      {selectedAviso && (
        <AvisoPopup
          aviso={selectedAviso}
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
        />
      )}
    </div>
  )
}

export default AvisosList
