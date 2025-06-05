import React from "react";
import { DescDetalle } from "../components/detalle-denuncia/DescDetalle";
import { PersonaDetalle } from "../components/detalle-denuncia/PersonaDetalle";

const DetalleDenuncia = ({ abierto, denuncia, cerrarModal, estadoConfig }) => {
  if (!abierto || !denuncia) return null;
  // Personas involucradas (ajustar según estructura real)
  const personas = [
    { label: "Denunciante", ...(denuncia.personas?.[0] || {}) },
    { label: "Denunciado", ...(denuncia.personas?.[1] || {}) },
    { label: "Técnico", ...(denuncia.personas?.[2] || {}) },
  ];
  const estadoKey = (denuncia.estado || "").toLowerCase().trim();
  const estado = estadoConfig[estadoKey] || { label: denuncia.estado, color: "secondary" };
  return (
    <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.5)" }} tabIndex={-1}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">Detalle de Denuncia</h5>
            <button type="button" className="btn-close" onClick={cerrarModal}></button>
          </div>
          <div className="modal-body">
            <DescDetalle denuncia={denuncia} />
            <PersonaDetalle denuncia={denuncia} personas={personas} tab={personas[0].label} setTab={() => {}} />
            <ul className="list-group list-group-flush mt-3">
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
        </div>
      </div>
    </div>
  );
};

export default DetalleDenuncia;
