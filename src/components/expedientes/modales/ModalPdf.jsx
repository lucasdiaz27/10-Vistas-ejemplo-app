import { useState } from "react";
import { PaginaModal } from "./PaginaModal";

export const ModalPdf = () => {
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (data) => {
    console.log("Datos enviados:", data);
    // acá podés mandar a tu backend o generar el PDF
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
}