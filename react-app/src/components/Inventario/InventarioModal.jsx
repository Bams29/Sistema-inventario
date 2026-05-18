import { useState, useEffect } from 'react'

function InventarioModal({ isOpen, insumo, onClose, onSave, isEditing }) {
  if (!isOpen) return null

  const [nombre, setNombre] = useState(insumo?.nombre || '')
  const [cantidad, setCantidad] = useState(insumo?.cantidad ?? '')
  const [cantidadMinima, setCantidadMinima] = useState(insumo?.cantidadMinima ?? '')
  const [medida, setMedida] = useState(insumo?.medida || '')

  useEffect(() => {
    setNombre(insumo?.nombre || '')
    setCantidad(insumo?.cantidad ?? '')
    setCantidadMinima(insumo?.cantidadMinima ?? '')
    setMedida(insumo?.medida || '')
  }, [insumo])

  const handleSubmit = () => {
    if (!nombre.trim() || cantidad === '' || cantidadMinima === '' || !medida.trim()) {
      alert('Todos los campos son requeridos')
      return
    }

    onSave({
      _id: insumo?._id,
      nombre: nombre.trim(),
      cantidad: Number(cantidad),
      cantidadMinima: Number(cantidadMinima),
      medida: medida.trim()
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
              placeholder="Nombre insumo"
              className="input-nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div className="nombre-int">
            <input
              type="number"
              placeholder="Cantidad"
              className="input-cantidad"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
            />
          </div>
          <div className="nombre-int">
            <input
              type="number"
              placeholder="Cantidad minima"
              className="input-cantidad-minima"
              value={cantidadMinima}
              onChange={(e) => setCantidadMinima(e.target.value)}
            />
          </div>
          <div className="nombre-int">
            <input
              type="text"
              placeholder="Medida (ej: lts)"
              className="input-medida"
              value={medida}
              onChange={(e) => setMedida(e.target.value)}
            />
          </div>
          <div className="modal-actions">
            <button type="submit" className="btn-agregar">
              {isEditing ? 'Guardar' : 'Agregar'}
            </button>
            <button type="button" id="btnCancelar" className="btn-cancelar" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default InventarioModal
