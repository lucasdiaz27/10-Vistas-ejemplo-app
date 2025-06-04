import React from "react";
import { FaEye } from "react-icons/fa";

const MesaEntradaTabla = ({ denuncias, filtroEstado, setFiltroEstado, busquedaDenuncia, setBusquedaDenuncia, abrirModal, aceptar, rechazar, estadoConfig }) => {
  return (
    <>
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
                const estado = estadoConfig[estadoKey] || { label: d.estado, color: "secondary" };
                return (
                  <tr key={d.id}>
                    <td>{d.id}</td>
                    <td>{d.solicitante}</td>
                    <td>{d.objeto}</td>
                    <td>{d.motivo}</td>
                    <td>{d.descripcion}</td>
                    <td>{d.fechaIngreso}</td>
                    <td>
                      <span className={`badge rounded-pill bg-${estado.color} px-3 py-2 fs-6 fw-semibold`} style={{letterSpacing:1}}>
                        {estado.label}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2 justify-content-center">
                        <button
                          className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1 px-2 py-1"
                          title="Ver detalles"
                          onClick={() => abrirModal(d)}
                        >
                          <FaEye /> <span className="d-none d-md-inline">Detalle</span>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-success d-flex align-items-center gap-1 px-2 py-1"
                          title="Aceptar"
                          onClick={() => aceptar(d.id)}
                        >
                          <span style={{fontSize: "1.2em", fontWeight: "bold", lineHeight: 1}}>&#10003;</span>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1 px-2 py-1"
                          title="Rechazar"
                          onClick={() => rechazar(d.id)}
                        >
                          <span style={{fontSize: "1.2em", fontWeight: "bold", lineHeight: 1}}>&#10005;</span>
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
