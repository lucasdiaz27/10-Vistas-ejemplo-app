// convierte el PDF y maneja el envío al backend
import { pdf } from '@react-pdf/renderer';
import axios from 'axios';

// recibe un documento PDF de @react-pdf/renderer y lo convierte a Blob
export async function pdfDocumentToBlob(pdfDoc) {
  const asPdf = pdf([]);
  asPdf.updateContainer(pdfDoc);
  const blob = await asPdf.toBlob();
  return blob;
}

// manda el PDF al back usando FormData y axios
export async function uploadPDF(blob, nombreArchivo = 'documento.pdf', token) {
  const formData = new FormData();
  formData.append('file', blob, nombreArchivo);
  // si back espera otros campos hay que agregarlos aquí
  return axios.post('http://localhost:8080/tu-endpoint/subirArchivos', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });
}
