import React from "react";

export default function TablaPases({ pases, onEditar, onEliminar, onNuevo }) {
  return (
    <div className="table-responsive" style={{ paddingBottom: '2rem' }}>
      <div className="d-flex justify-content-end mb-2">
        <button className="btn btn-primary" onClick={onNuevo}>
          <i className="bi bi-plus-circle me-1"></i> Nuevo Pase
        </button>
      </div>
      <table className="table table-sm table-bordered mb-0 align-middle" style={{ borderRadius: '0.5rem', overflow: 'hidden' }}>
        <thead className="table-light">
          <tr>
            <th>Asunto</th>
            <th>Cant. Folios</th>
            <th>Área Origen</th>
            <th>Área Destino</th>
            <th>Descripción</th>
            <th>Fecha Acción</th>
            <th>Usuario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pases.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center text-muted">No hay pases registrados para este expediente.</td>
            </tr>
          ) : (
            pases.map((pase, idx) => (
              <tr key={pase.id || idx}>
                <td>{pase.asunto || '-'}</td>
                <td>{pase.cantFolios || '-'}</td>
                <td>{pase.areaOrigen || '-'}</td>
                <td>{pase.areaDestino || '-'}</td>
                <td>{pase.descripcion || '-'}</td>
                <td>{pase.fechaAccion || '-'}</td>
                <td>{pase.nombreUsuario || '-'}</td>
                <td>
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => onEditar(pase)}>
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => onEliminar(pase.id)}>
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
