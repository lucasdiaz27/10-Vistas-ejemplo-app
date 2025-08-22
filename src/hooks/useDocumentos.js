import { useState } from "react";

export const useDocumentos = () => {
    const [pdfUrl, setPdfUrl] = useState(null);
    const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);

    const verDocumento = async (docId) => {
        try {
          const token = localStorage.getItem("token");
          const blob = await traerArchivoPDF(docId, token); // Ajusta el método si es necesario
          const url = URL.createObjectURL(blob);
    
          setPdfUrl(url);
          setArchivoSeleccionado(docId);
        } catch (err) {
          alert("No se pudo visualizar el documento");
        }
    };

    return { verDocumento, pdfUrl, archivoSeleccionado };
}