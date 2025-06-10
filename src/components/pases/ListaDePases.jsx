// Simulación de datos y configuración de estados (puedes mover esto al padre si lo necesitas)
const pases = [
  {
    id: 1,
    expediente: "EXP-2023-00123",
    fecha: "15/05/2023",
    iniciador: "Juan Pérez",
    asunto: "Solicitud de materiales",
    origen: "Administración",
    destino: "Compras",
    folios: 12,
    estado: "Completado",
  },
  // ...otros pases
];

const estadoConfig = {
  pendiente: { label: "Pendiente", color: "warning" },
  completado: { label: "Completado", color: "success" },
  rechazado: { label: "Rechazado", color: "danger" },
  "en proceso": { label: "En Proceso", color: "primary" },
  // agrega más estados si los necesitas
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
            {pases.map((pase) => {
              const estadoKey = (pase.estado || "").toLowerCase().trim();
              const estado = estadoConfig[estadoKey] || { label: pase.estado, color: "secondary" };
              return (
                <tr key={pase.id}>
                  <td>{pase.expediente}</td>
                  <td>{pase.fecha}</td>
                  <td>{pase.iniciador}</td>
                  <td>{pase.asunto}</td>
                  <td>{pase.origen}</td>
                  <td>{pase.destino}</td>
                  <td>{pase.folios}</td>
                  <td>
                    <span className={`badge rounded-pill bg-${estado.color} px-3 py-2 fs-6 fw-semibold`} style={{ letterSpacing: 1 }}>
                      {estado.label}
                    </span>
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
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
