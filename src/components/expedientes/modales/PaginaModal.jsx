import { useState } from "react";
import ReactQuill from "react-quill";
import { pdf } from "@react-pdf/renderer";
import { DocumentoPDF } from "./DocumentoPDF";
import "react-quill/dist/quill.snow.css";

const textosPredeterminados = {
  dictamen: "Texto predeterminado para Dictamen legal...",
  providencia: "Texto predeterminado para Providencia simple...",
  decreto: "Texto predeterminado para Decreto...",
  imputacion: "Texto predeterminado para Imputacion...",
  multa: "Texto predeterminado para Multa...",
};

export const PaginaModal = ({ handleSubmit, show, onClose }) => {
  const [tipo, setTipo] = useState("");
  const [texto, setTexto] = useState("");

  const handleTipoChange = (e) => {
    const value = e.target.value;
    setTipo(value);
    setTexto(textosPredeterminados[value] || "");
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit({ tipo, texto: texto.replace(/<[^>]+>/g, "") });
  };

  // nueva función para generar PDF y abrir firma
  const handleGenerarFirma = async () => {
    if (!tipo || !texto) return;

    // crear blob del PDF
    const blob = await pdf(<DocumentoPDF tipo={tipo} contenido={texto} />).toBlob();
    const pdfUrl = URL.createObjectURL(blob);

    // descargar PDF
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = "documento.pdf";
    a.click();

    // Abrir página de firma en nueva pestaña
    window.open("https://firmar.gob.ar/firmador/#/", "_blank");
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
            <button type="button" className="btn-close" onClick={onClose}></button>
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
                  <option value="dictamen">Dictamen Legal</option>
                  <option value="providencia">Providencia simple</option>
                  <option value="decreto">Decreto</option>
                  <option value="imputacion">Imputacion</option>
                  <option value="multa">Multa</option>
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
                      [{ header: [1, 2, 3, false] }],
                      ["bold", "italic", "underline"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      [{ align: [] }],
                      ["clean"],
                    ],
                  }}
                />
              </div>
              <div className="text-end mt-4 d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-secondary"
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
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleGenerarFirma}
                  disabled={!tipo || !texto}
                >
                  Generar Firma
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
