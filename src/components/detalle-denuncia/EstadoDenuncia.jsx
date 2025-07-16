import React from "react";

export function EstadoDenuncia({
  estadoActual,
  estadoNuevo,
  onChange,
  ESTADOS,
  onCorreo,
  showMotivo,
  motivoCambio,
  setMotivoCambio,
  onEnviarMotivo,
}) {
  return (
    <>
      <div className="mb-2">
        <label className="form-label fw-bold">Estado actual</label>
        <select
          className="form-select"
          value={estadoNuevo || estadoActual}
          onChange={onChange}
        >
          <option value="">{estadoActual}</option>
          {ESTADOS.filter(estado => estado !== estadoActual).map((estado) => (
            <option key={estado} value={estado}>
              {estado}
            </option>
          ))}
        </select>
        {/* Botón para mandar correo */}
        <button
          className="btn btn-outline-secondary mt-2"
          onClick={onCorreo}
          type="button"
        >
          Mandar correo
        </button>
      </div>
      {showMotivo && (
        <div className="mb-2">
          <label className="form-label">Motivo del cambio de estado</label>
          <textarea
            className="form-control"
            rows={3}
            value={motivoCambio}
            onChange={e => setMotivoCambio(e.target.value)}
          />
          <button
            className="btn btn-primary mt-2"
            onClick={onEnviarMotivo}
            disabled={!motivoCambio}
          >
            Enviar
          </button>
        </div>
      )}
    </>
  );
}
