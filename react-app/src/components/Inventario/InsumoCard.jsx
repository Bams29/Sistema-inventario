function InsumoCard({ insumo, selected, onToggle }) {
  return (
    <div
      className={`Tarjeta-Insumo${selected ? ' selected' : ''}`}
      onClick={() => onToggle(insumo._id)}
    >
      <div className="Tarjeta-Contenido">
        <img
          src="/Images/klipartz.com (1).png"
          alt="Imagen Insumo"
          className="Tarjeta-Imagen"
        />
        <div className="Tarjeta-Datos">
          <h3>Nombre: {insumo.nombre}</h3>
            <p>ID: {insumo._id}</p>
            <p>Cantidad: {insumo.cantidad}/{insumo.cantidadMinima} {insumo.medida}</p>
        </div>
      </div>
    </div>
  )
}

export default InsumoCard
