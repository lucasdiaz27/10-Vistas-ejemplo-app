import React from "react";
import { FaEye } from "react-icons/fa";

const estadoConfig = {
  pendiente: { label: "Pendiente", color: "warning" },
  aprobada: { label: "Aprobada", color: "success" },
  "en proceso": { label: "En Proceso", color: "primary" },
  "no admitido": { label: "No Admitido", color: "secondary" },
  rechazada: { label: "Rechazada", color: "danger" },
  completado: { label: "Completado", color: "success" },
  // Puedes agregar más estados si los necesitas
};

const MesaEntradaTabla = ({ denuncias, filtroEstado, setFiltroEstado, busquedaDenuncia, setBusquedaDenuncia, abrirDetalle, aceptar, rechazar }) => {
  return (
    <>
      <h2 className="fw-bold">Mesa de Entrada - Denuncias</h2>
      <div className="row mb-3 g-2">
        <div className="col-md-8">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por ID, solicitante, objeto, motivo, descripción o fecha"
            value={busquedaDenuncia}
            onChange={e => setBusquedaDenuncia(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={filtroEstado}
            onChange={e => setFiltroEstado(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Aprobada">Aprobada</option>
            <option value="En Proceso">En Proceso</option>
            <option value="No Admitido">No Admitido</option>
            <option value="Rechazada">Rechazada</option>
          </select>
        </div>
      </div>
      <div className="table-responsive shadow p-2 bg-white rounded">
        <table className="table table-hover align-middle mb-0" style={{ minWidth: 900, maxWidth: '100%' }}>
          <thead className="table-primary">
            <tr>
              <th>ID</th>
              <th>Solicitante</th>
              <th>Objeto</th>
              <th>Motivo</th>
              <th>Descripción</th>
              <th>Fecha de Ingreso</th>
              <th>Estado</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {denuncias.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center text-muted">No hay denuncias que coincidan con el filtro.</td>
              </tr>
            ) : (
              denuncias.map((d) => {
                const estadoKey = (d.estado || "").toLowerCase().trim();
                const estado = estadoConfig[estadoKey] || { label: d.estado || "Sin estado", color: "secondary" };
                return (
                  <tr key={d.id}>
                    <td>{d.id}</td>
                    <td>{d.solicitante}</td>
                    <td>{d.objeto}</td>
                    <td>{d.motivo}</td>
                    <td>{d.descripcion}</td>
                    <td>{d.fechaIngreso}</td>
                    <td>
                      <span className={`badge bg-${estado.color}`}>
                        {estado.label}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2 justify-content-center">
                        <button
                          className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1 px-2 py-1"
                          title="Ver detalles"
                          onClick={() => abrirDetalle(d)}
                        >
                          <FaEye /> <span className="d-none d-md-inline">Detalle</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default MesaEntradaTabla;
