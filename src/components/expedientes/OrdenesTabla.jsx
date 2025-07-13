// OrdenesTabla.jsx
// Tabla para mostrar las órdenes asociadas al expediente, replica la estructura de la imagen ordenes-2.png
// Campos: Orden, Tipo de Documento, Número Documento, Referencia, Fecha de Asociación, Acciones
// El diseño sigue el estilo general del sistema y ocupa todo el ancho disponible
import React from "react";

export default function OrdenesTabla({ ordenes, onDescargar, onVer, onEliminar }) {
  return (
    <div className="table-responsive" style={{ width: '100%' }}>
      {/* Tabla de órdenes, estructura y diseño similar a la imagen proporcionada */}
      <table className="table table-bordered table-hover align-middle" style={{ minWidth: '100%' }}>
        <thead className="table-light">
          <tr>
            <th>Orden</th>
            <th>Tipo de Documento</th>
            <th>Número Documento</th>
            <th>Referencia</th>
            <th>Fecha de Asociación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ordenes.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center text-muted">No hay órdenes asociadas.</td>
            </tr>
          ) : (
            ordenes.map((orden, idx) => (
              <tr key={orden.id || idx}>
                {/* Id de la orden */}
                <td>{orden.id || '-'}</td>
                {/* Tipo de documento (ENUM o string) */}
                <td>{orden.tipoDocumento || '-'}</td>
                {/* Nombre del documento */}
                <td>{orden.numeroDocumento || '-'}</td>
                {/* Referencia asociada */}
                <td>{orden.referencia || '-'}</td>
                {/* Fecha de asociación, formateada si es necesario */}
                <td>{orden.fechaAsociacion ? new Date(orden.fechaAsociacion).toLocaleString() : '-'}</td>
                {/* Acciones: descargar, ver, eliminar */}
                <td>
                  {/* Descargar documento */}
                  <button className="btn btn-sm btn-outline-success me-2" title="Descargar" onClick={() => onDescargar(orden)}>
                    <i className="bi bi-download"></i>
                  </button>
                  {/* Visualizar documento */}
                  <button className="btn btn-sm btn-outline-info me-2" title="Visualizar" onClick={() => onVer(orden)}>
                    <i className="bi bi-eye"></i>
                  </button>
                  {/* Eliminar documento */}
                  <button className="btn btn-sm btn-outline-danger" title="Eliminar" onClick={() => onEliminar(orden.id)}>
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
