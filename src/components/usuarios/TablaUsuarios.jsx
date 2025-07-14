import { parseJwt } from '../../utils/auth';

function TablaUsuarios({ usuarios, onEditar, onEliminar }) {
  // Obtener el rol del usuario logueado desde el token
  const token = localStorage.getItem('token');
  const payload = parseJwt(token);
  // Acepta ADMIN, ROLE_ADMIN y authorities con esos valores
  const authorities = Array.isArray(payload?.authorities) ? payload.authorities : [];
  const esAdmin = (
    payload?.rol === 'ADMIN' ||
    payload?.rol === 'ROLE_ADMIN' ||
    payload?.role === 'ADMIN' ||
    payload?.role === 'ROLE_ADMIN' ||
    authorities.includes('ADMIN') ||
    authorities.includes('ROLE_ADMIN')
  );

  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead className="table-primary">
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th className="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u, idx) => (
            <tr key={u.id ?? idx}>
              <td>{u.nombre}</td>
              <td>{u.email}</td>
              <td>{typeof u.rol === 'object' && u.rol !== null ? u.rol.nombre : u.rol}</td>
              <td className="text-end">
                <div className="btn-group btn-group-sm">
                  <button
                    className="btn btn-outline-primary"
                    title="Editar usuario"
                    onClick={() => onEditar(u)}
                  >
                    <i className="bi bi-pencil-fill"></i>
                  </button>
                  {esAdmin && u.rol !== 'ADMIN' && u.rol !== 'ROLE_ADMIN' && (
                    <button
                      className="btn btn-outline-danger"
                      title="Eliminar usuario"
                      onClick={() => onEliminar(u.id)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  )}
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
