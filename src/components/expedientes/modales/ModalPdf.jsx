import { useState } from "react";
import { PaginaModal } from "./PaginaModal";
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer'; //nuevas importacion que tampoco pienos desarrollar lean
import { DocumentoPDF } from './DocumentoPDF';

export const ModalPdf = () => {
  const [showModal, setShowModal] = useState(false);
  const [pdfData, setPdfData] = useState(null); //paisano aqui te lo puse un nuevo estado para que se almacenen los datos del pdf 

  const handleSubmit = (data) => {
    // pa guardar los datos del PDF:
    setPdfData(data); // guarda datos para generar el pdf
    setShowModal(false); //cierra el modal
  };

  return (
    <div className="container p-3">
      <button
        className="btn btn-success"
        onClick={() => setShowModal(true)}
      >
        Nuevo PDF
      </button>

      {/* modal para editar el contenido */}
      <PaginaModal
        show={showModal}
        onClose={() => setShowModal(false)}
        handleSubmit={handleSubmit}
      />

      {/* previsualizacion y descarga del PDF */}
      {pdfData && (
        <div className="mt-4">
          <h4>Previsualización del documento</h4>
          <div className="mb-3"> 
            <PDFDownloadLink //boton pa descargar el pdf
              document={<DocumentoPDF tipo={pdfData.tipo} contenido={pdfData.texto} />}
              fileName={`documento_${pdfData.tipo}.pdf`}
              className="btn btn-primary me-2"
            >
              {({ loading }) =>
                loading ? 'Generando documento...' : 'Descargar PDF'
              }
            </PDFDownloadLink>
          </div> 
          <PDFViewer style={{ width: '100%', height: '600px' }}>
            <DocumentoPDF tipo={pdfData.tipo} contenido={pdfData.texto} />
          </PDFViewer>
        </div>
      )} 
    </div>
  );// lo ultimo es el visor del pdf osea lo del pdfviwer
}