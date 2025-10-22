// src/components/pases/modales/ModalVerPase.jsx

import React from 'react';


export default function ModalVerPase({ onClose, pase }) {
    // si no hay pases para mostrar, mejor no se renderiza nada para evitar errores
    if (!pase) return null;

    // funcion placeholder para manejar la descarga de adjuntos
    const handleDescargar = (documentoId, nombreArchivo) => {
        console.log(`Descargando archivo con ID: ${documentoId}`);
        // aqui iria la logica de descarga, por ejemplo:
        // descargarDocumentoPase(documentoId, nombreArchivo)
        //     .catch(err => alert("Error al descargar el archivo"));
    };

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Detalle del Pase</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <p><strong>Fecha de Acción:</strong> {pase.fechaAccion ? new Date(pase.fechaAccion).toLocaleString() : 'N/A'}</p>
                        <p><strong>Asunto:</strong> {pase.asunto || 'N/A'}</p>
                        <p><strong>Iniciador:</strong> {pase.nombreUsuario || 'N/A'}</p>
                        <hr/>
                        <p><strong>Área Origen:</strong> {pase.areaOrigen || 'N/A'}</p>
                        <p><strong>Área Destino:</strong> {pase.areaDestino || 'N/A'}</p>
                        <hr/>
                        <p><strong>Descripción:</strong></p>
                        <p style={{ whiteSpace: 'pre-wrap' }}>{pase.descripcion || 'Sin descripción.'}</p>
                        <hr/>
                        <p><strong>Cantidad de Folios:</strong> {pase.cantFolios || 0}</p>
                        
                        {/* Renderizado dinámico de adjuntos si existen */}
                        {pase.documentos && pase.documentos.length > 0 && (
                            <>
                                <hr />
                                <p className="fw-bold">Adjuntos</p>
                                <ul>
                                    {pase.documentos.map(doc => (
                                        <li key={doc.id}>
                                            {doc.nombre}
                                            <button 
                                                className="btn btn-sm btn-outline-primary ms-2"
                                                onClick={() => handleDescargar(doc.id, doc.nombre)}
                                                title="Descargar"
                                            >
                                                <i className="bi bi-download"></i>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}