import React from "react";

export function ModalCorreo({ show, observacion, setObservacion, onClose, onSend }) {
  if (!show) return null;
  return (
    <div
      className="modal fade show"
      style={{ display: "block", background: "rgba(0,0,0,0.3)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Mandar correo</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <div className="mb-2">
              <label className="form-label">Observación</label>
              <textarea
                className="form-control"
                rows={3}
                value={observacion}
                onChange={e => setObservacion(e.target.value)}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onSend}
              disabled={!observacion}
            >
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
