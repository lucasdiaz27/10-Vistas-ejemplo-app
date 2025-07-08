// componente para previsualizar y guardar el PDF generado
import { PDFViewer, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { pdfDocumentToBlob, uploadPDF } from './PDFService';
import { useState } from 'react';

// estilos básicos para el PDF
const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 14 },
  encabezado: { fontSize: 18, marginBottom: 16, textAlign: 'center', fontWeight: 'bold' },
  cuerpo: { marginBottom: 16, textAlign: 'justify' },
  pie: { fontSize: 12, marginTop: 32, textAlign: 'center', color: '#888' },
});

// componente principal
export default function PreviewPDF({ datos, onBack }) {
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  // documento PDF generado dinámicamente
  const MyDocument = (
    <Document>
      <Page style={styles.page}>
        {datos.encabezado && <Text style={styles.encabezado}>{datos.encabezado}</Text>}
        <Text style={styles.cuerpo}>{datos.cuerpo}</Text>
        {datos.pie && <Text style={styles.pie}>{datos.pie}</Text>}
      </Page>
    </Document>
  );

  // maneja el guardado del PDF en el backend
  const handleGuardar = async () => {
    setGuardando(true);
    setMensaje("");
    try {
      const blob = await pdfDocumentToBlob(MyDocument);
      const token = localStorage.getItem("token");
      await uploadPDF(blob, 'documento.pdf', token);
      setMensaje("¡PDF guardado exitosamente!");
    } catch (err) {
      setMensaje("Error al guardar el PDF");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="my-4">
      <h5 className="mb-3">Previsualización del PDF</h5>
      <div style={{ border: '1px solid #ccc', minHeight: 500 }}>
        <PDFViewer width="100%" height={500} showToolbar>
          {MyDocument}
        </PDFViewer>
      </div>
      <div className="mt-3 d-flex gap-2">
        <button className="btn btn-secondary" onClick={onBack} disabled={guardando}>Volver</button>
        <button className="btn btn-success" onClick={handleGuardar} disabled={guardando}>
          {guardando ? 'Guardando...' : 'Guardar PDF'}
        </button>
      </div>
      {mensaje && <div className="mt-2 alert alert-info">{mensaje}</div>}
    </div>
  );
}