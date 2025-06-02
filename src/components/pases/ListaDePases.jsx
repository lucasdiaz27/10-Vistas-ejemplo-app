export default function ListaDePases({ abrirModal }) {
  return (
    <div className="card">
      <div className="card-header">
        <div className="row align-items-center">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-search"></i></span>
              <input type="text" className="form-control" placeholder="Buscar pases..." />
            </div>
          </div>
          <div className="col-md-6 text-end">
            <button className="btn btn-outline-primary btn-sm me-2">
              <i className="bi bi-funnel"></i> Filtrar
            </button>
            <button className="btn btn-outline-primary btn-sm">
              <i className="bi bi-download"></i> Exportar
            </button>
          </div>
        </div>
      </div>
      <div className="card-body p-0">
        <table className="table table-hover mb-0">
          <thead className="table-light">
            <tr>
              <th>Expediente</th>
              <th>Fecha</th>
              <th>Iniciador</th>
              <th>Asunto</th>
              <th>Origen</th>
              <th>Destino</th>
              <th>Folios</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>EXP-2023-00123</td>
              <td>15/05/2023</td>
              <td>Juan Pérez</td>
              <td>Solicitud de materiales</td>
              <td>Administración</td>
              <td>Compras</td>
              <td>12</td>
              <td><span className="badge bg-success">Completado</span></td>
              <td>
                <div className="btn-group btn-group-sm">
                  <button className="btn btn-outline-primary" onClick={() => abrirModal('ver')}>
                    <i className="bi bi-eye"></i>
                  </button>
                  <button className="btn btn-outline-primary" onClick={() => abrirModal('editar')}>
                    <i className="bi bi-pencil"></i>
                  </button>
                </div>
              </td>
            </tr>
            {/* Puedes mapear más filas desde un array si lo deseas */}
          </tbody>
        </table>
      </div>
    </div>
  );
}
