import React, { useEffect, useState } from "react";
import { traerDocDenuncia } from "../../apis/apiDenuncia";
import { data } from "react-router-dom";

export const ArchivosDenuncia = ({id, onVerArchivo}) => {
    const [archivos, setArchivos] = useState([])

    useEffect(() => {
        const token = localStorage.getItem("token");
        traerDocDenuncia(id, token)
        .then((data) => setArchivos(data))
        .catch(() => setArchivos([]))
    }, [id])

  return (
    <>
      <h5 className="card-title mb-3">
        <i className="bi bi-paperclip me-2"></i>Archivos Adjuntos
      </h5>
      {archivos?.length > 0 ? (
        <ul className="list-group">
          {archivos.map((archivo, idx) => (
            <li className="list-group-item d-flex align-items-center" key={idx}>
              <i className="bi bi-file-earmark me-2"></i>
              <span className="me-auto">{archivo.nombreVisible}</span>
              <button
                className="btn btn-outline-primary btn-sm mr-2"
                onClick={() => onVerArchivo(archivo)}
              >
                Ver PDF
              </button>

              {/* <a
                href={archivo.formato}
                className="btn btn-outline-secondary btn-sm"
                download
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-download"></i>
              </a> */}
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-muted">No hay archivos adjuntos.</div>
      )}
    </>
  );
};
