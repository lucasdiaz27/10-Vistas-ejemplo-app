import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const textosPredeterminados = {
  dictamen: "Texto predeterminado para Dictamen...",
  nota: "Texto predeterminado para Nota...",
  otro: "Otro texto predeterminado...",
};

export const PaginaModal =({handleSubmit, show, onClose}) => {
  const [tipo, setTipo] = useState("");
  const [texto, setTexto] = useState("");
  const handleTipoChange = (e) => {
    const value = e.target.value;
    setTipo(value);
    setTexto(textosPredeterminados[value] || "");
  };

  return (
    <>

    <div
      className={`modal fade ${show ? "show d-block" : ""}`}
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Nuevo Documento</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Texto predeterminado</label>
                <select
                  className="form-select"
                  value={tipo}
                  onChange={handleTipoChange}
                >
                  <option value="">Seleccionar...</option>
                  <option value="dictamen">Dictamen</option>
                  <option value="nota">Nota</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Texto</label>
                <ReactQuill value={texto} onChange={setTexto} theme="snow" />
              </div>
              <div className="text-end">
                <button
                  type="button"
                  className="btn btn-secondary me-2"
                  onClick={onClose}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Enviar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
