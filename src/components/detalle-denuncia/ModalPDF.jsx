import { Document, Page } from "react-pdf";

export const ModalPDF = ({ archivo, onClose, pdfUrl }) => (
  <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
    <div className="modal-dialog modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">{archivo.nombre}</h5>
          <button type="button" className="btn-close" onClick={onClose}></button>
        </div>
        <div className="modal-body" style={{ minHeight: 500 }}>
            <iframe
                src={pdfUrl}
                title={archivo.nombre}
                width="100%"
                height="600px"
                style={{ border: "none" }}
            ></iframe>
        </div>
      </div>
    </div>
  </div>
);