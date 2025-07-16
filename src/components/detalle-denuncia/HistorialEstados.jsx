// components/detalle-denuncia/HistorialEstados.jsx
import React from "react";

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
    "AS. LEGAL": "info",
    "EN INSPECCIÓN": "warning",
    "EN SUBDIR": "primary",
    "EN DIR": "primary",
    "FINALIZADO": "success",
    // Estados en minúsculas para compatibilidad
    "admitido": "success",
    "rechazado": "danger", 
    "as. legal": "info",
    "en inspección": "warning",
    "en subdir": "primary",
    "en dir": "primary",
    "finalizado": "success",
    // Estados anteriores para compatibilidad
    "NO ADMITIDO": "danger",
    "PENDIENTE": "warning",
    "EN PROCESO": "primary",
    "EN REVISIÓN": "warning",
  };

  return (
    <div>
      <h6 className="fw-bold mb-2">Historial de estados</h6>
      <ul className="list-unstyled">
        {historialOrdenado.map((item, idx) => (
          <li key={idx} className="mb-2">
            <span
              className={`badge bg-${estadoColor[item.estado] || "secondary"} me-2`}
              style={{ width: "10px", height: "10px", borderRadius: "50%" }}
            ></span>
            <strong>{item.estado}</strong> -{" "}
            <span className="text-muted">
              {console.log(historialOrdenado.map(i => i.fecha))}
              {new Date(item.fecha).toLocaleString("es-AR")}
            </span>
            <br />
            <small className="text-secondary">{item.descripcion}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};
