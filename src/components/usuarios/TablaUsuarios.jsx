function TablaUsuarios({ usuarios, onEditar }) {
  const badgeActivo = (activo) => (
    <span className={`badge ${activo ? 'bg-success' : 'bg-secondary'}`}>
      {activo ? 'Activo' : 'Inactivo'}
    </span>
  );

  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead className="table-primary">
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Estado</th>
            <th className="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td>{u.nombre}</td>
              <td>{u.email}</td>
              <td>{u.rol}</td>
              <td>{badgeActivo(u.activo)}</td>
              <td className="text-end">
                <div className="btn-group btn-group-sm">
                  <button
                    className="btn btn-outline-primary"
                    title="Editar usuario"
                    onClick={() => onEditar(u)}
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {usuarios.length === 0 && (
        <div className="alert alert-light text-center">No se encontraron usuarios.</div>
      )}
    </div>
  );
}

export default TablaUsuarios;
