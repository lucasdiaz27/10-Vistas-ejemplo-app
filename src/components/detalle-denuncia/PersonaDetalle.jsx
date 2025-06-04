import React from "react";

export const PersonaDetalle = ({personas, denuncia, tab, setTab}) => {
  return (
    <>
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">
            <i className="bi bi-people me-2"></i>Personas Involucradas
          </h5>
          <ul className="nav nav-tabs mb-3">
            {personas.map((p, idx) => (
              <li className="nav-item" key={p.label}>
                <button
                  className={`nav-link${tab === p.label ? " active" : ""}`}
                  onClick={() => setTab(p.label)}
                >
                  {p.label}
                </button>
              </li>
            ))}
          </ul>
          {personas.map(
            (p, idx) =>
              tab === p.label && (
                <div key={p.label}>
                  <div className="row mb-2">
                    <div className="col-md-6">
                      <div>
                        <b>Nombre Completo:</b> {p.nombre} {p.apellido}
                      </div>
                      <div>
                        <b>Email:</b> {p.email}
                      </div>
                      {console.log(p)}
                      <div>
                        <b>Domicilio:</b> {p.domicilio}
                      </div>
                      <div>
                        <b>Código Postal:</b> {p.cp}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div>
                        <b>Documento:</b> {p.documento}
                      </div>
                      <div>
                        <b>Teléfono:</b> {p.telefono}
                      </div>
                      <div>
                        <b>Localidad:</b> {p.localidad}
                      </div>
                      <div>
                        <b>Fax:</b> {p.fax}
                      </div>
                    </div>
                  </div>
                  {/* Delegado info si existe */}
                  {denuncia.personas?.[idx]?.nombreDelegado && (
                    <div className="mt-2">
                      <div className="fw-bold">Información del Delegado</div>
                      <div>
                        <b>Nombre:</b> {denuncia.personas[idx].nombreDelegado}{" "}
                        <b>Apellido:</b>{" "}
                        {denuncia.personas[idx].apellidoDelegado} <b>DNI:</b>{" "}
                        {denuncia.personas[idx].dniDelegado}
                      </div>
                    </div>
                  )}
                </div>
              )
          )}
        </div>
      </div>
    </>
  );
};
