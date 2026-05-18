import './AvisoCard.css'

function AvisoCard({ aviso, onClick }) {
  return (
    <div className="Tarjeta-Aviso" onClick={onClick}>
      <div className="Tarjeta-Contenido">
        <img src="/Images/Advertencia.png" alt="Imagen Aviso" className="Tarjeta-Imagen" />
        <div className="Tarjeta-Datos">
          <p>{aviso.mensaje || `Producto: ${aviso.Nombre_producto} en fecha ${aviso.fecha}`}</p>
          <p>Fecha: {aviso.fecha}</p>
          <p>ID: {aviso.aviso_id || aviso._id}</p>
        </div>
      </div>
    </div>
  )
}

export default AvisoCard
