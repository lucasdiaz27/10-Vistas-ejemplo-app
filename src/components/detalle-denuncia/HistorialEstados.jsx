// components/detalle-denuncia/HistorialEstados.jsx
import React from "react";
import "./HistorialEstados.css";

export const HistorialEstados = ({ historial }) => {
  if (!historial || historial.length === 0) {
    return <p className="text-muted">No hay historial disponible.</p>;
  }

  // Ordenamos por fecha descendente si no vienen ordenados
  const historialOrdenado = [...historial].sort(
    (a, b) => new Date(b.fechaHora) - new Date(a.fechaHora)
  );

  const estadoColor = {
    "ADMITIDO": "success",
    "RECHAZADO": "danger", 
    "ASESORÍA. LEGAL": "info",
    "EN INSPECCIÓN": "warning",
    "EN SUBDIRECCIÓN": "primary",
    "EN DIRECCIÓN": "primary",
    "FINALIZADO": "success",
    // Estados en minúsculas para compatibilidad
    "admitido": "success",
    "rechazado": "danger", 
    "asesoría legal": "info",
    "en inspección": "warning",
    "en subdireccion": "primary",
    "en dirección": "primary",
    "finalizado": "success",
    // Estados anteriores para compatibilidad
    "NO ADMITIDO": "danger",
    "PENDIENTE": "warning",
    "EN PROCESO": "primary",
    "EN REVISIÓN": "warning",
  };

  return (
    <div className="historial-estados">
      <h6 className="fw-bold mb-3">Historial de estados</h6>
      <div className="historial-container" style={{
        maxHeight: '200px',
        overflowY: 'auto',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        padding: '1rem',
        boxShadow: 'inset 0 0 5px rgba(0,0,0,0.05)'
      }}>
        <ul className="list-unstyled mb-0">
          {historialOrdenado.map((item, idx) => (
            <li key={idx} className="timeline-item mb-3" style={{
              position: 'relative',
              paddingLeft: '20px',
              borderLeft: '2px solid #dee2e6'
            }}>
              <span
                className="timeline-dot"
                style={{
                  position: 'absolute',
                  left: '-5px',
                  top: '8px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: `var(--bs-${estadoColor[item.estado] || "secondary"})`,
                  border: '2px solid white'
                }}
              ></span>
              <div className="timeline-content">
                <strong className="d-block">{item.estado}</strong>
                <small className="text-muted d-block">
                  {new Date(item.fecha).toLocaleString("es-AR")}
                </small>
                {item.descripcion && (
                  <small className="text-secondary d-block mt-1">
                    {item.descripcion}
                  </small>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
