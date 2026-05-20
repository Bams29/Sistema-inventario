function UsuarioRow({ usuario, selected, onToggle }) {
  return (
    <div className={`usuario-row${selected ? ' selected' : ''}`} onClick={() => onToggle(usuario._id)}>
      <div className="col-nombre">{usuario.nombre}</div>
      <div className="col-password">{'•'.repeat(Math.min(usuario.password?.length || 8, 8))}</div>
      <div className="col-estado">{usuario.estado || usuario.rol || 'N/A'}</div>
      <div className="col-acceso">{usuario.rol}</div>
    </div>
  )
}

export default UsuarioRow
