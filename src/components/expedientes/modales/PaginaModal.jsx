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

 // maneja el envio del form
  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit({
      tipo,
      texto: texto.replace(/<[^>]+>/g, '') // remover tags HTML del editor
    });
  };

  return (
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
            <form onSubmit={handleFormSubmit}>
              <div className="mb-3">
                <label className="form-label">Tipo de Documento</label>
                <select
                  className="form-select"
                  value={tipo}
                  onChange={handleTipoChange}
                  required
                >
                  <option value="">Seleccionar...</option>
                  <option value="dictamen">Dictamen</option>
                  <option value="nota">Nota</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Contenido del Documento</label>
                <ReactQuill 
                  value={texto} 
                  onChange={setTexto} 
                  theme="snow"
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, 3, false] }],
                      ['bold', 'italic', 'underline'],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      [{ 'align': [] }],
                      ['clean']
                    ]
                  }}
                />
              </div>
              <div className="text-end mt-4">
                <button
                  type="button"
                  className="btn btn-secondary me-2"
                  onClick={onClose}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={!tipo || !texto}
                >
                  Generar PDF
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}


//mucha paja explicar pero bueno no es la grna modificacion