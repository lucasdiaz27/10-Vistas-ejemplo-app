// Utilidad para contar páginas de un PDF usando pdf-lib en Vite
import { PDFDocument } from 'pdf-lib';

/**
 * Recibe un archivo PDF y devuelve la cantidad de páginas
 * @param {File} file
 * @returns {Promise<number>}
 */
export async function contarPaginasPDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  return pdfDoc.getPageCount();
}
