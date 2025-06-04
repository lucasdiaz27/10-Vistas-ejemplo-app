// DetalleExpediente.jsx

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { traerExpedientePorId } from "../../apis/expedientesApi";
export default function DetalleExpediente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expediente, setExpediente] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExpediente = async () => {
      try {
        const data = await traerExpedientePorId(id);
        setExpediente(data);
      } catch (err) {
        setError('Error al cargar el expediente');
      } finally {
        setCargando(false);
      }
    };

    fetchExpediente();
  }, [id]);

  if (cargando) return <div className="container mt-4">Cargando expediente...</div>;
  if (error) return <div className="alert alert-danger mt-4">{error}</div>;

  const denunciante = expediente.denuncia?.personas?.find(
    p => (p.rol || "").toLowerCase() === "denunciante"
  );

  return (
    <div className="container mt-4">
      <button className="btn btn-outline-secondary mb-3" onClick={() => navigate(-1)}>
        <i className="bi bi-arrow-left"></i> Volver
      </button>
      <div className="card">
        <div className="card-header">
          <h4>Detalle del Expediente #{expediente.id}</h4>
        </div>
        <div className="card-body">
          <p><strong>Número de Orden:</strong> {expediente.nro_exp ?? expediente.id}</p>
          <p><strong>Cant. folios:</strong> {expediente.cant_folios ?? "-"}</p>
          <p><strong>Fecha de ingreso:</strong> {expediente.fecha_inicio ?? "-"}</p>
          <p><strong>Fecha de finalización:</strong> {expediente.fecha_finalizacion ?? "-"}</p>
          <p><strong>Hipervulnerable:</strong> {expediente.hipervulnerable ?? "-"}</p>
          <p><strong>Delegación:</strong> {expediente.delegacion ?? "-"}</p>
          <p><strong>Motivo:</strong> {expediente.denuncia?.motivo?.join(", ") ?? "-"}</p>
          <p><strong>Estado:</strong> {expediente.denuncia?.estado ?? "-"}</p>
          <p><strong>Denunciante:</strong> {denunciante ? `${denunciante.nombre} ${denunciante.apellido}` : "-"}</p>
          <p><strong>DNI Denunciante:</strong> {denunciante ? denunciante.documento : "-"}</p>
          {/* Podés agregar más campos según lo que necesites */}
          {expediente.denuncia?.personas?.map(persona => (
            <p key={persona.id}>
              <strong>{persona.rol.charAt(0).toUpperCase() + persona.rol.slice(1)}:</strong> {persona.nombre} {persona.apellido} - DNI: {persona.documento}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
