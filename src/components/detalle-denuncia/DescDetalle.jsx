import React from "react";

export const DescDetalle = ({denuncia}) => {
  return (
    <>
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">
            <i className="bi bi-info-circle me-2"></i>Información General
          </h5>
          <div className="mb-3">
            <div className="fw-bold">Descripción</div>
            <div>{denuncia.descripcion}</div>
          </div>
          <div className="mb-3">
            <div className="fw-bold">Objeto de la Denuncia</div>
            {denuncia.objeto?.map((o, idx) => (
              <span key={idx} className="badge bg-primary me-2">
                {o}
              </span>
            ))}
          </div>
          <div className="mb-3">
            <div className="fw-bold">Motivo</div>
            {denuncia.motivo?.map((m, idx) => (
              <span key={idx} className="badge bg-secondary me-2">
                {m}
              </span>
            ))}
          </div>
          <div className="d-flex gap-2">
            <div className="fw-bold">Desea ser notificado por correo:</div>
            <span>{denuncia.notificar ? "Si" : "No"}</span>
          </div>
        </div>
      </div>
    </>
  );
};
