function AvisoPopup({ aviso, isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <>
      <div className="popup-overlay" onClick={onClose} />
      <div className="avisos-popup" role="dialog" aria-modal="true">
        <div style={{ padding: '20px', maxWidth: '480px' }}>
          <h3>Aviso {aviso.aviso_id || aviso._id}</h3>
          <p><strong>Producto:</strong> {aviso.Nombre_producto || 'N/A'}</p>
          <p><strong>Fecha:</strong> {aviso.fecha}</p>
          <p>{aviso.mensaje}</p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
            <button type="button" onClick={onClose}>Cerrar</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default AvisoPopup
