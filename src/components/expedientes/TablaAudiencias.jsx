import React from "react";
import Swal from "sweetalert2";

export default function TablaAudiencias({
  audiencias,
  onNueva,
  onEditar,
  onEliminar,
}) {

const handleEliminarClick = (id) => {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará la audiencia de forma permanente.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
  }).then((result) => {
    if (result.isConfirmed) {
      onEliminar(id);
      Swal.fire('Eliminado', 'La audiencia ha sido eliminada.', 'success');
    }
  });
};

  return (
    <div style={{ paddingBottom: "2rem" }}>
      <div className="d-flex justify-content-end mb-2">
        <button className="btn btn-primary btn-sm" onClick={onNueva}>
          <i className="bi bi-plus-lg me-1"></i> Nueva Audiencia
        </button>
      </div>
      {audiencias.length > 0 ? (
        <div className="table-responsive">
          <table
            className="table table-sm table-bordered mb-0 align-middle"
            style={{ borderRadius: "0.5rem", overflow: "hidden" }}
          >
            <thead className="table-light">
              <tr>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Lugar</th>
                <th>Personas llamadas</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {audiencias.map((a, idx) => (
                <tr key={a.id || idx}>
                  <td>
                    {a.fecha
                      ? new Date(a.fecha).toLocaleDateString("es-AR", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })
                      : "-"}
                  </td>
                  <td>{a.hora || "-"}</td>
                  <td>{a.lugar || "-"}</td>
                  <td>
                    {Array.isArray(a.nombresPersonas) &&
                    a.nombresPersonas.length > 0 ? (
                      <ul className="mb-0 ps-3" style={{ listStyle: "disc" }}>
                        {a.nombresPersonas.map((nombre, i) => (
                          <li key={i}>{nombre}</li>
                        ))}
                      </ul>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="d-flex gap-2">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => onEditar(a)}
                    >
                      <i className="bi bi-pencil"></i> Editar
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleEliminarClick(a.id)}
                    >
                      <i className="bi bi-trash"></i> Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-muted">
          No hay audiencias registradas para este expediente.
        </div>
      )}
    </div>
  );
}
