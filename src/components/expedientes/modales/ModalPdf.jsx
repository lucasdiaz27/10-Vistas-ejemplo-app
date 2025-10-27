import { useState } from "react";
import { PaginaModal } from "./PaginaModal";
import { pdf } from "@react-pdf/renderer";
import { DocumentoPDF } from "./DocumentoPDF";

export const ModalPdf = () => {
  const [showModal, setShowModal] = useState(false);
  const [pdfData, setPdfData] = useState(null);

  const handleSubmit = (datos) => {
    setPdfData(datos);
    setShowModal(false);
    abrirPDFEnNuevaPestana(datos);
  };

  const abrirPDFEnNuevaPestana = async (datos) => {
    // Crear documento PDF
    const blob = await pdf(<DocumentoPDF tipo={datos.tipo} contenido={datos.texto} />).toBlob();

    // Crear URLs
    const pdfUrl = URL.createObjectURL(blob);
    const downloadUrl = URL.createObjectURL(blob);

    // Abrir nueva pestaña
    const nuevaPestana = window.open("", "_blank");

    if (nuevaPestana) {
      nuevaPestana.document.write(`
        <html>
          <head>
            <title>Previsualización PDF</title>
            <style>
              body { margin: 0; font-family: Arial, sans-serif; }
              .container { display: flex; height: 100vh; }
              .viewer { flex: 1; }
              .sidebar { width: 200px; background: #f5f5f5; padding: 10px; display: flex; flex-direction: column; align-items: center; }
              button { padding: 10px 20px; margin-top: 10px; background: #007bff; color: white; border: none; cursor: pointer; border-radius: 4px; }
              button:hover { background: #0056b3; }
            </style>
          </head>
          <body>
            <div class="container">
              <iframe class="viewer" src="${pdfUrl}" style="width:100%; height:100%;" frameborder="0"></iframe>
              <div class="sidebar">
                <button id="firmarBtn">Generar firma</button>
              </div>
            </div>
            <script>
              document.getElementById('firmarBtn').onclick = function() {
                // Descargar PDF
                const a = document.createElement('a');
                a.href = "${downloadUrl}";
                a.download = "documento.pdf";
                a.click();

                // Abrir página de firma en nueva pestaña sin cerrar esta
                window.open('https://firmar.gob.ar/firmador/#/', '_blank');
              };
            </script>
          </body>
        </html>
      `);
    }
  };

  return (
    <div className="container p-3">
      <button
        className="btn btn-success"
        onClick={() => setShowModal(true)}
      >
        Nuevo PDF
      </button>

      <PaginaModal
        show={showModal}
        onClose={() => setShowModal(false)}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};
