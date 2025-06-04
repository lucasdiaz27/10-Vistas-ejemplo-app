import React from "react";

const MesaEntradaModal = ({ abierto, denuncia, cerrarModal, estadoConfig }) => {
  if (!abierto || !denuncia) return null;
  const estadoKey = (denuncia.estado || "").toLowerCase().trim();
  const estado = estadoConfig[estadoKey] || { label: denuncia.estado, color: "secondary" };
  return (
    <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.5)" }} tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">Detalle de Denuncia</h5>
            <button type="button" className="btn-close" onClick={cerrarModal}></button>
          </div>
          <div className="modal-body">
            <ul className="list-group list-group-flush">
              <li className="list-group-item"><strong>ID:</strong> {denuncia.id}</li>
              <li className="list-group-item"><strong>Solicitante:</strong> {denuncia.solicitante}</li>
              <li className="list-group-item"><strong>Objeto:</strong> {denuncia.objeto}</li>
              <li className="list-group-item"><strong>Motivo:</strong> {denuncia.motivo}</li>
              <li className="list-group-item"><strong>Descripción:</strong> {denuncia.descripcion}</li>
              <li className="list-group-item"><strong>Fecha de Ingreso:</strong> {denuncia.fechaIngreso}</li>
              <li className="list-group-item">
                <strong>Estado:</strong> <span className={`badge rounded-pill bg-${estado.color} px-3 py-2 fs-6 fw-semibold`} style={{letterSpacing:1}}>{estado.label}</span>
              </li>
              <li className="list-group-item">
                <strong>Documento adjunto:</strong> {denuncia.archivo ? (
                  <a
                    href={`data:application/pdf;base64,${denuncia.archivo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-secondary btn-sm mt-2"
                  >
                    Ver documento adjunto
                  </a>
                ) : (
                  <span className="text-muted">Sin documento adjunto</span>
                )}
              </li>
            </ul>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={cerrarModal}>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MesaEntradaModal;
