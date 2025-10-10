import React, { useState, useMemo } from "react";
import { FaEye } from "react-icons/fa";

const estadoConfig = {
  // Estados principales
  "ADMITIDO": { label: "ADMITIDO", color: "success" },
  "RECHAZADO": { label: "RECHAZADO", color: "danger" },
  "AS. LEGAL": { label: "ASESORÍA LEGAL", color: "info" },
  "EN PROCESO": { label: "EN PROCESO", color: "info" },
  "EN INSPECCIÓN": { label: "EN INSPECCIÓN", color: "warning" },
  "EN SUBDIR": { label: "EN SUBDIRECCIÓN", color: "primary" },
  "EN DIR": { label: "EN DIRECCIÓN", color: "primary" },
  "FINALIZADO": { label: "FINALIZADO", color: "success" },
  // Estados en minúsculas para compatibilidad con datos existentes
  "admitido": { label: "ADMITIDO", color: "success" },
  "rechazado": { label: "RECHAZADO", color: "danger" },
  "as. legal": { label: "ASESORÍA LEGAL", color: "info" },
  "en proceso": { label: "EN PROCESO", color: "info" },
  "en inspección": { label: "EN INSPECCIÓN", color: "warning" },
  "en subdir": { label: "EN SUBDIRECCIÓN", color: "primary" },
  "en dir": { label: "EN DIRECCIÓN", color: "primary" },
  "finalizado": { label: "FINALIZADO", color: "success" },
  // Estados anteriores para compatibilidad
  "pendiente": { label: "PENDIENTE", color: "warning" },
  "aprobada": { label: "APROBADA", color: "success" },
  "no admitido": { label: "NO ADMITIDO", color: "secondary" },
  "rechazada": { label: "RECHAZADA", color: "danger" },
  "completado": { label: "COMPLETADO", color: "success" },
};

const MesaEntradaTabla = ({ denuncias, filtroEstado, setFiltroEstado, busquedaDenuncia, setBusquedaDenuncia, abrirDetalle, aceptar, rechazar }) => {
  // Estados para la paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [elementosPorPagina, setElementosPorPagina] = useState(10);

  // Filtrar denuncias basado en búsqueda y estado
  const denunciasFiltradas = useMemo(() => {
    return denuncias.filter((d) => {
      const texto = busquedaDenuncia.toLowerCase();
      const estadoDenuncia = (d.estado || "").toLowerCase().trim();
      const estadoFiltro = (filtroEstado || "").toLowerCase().trim();
      
      return (
        (!filtroEstado || estadoDenuncia === estadoFiltro) &&
        (d.id?.toString().includes(texto) ||
          (d.solicitante || "").toLowerCase().includes(texto) ||
          (d.objeto || "").toLowerCase().includes(texto) ||
          (d.motivo || "").toLowerCase().includes(texto) ||
          (d.descripcion || "").toLowerCase().includes(texto) ||
          (d.fechaIngreso || "").toLowerCase().includes(texto))
      );
    });
  }, [denuncias, busquedaDenuncia, filtroEstado]);

  // Calcular datos de paginación
  const totalPaginas = Math.ceil(denunciasFiltradas.length / elementosPorPagina);
  const indiceInicio = (paginaActual - 1) * elementosPorPagina;
  const indiceFin = indiceInicio + elementosPorPagina;
  const denunciasPaginadas = denunciasFiltradas.slice(indiceInicio, indiceFin);

  // Funciones de paginación
  const irAPagina = (pagina) => {
    setPaginaActual(Math.max(1, Math.min(pagina, totalPaginas)));
  };

  const cambiarElementosPorPagina = (cantidad) => {
    setElementosPorPagina(cantidad);
    setPaginaActual(1); // Resetear a la primera página
  };

  // Generar números de página para mostrar
  const generarNumerosPagina = () => {
    const numeros = [];
    const maxVisibles = 5;
    let inicio = Math.max(1, paginaActual - Math.floor(maxVisibles / 2));
    let fin = Math.min(totalPaginas, inicio + maxVisibles - 1);
    
    if (fin - inicio < maxVisibles - 1) {
      inicio = Math.max(1, fin - maxVisibles + 1);
    }

    for (let i = inicio; i <= fin; i++) {
      numeros.push(i);
    }
    return numeros;
  };
  return (
    <>
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body pb-2">
          <h2 className="fw-bold mb-4" style={{fontSize: '2rem'}}>Mesa de Entrada - Denuncias</h2>
          <div className="bg-light border p-3 mb-0" style={{ borderTopLeftRadius: '0.5rem', borderTopRightRadius: '0.5rem', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
            <div className="row g-2 align-items-center">
              <div className="col-md-8 col-12 mb-2 mb-md-0">
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0"><i className="bi bi-search" /></span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Buscar por ID, solicitante, objeto, motivo, descripción o fecha"
                    value={busquedaDenuncia}
                    onChange={e => setBusquedaDenuncia(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-4 col-12 d-flex justify-content-md-end justify-content-start gap-2">
                <select
                  className="form-select"
                  value={filtroEstado}
                  onChange={e => setFiltroEstado(e.target.value)}
                  style={{ minWidth: 160 }}
                >
                  <option value="">Todos</option>
                  <option value="ADMITIDO">ADMITIDO</option>
                  <option value="RECHAZADO">RECHAZADO</option>
                  <option value="AS. LEGAL">ASESORÍA LEGAL</option>
                  <option value="EN PROCESO">EN PROCESO</option>
                  <option value="EN INSPECCIÓN">EN INSPECCIÓN</option>
                  <option value="EN SUBDIR">EN SUBDIRECCIÓN</option>
                  <option value="EN DIR">EN DIRECCIÓN</option>
                  <option value="FINALIZADO">FINALIZADO</option>
                </select>
                <select
                  className="form-select"
                  value={elementosPorPagina}
                  onChange={e => cambiarElementosPorPagina(Number(e.target.value))}
                  style={{ minWidth: 120 }}
                >
                  <option value={5}>5 por página</option>
                  <option value={10}>10 por página</option>
                  <option value={25}>25 por página</option>
                  <option value={50}>50 por página</option>
                </select>

              </div>
            </div>
          </div>
          <div className="table-responsive" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0, overflow: 'hidden' }}>
            <table className="table table-hover align-middle mb-0" style={{ minWidth: 900, maxWidth: '100%' }}>
              <thead className="table-primary">
                <tr>
                  <th>ID</th>
                  <th>Solicitante</th>
                  <th>Objeto</th>
                  <th>Motivo</th>
                  <th>Descripción</th>
                  <th>Fecha de Ingreso</th>
                  <th>Estado</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {denunciasPaginadas.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center text-muted">No hay denuncias que coincidan con el filtro.</td>
                  </tr>
                ) : (
                  denunciasPaginadas.map((d, idx) => {
                    const estadoKey = (d.estado || "").toLowerCase().trim();
                    const estado = estadoConfig[estadoKey] || { label: d.estado || "Sin estado", color: "secondary" };
                    return (
                      <tr key={idx}>
                        <td>{d.id}</td>
                        <td>{d.solicitante}</td>
                        <td>{d.objeto}</td>
                        <td>{d.motivo}</td>
                        <td>{d.descripcion}</td>
                        <td>{d.fechaIngreso}</td>
                        <td>
                          <span className={`badge bg-${estado.color}`}>
                            {estado.label}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2 justify-content-center">
                            <button
                              className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1 px-2 py-1"
                              title="Ver detalles"
                              onClick={() => abrirDetalle(d)}
                            >
                              <FaEye /> <span className="d-none d-md-inline">Detalle</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          
          {/* Controles de Paginación */}
          {denunciasFiltradas.length > 0 && (
            <div className="bg-light border-top p-3 d-flex justify-content-between align-items-center" style={{ borderBottomLeftRadius: '0.5rem', borderBottomRightRadius: '0.5rem' }}>
              <div className="text-muted">
                Mostrando {indiceInicio + 1} a {Math.min(indiceFin, denunciasFiltradas.length)} de {denunciasFiltradas.length} denuncias
              </div>
              {totalPaginas > 1 && (
                <nav aria-label="Paginación de denuncias">
                  <ul className="pagination pagination-sm mb-0">
                    <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => irAPagina(1)}
                        disabled={paginaActual === 1}
                      >
                        <i className="bi bi-chevron-double-left"></i>
                      </button>
                    </li>
                    <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => irAPagina(paginaActual - 1)}
                        disabled={paginaActual === 1}
                      >
                        <i className="bi bi-chevron-left"></i>
                      </button>
                    </li>
                    
                    {generarNumerosPagina().map(numero => (
                      <li key={numero} className={`page-item ${paginaActual === numero ? 'active' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => irAPagina(numero)}
                        >
                          {numero}
                        </button>
                      </li>
                    ))}
                    
                    <li className={`page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => irAPagina(paginaActual + 1)}
                        disabled={paginaActual === totalPaginas}
                      >
                        <i className="bi bi-chevron-right"></i>
                      </button>
                    </li>
                    <li className={`page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => irAPagina(totalPaginas)}
                        disabled={paginaActual === totalPaginas}
                      >
                        <i className="bi bi-chevron-double-right"></i>
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MesaEntradaTabla;
