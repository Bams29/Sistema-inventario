import { useState, useEffect } from 'react'

function ReciboModal({ isOpen, recibo, onClose, onSave, isEditing }) {
  if (!isOpen) return null

  const [valor, setValor] = useState(recibo?.valor || '')
  const [fecha, setFecha] = useState(recibo?.fecha || '')
  const [insumos, setInsumos] = useState(recibo?.insumos || '')
  const [cantidades, setCantidades] = useState(recibo?.cantidades || '')
  const [empleado, setEmpleado] = useState(recibo?.empleado || '')

  useEffect(() => {
    setValor(recibo?.valor || '')
    setFecha(recibo?.fecha || '')
    setInsumos(recibo?.insumos || '')
    setCantidades(recibo?.cantidades || '')
    setEmpleado(recibo?.empleado || '')
  }, [recibo])

  const handleSubmit = () => {
    if (!valor.trim() || !fecha.trim() || !insumos.trim() || !cantidades.trim() || !empleado.trim()) {
      alert('Todos los campos son requeridos')
      return
    }

    onSave({
      _id: recibo?._id,
      valor: valor.trim(),
      fecha: fecha.trim(),
      insumos: insumos.trim(),
      cantidades: cantidades.trim(),
      empleado: empleado.trim()
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
              placeholder="Valor"
              className="input-valor"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            />
          </div>
          <div className="nombre-int">
            <input
              type="text"
              placeholder="Fecha"
              className="input-fecha"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>
          <div className="nombre-int">
            <input
              type="text"
              placeholder="Insumos comprados"
              className="input-insumos"
              value={insumos}
              onChange={(e) => setInsumos(e.target.value)}
            />
          </div>
          <div className="nombre-int">
            <input
              type="text"
              placeholder="Cantidades"
              className="input-cantidades"
              value={cantidades}
              onChange={(e) => setCantidades(e.target.value)}
            />
          </div>
          <div className="nombre-int">
            <input
              type="text"
              placeholder="Empleados"
              className="input-empleados"
              value={empleado}
              onChange={(e) => setEmpleado(e.target.value)}
            />
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

export default ReciboModal
