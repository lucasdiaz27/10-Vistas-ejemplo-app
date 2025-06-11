const estadoConfig = {
  pendiente: { label: "Pendiente", color: "warning" },
  aprobada: { label: "Aprobada", color: "success" },
  "en proceso": { label: "En Proceso", color: "primary" },
  "no admitido": { label: "No Admitido", color: "secondary" },
  rechazada: { label: "Rechazada", color: "danger" },
  completado: { label: "Completado", color: "success" },
};

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
          <thead className="table-primary">
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
              <td>
                {(() => {
                  const estadoKey = ("Completado" || "").toLowerCase().trim(); // Reemplaza "Completado" por pase.estado si usás un array
                  const estado = estadoConfig[estadoKey] || { label: "Completado", color: "secondary" };
                  return (
                    <span className={`badge bg-${estado.color}`}>
                      {estado.label}
                    </span>
                  );
                })()}
              </td>
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
            {/* Puedes agregar más filas fijas aquí si lo necesitas */}
          </tbody>
        </table>
      </div>
    </div>
  );
}
