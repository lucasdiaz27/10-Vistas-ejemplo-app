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
            <div className="denuncias-grid" style={{
              display: 'grid',
              gap: '1.5rem',
              gridTemplateColumns: '1fr',
              height: 'calc(100vh - 200px)', // Altura ajustable restando el header
              gridTemplateRows: 'auto auto minmax(0, 1fr)', // Para que el scroll funcione correctamente
              overflow: 'hidden' // Evita scroll general
            }}>
              <div style={{ overflow: 'auto' }}>
                <DescDetalle denuncia={denuncia} />
              </div>
              
              <div style={{ overflow: 'auto' }}>
                <PersonaDetalle denuncia={denuncia} personas={personas} tab={personas[0].label} setTab={() => {}} />
              </div>
              
              <div className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div className="card-body d-flex flex-column h-100">
                  <div className="mb-3">
                    <h6 className="card-subtitle d-flex justify-content-between align-items-center">
                      <span>Estado Actual</span>
                      {denuncia.archivo && (
                        <a
                          href={`data:application/pdf;base64,${denuncia.archivo}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-primary btn-sm"
                        >
                          <i className="bi bi-file-pdf me-2"></i>
                          Ver documento
                        </a>
                      )}
                    </h6>
                    <div className="mt-2">
                      <span className={`badge rounded-pill bg-${estado.color} px-3 py-2 fs-6 fw-semibold`} style={{letterSpacing:1}}>
                        {estado.label}
                      </span>
                    </div>
                  </div>
                  
                  <div className="historial-estados" style={{ 
                    flex: 1,
                    overflowY: 'auto',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '0.5rem',
                    padding: '1rem'
                  }}>
                    <h6 className="mb-3">Historial de Estados</h6>
                    <div className="timeline">
                      {denuncia.historial && denuncia.historial.map((estado, index) => (
                        <div key={index} className="timeline-item mb-3 d-flex align-items-start">
                          <div className="timeline-marker me-3" style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: estado.color || '#6c757d',
                            marginTop: '6px'
                          }}></div>
                          <div className="timeline-content">
                            <div className="fw-semibold">{estado.estado}</div>
                            <small className="text-muted">
                              {new Date(estado.fecha).toLocaleString('es-AR')}
                            </small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {!denuncia.archivo && (
                    <p className="text-muted small mb-0 mt-3">
                      <i className="bi bi-info-circle me-2"></i>
                      No hay documentos adjuntos para esta denuncia
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleDenuncia;
