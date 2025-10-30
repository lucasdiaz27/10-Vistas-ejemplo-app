// OrdenesTabla.jsx
import React from "react";

// 1. Añadimos la nueva prop "onEditar"
export default function OrdenesTabla({ ordenes, onDescargar, onVer, onEditar, onEliminar, mostrarModalOrden }) {
  return (
    <div className="table-responsive" style={{ width: '100%' }}>
      {/* Botón de Agregar Orden (sin cambios) */}
      <div className="d-flex justify-content-end mb-2">
        <button className="btn btn-primary" onClick={mostrarModalOrden}>
          <i className="bi bi-plus-circle me-1"></i> Agregar Orden
        </button>
      </div>

      <table className="table table-bordered table-hover align-middle" style={{ minWidth: '100%' }}>
        <thead className="table-light">
          <tr>
            <th>Orden</th>
            <th>Tipo de Documento</th>
            <th>Nombre Documento</th>
            <th>Referencia</th>
            <th>Fecha de Asociación</th>
            <th className="text-center">Acciones</th> {/* Centramos el título de acciones */}
          </tr>
        </thead>
        <tbody>
          {ordenes.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center text-muted">No hay órdenes asociadas.</td>
            </tr>
          ) : (
            ordenes.map((orden, idx) => (
              <tr key={orden.orden || idx}>
                <td>{orden.id || '-'}</td>
                <td>{orden.tipoDocumento || '-'}</td>
                <td>{orden.nombreVisible || '-'}</td>
                <td>{orden.referencia || '-'}</td>
                <td>{orden.fechaCreacion ? new Date(orden.fechaCreacion).toLocaleString() : '-'}</td>
                
                {/* 2. Modificamos la celda de Acciones */}
                <td className="text-center">
                  {/* Usamos un btn-group para agrupar los botones */}
                  <div className="btn-group btn-group-sm" role="group" aria-label="Acciones de orden">

                    {/* Descargar documento */}
                    <button type="button" className="btn btn-outline-success" title="Descargar" onClick={() => onDescargar(orden)}>
                      <i className="bi bi-download"></i>
                    </button>

                    {/* Visualizar documento */}
                    <button type="button" className="btn btn-outline-info" title="Visualizar" onClick={() => onVer(orden)}>
                      <i className="bi bi-eye"></i>
                    </button>

                    {/* --- 🚀 NUEVO BOTÓN DE EDITAR --- */}
                    <button type="button" className="btn btn-outline-primary" title="Editar" onClick={() => onEditar(orden)}>
                      <i className="bi bi-pencil-fill"></i>
                    </button>
                    {/* --- FIN NUEVO BOTÓN --- */}

                    {/* Eliminar documento */}
                    <button type="button" className="btn btn-outline-danger" title="Eliminar" onClick={() => onEliminar(orden)}>
                      <i className="bi bi-x-circle"></i>
                    </button>
                    
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
