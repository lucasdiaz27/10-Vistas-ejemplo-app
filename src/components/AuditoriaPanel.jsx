import React, { useEffect, useState, useMemo } from 'react';
import { traerLogsAuditoria } from '../apis/auditoriaApi';
import Swal from 'sweetalert2';

const AuditoriaPanel = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState('');
    const [paginaActual, setPaginaActual] = useState(1);
    const [elementosPorPagina, setElementosPorPagina] = useState(10);

    useEffect(() => {
        const cargarLogs = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const data = await traerLogsAuditoria(token);
                // Aseguramos que data sea array. Si es objeto paginado, adaptar aquí.
                // Asumo array por lo visto en traerLogsAuditoria.
                setLogs(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error cargando auditoría:", error);
                // Manejo de errores de autenticación visual
                if (error.response?.status === 401 || error.response?.status === 403) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Acceso Restringido',
                        text: 'Tu sesión expiró o no tienes permisos.',
                        confirmButtonColor: '#ff9800'
                    });
                }
            } finally {
                setLoading(false);
            }
        };
        cargarLogs();
    }, []);

    // Filtrado
    const logsFiltrados = useMemo(() => {
        return logs.filter(log => {
            const texto = busqueda.toLowerCase();
            // Buscamos en varios campos para mejor UX
            // Ajusta las propiedades 'usuario', 'accion', etc. según tu DTO real
            return (
                String(log.id || '').toLowerCase().includes(texto) ||
                String(log.usuario || log.username || '').toLowerCase().includes(texto) ||
                String(log.accion || '').toLowerCase().includes(texto) ||
                String(log.descripcion || log.detalle || '').toLowerCase().includes(texto) ||
                String(log.ipOrigen || log.ipCliente || log.ip || '').toLowerCase().includes(texto)
            );
        });
    }, [logs, busqueda]);

    // Paginación
    const totalPaginas = Math.ceil(logsFiltrados.length / elementosPorPagina);
    const indiceInicio = (paginaActual - 1) * elementosPorPagina;
    const indiceFin = indiceInicio + elementosPorPagina;
    const logsPaginados = logsFiltrados.slice(indiceInicio, indiceFin);

    const irAPagina = (pagina) => setPaginaActual(Math.max(1, Math.min(pagina, totalPaginas)));

    if (loading) return <div className="p-5 text-center text-muted"><h4><i className="bi bi-arrow-repeat spin me-2"></i>Cargando registros de auditoría...</h4></div>;

    return (
        <div className="container mt-4">
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-body pb-2">
                    <h2 className="fw-bold mb-4" style={{ fontSize: '2rem' }}>Panel de Auditoría</h2>

                    {/* Filtros y Controles (Estilo Mesa Entrada) */}
                    <div className="bg-light border p-3 mb-0" style={{ borderTopLeftRadius: '0.5rem', borderTopRightRadius: '0.5rem', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
                        <div className="row g-2 align-items-center">

                            {/* Buscador */}
                            <div className="col-md-8 col-12 mb-2 mb-md-0">
                                <div className="input-group">
                                    <span className="input-group-text bg-white border-end-0"><i className="bi bi-search" /></span>
                                    <input
                                        type="text"
                                        className="form-control border-start-0"
                                        placeholder="Buscar por Usuario, Acción, Detalle, ID..."
                                        value={busqueda}
                                        onChange={e => { setBusqueda(e.target.value); setPaginaActual(1); }}
                                    />
                                </div>
                            </div>

                            {/* Selector de Cantidad */}
                            <div className="col-md-4 col-12 d-flex justify-content-md-end justify-content-start gap-2">
                                <span className="align-self-center text-muted small d-none d-md-block">Mostrar:</span>
                                <select
                                    className="form-select"
                                    value={elementosPorPagina}
                                    onChange={e => { setElementosPorPagina(Number(e.target.value)); setPaginaActual(1); }}
                                    style={{ minWidth: 120 }}
                                >
                                    <option value={10}>10</option>
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Tabla */}
                    <div className="table-responsive" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0, overflow: 'hidden' }}>
                        <table className="table table-hover align-middle mb-0" style={{ minWidth: 900, maxWidth: '100%' }}>
                            <thead className="table-primary">
                                <tr>
                                    <th>ID</th>
                                    <th>Fecha</th>
                                    <th>Usuario</th>
                                    <th>Acción</th>
                                    <th>Detalle</th>
                                    <th>IP</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logsPaginados.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center text-muted py-5">
                                            <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                                            No se encontraron registros que coincidan con la búsqueda.
                                        </td>
                                    </tr>
                                ) : (
                                    logsPaginados.map((log, idx) => (
                                        <tr key={log.id || idx}>
                                            <td className="fw-bold text-muted">#{log.id}</td>
                                            <td>{log.fechaHora ? new Date(log.fechaHora).toLocaleString() : (log.fecha ? new Date(log.fecha).toLocaleString() : '-')}</td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="bg-light rounded-circle p-1 me-2 border d-flex justify-content-center align-items-center" style={{ width: 32, height: 32 }}>
                                                        <i className="bi bi-person text-secondary"></i>
                                                    </div>
                                                    <span className="fw-semibold">{log.usuario || log.username || 'Sistema'}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`badge ${log.accion === 'LOGIN' ? 'bg-success' : log.accion === 'ERROR' ? 'bg-danger' : 'bg-info text-dark'}`}>
                                                    {log.accion}
                                                </span>
                                            </td>
                                            <td className="text-truncate" style={{ maxWidth: '350px' }} title={log.descripcion || log.detalle}>
                                                {log.descripcion || log.detalle || '-'}
                                            </td>
                                            <td className="text-muted small">{log.ipOrigen || log.ipCliente || log.ip || 'N/A'}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Paginación UI */}
                    {logsFiltrados.length > 0 && (
                        <div className="bg-light border-top p-3 d-flex justify-content-between align-items-center" style={{ borderBottomLeftRadius: '0.5rem', borderBottomRightRadius: '0.5rem' }}>
                            <div className="text-muted small">
                                Viendo {indiceInicio + 1} a {Math.min(indiceFin, logsFiltrados.length)} de {logsFiltrados.length} entradas
                            </div>

                            {totalPaginas > 1 && (
                                <nav aria-label="Navegación auditoría">
                                    <ul className="pagination pagination-sm mb-0">
                                        <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
                                            <button className="page-link" onClick={() => irAPagina(paginaActual - 1)} aria-label="Anterior">
                                                <span aria-hidden="true">&laquo;</span>
                                            </button>
                                        </li>

                                        {/* Generamos array simple de páginas */}
                                        {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
                                            // Lógica simple de ventana deslizante
                                            let p = i + 1;
                                            if (totalPaginas > 5 && paginaActual > 3) p = paginaActual - 2 + i;
                                            if (p > totalPaginas) p = p - (p - totalPaginas); // Ajuste básico
                                            // Mejor: mostrar rango alrededor de current
                                            return p;
                                        }).filter((v, i, a) => a.indexOf(v) === i && v <= totalPaginas).map(num => (
                                            <li key={num} className={`page-item ${paginaActual === num ? 'active' : ''}`}>
                                                <button className="page-link" onClick={() => irAPagina(num)}>{num}</button>
                                            </li>
                                        ))}

                                        <li className={`page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`}>
                                            <button className="page-link" onClick={() => irAPagina(paginaActual + 1)} aria-label="Siguiente">
                                                <span aria-hidden="true">&raquo;</span>
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default AuditoriaPanel;
