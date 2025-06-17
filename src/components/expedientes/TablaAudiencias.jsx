import React from "react";

export default function TablaAudiencias({ audiencias, onNueva, onEditar }) {
  return (
    <div>
      <div className="d-flex justify-content-end mb-2">
        <button className="btn btn-primary btn-sm" onClick={onNueva}>
          <i className="bi bi-plus-lg me-1"></i> Nueva Audiencia
        </button>
      </div>
      {audiencias.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-sm table-bordered mb-0">
            <thead className="table-light">
              <tr>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Lugar</th>
                <th>Persona Llamada</th>
                <th>Empresa Llamada</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {audiencias.map((a, idx) => (
                <tr key={a.id || idx}>
                  <td>{a.fecha || "-"}</td>
                  <td>{a.hora || "-"}</td>
                  <td>{a.lugar || "-"}</td>
                  <td>
                    {a.persona_llamada
                      ? `${a.persona_llamada.nombre} (${a.persona_llamada.dni})`
                      : "-"}
                  </td>
                  <td>
                    {a.empresa_llamada
                      ? `${a.empresa_llamada.nombre || "-"}`
                      : "-"}
                  </td>
                  <td>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => onEditar(a)}
                    >
                      <i className="bi bi-pencil"></i> Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-muted">No hay audiencias registradas para este expediente.</div>
      )}
    </div>
  );
}
