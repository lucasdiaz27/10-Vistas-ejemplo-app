import { useState } from 'react';

// componente de formulario para ingresar los datos del PDF
export default function FormularioPDF({ onPreview }) {
  // estados para los campos del formulario
  const [encabezado, setEncabezado] = useState(''); // Encabezado del PDF (opcional)
  const [cuerpo, setCuerpo] = useState('');         // Cuerpo del PDF (obligatorio)
  const [pie, setPie] = useState('');               // Pie de página del PDF (opcional)

  // esto maneja el envio del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    // es una validacion: el cuerpo es obligatorio
    if (!cuerpo.trim()) {
      alert('El cuerpo del PDF es obligatorio');
      return;
    }
    // se llama a la funcion recibida por props para previsualizar el PDF
    onPreview({ encabezado, cuerpo, pie });
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 bg-light rounded shadow-sm">
      <h4 className="mb-3">Generar PDF</h4>
      {/* este es campo para el encabezado (opcional) */}
      <div className="mb-3">
        <label className="form-label">Encabezado (opcional)</label>
        <input
          type="text"
          className="form-control"
          value={encabezado}
          onChange={e => setEncabezado(e.target.value)}
        />
      </div>
      {/* campo para el cuerpo (obligatorio) */}
      <div className="mb-3">
        <label className="form-label">Cuerpo <span className="text-danger">*</span></label>
        <textarea
          className="form-control"
          rows={6}
          value={cuerpo}
          onChange={e => setCuerpo(e.target.value)}
          required
        />
      </div>
      {/* campo para el pie de pagina (opcional) */}
      <div className="mb-3">
        <label className="form-label">Pie de página (opcional)</label>
        <input
          type="text"
          className="form-control"
          value={pie}
          onChange={e => setPie(e.target.value)}
        />
      </div>
      {/* boton para previsualizar el PDF */}
      <button type="submit" className="btn btn-primary">Previsualizar PDF</button>
    </form>
  );
}
