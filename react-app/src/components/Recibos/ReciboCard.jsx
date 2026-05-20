function ReciboCard({ recibo, selected, onToggle }) {
  return (
    <div className={`Tarjeta-Recibo${selected ? ' selected' : ''}`} onClick={() => onToggle(recibo._id)}>
      <div className="Tarjeta-Contenido">
        <img src="/Images/Recibo.png" alt="Imagen Recibo" className="Tarjeta-Imagen" />
        <div className="Tarjeta-Datos">
          <h3>Valor: {recibo.valor}</h3>
          <p>ID: {recibo._id}</p>
          <p>Fecha: {recibo.fecha}</p>
          <p>Insumos: {recibo.insumos}</p>
          <p>Cantidades: {recibo.cantidades}</p>
          <p>Empleado: {recibo.empleado}</p>
        </div>
      </div>
    </div>
  )
}

export default ReciboCard
