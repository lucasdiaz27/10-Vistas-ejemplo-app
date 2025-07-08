import { useState } from "react";
import FormularioPDF from "./FormularioPDF";
import PreviewPDF from "./PreviewPDF";

// componente principal que maneja el flujo de generacion y previsualizacion de PDF
export default function GeneradorPDF() {
  // estado para guardar los datos del formulario
  const [datosPDF, setDatosPDF] = useState(null);

  // cuando el usuario previsualiza, guarda los datos y muestra el preview
  const handlePreview = (datos) => setDatosPDF(datos);

  // cuando el usuario vuelve, resetea el estado para mostrar el formulario
  const handleBack = () => setDatosPDF(null);

  return (
    <div>
      {/* si no hay datos, muestra el formulario. Si hay datos, muestra la previsualización */}
      {!datosPDF ? (
        <FormularioPDF onPreview={handlePreview} />
      ) : (
        <PreviewPDF datos={datosPDF} onBack={handleBack} />
      )}
    </div>
  );
}
