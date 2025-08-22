import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ModalEditarExpediente from './modales/ModalEditarExpediente';
import { traerExpedientes, traerPorUsuario } from '../../apis/expedientesApi';
import { jwtDecode } from 'jwt-decode';

export default function TablaExpedientes({ filtro, elementosPorPagina }) {
  const [expedientes, setExpedientes] = useState([]);
  const [modal, setModal] = useState(null);
  const [expedienteSeleccionado, setExpedienteSeleccionado] = useState(null);
  // Estados para la paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExpedientes = async () => {
      try {
        const token = localStorage.getItem("token");
        const decoded = jwtDecode(token);
        if (decoded.rol == "DIRECCION") {
          const data = await traerExpedientes(token);
          setExpedientes(data);
        } else {
          const data = await traerPorUsuario(token);
          setExpedientes(data);
        }
      } catch (err) {
        console.error('Error al traer expedientes:', err);
      }
    };

    fetchExpedientes();
  }, []);

  // Resetear página cuando cambie elementos por página
  useEffect(() => {
    setPaginaActual(1);
  }, [elementosPorPagina]);

  const abrirModal = (tipo, expediente) => {
    setExpedienteSeleccionado(expediente);
    setModal(tipo);
  };

  const cerrarModal = () => {
    setModal(null);
    setExpedienteSeleccionado(null);
  };

  // Solo filtra por los campos que existen en la respuesta de la API
  const expedientesFiltrados = useMemo(() => {
    if (!filtro) return expedientes;
    const texto = filtro.trim().toLowerCase();
    return expedientes.filter(exp =>
      (exp.nro_exp ?? '').toLowerCase().includes(texto) ||
      (exp.cant_folios?.toString() ?? '').toLowerCase().includes(texto) ||
      (exp.fecha_inicio ?? '').toLowerCase().includes(texto) ||
      (exp.fecha_finalizacion ?? '').toLowerCase().includes(texto) ||
      (exp.hipervulnerable ?? '').toLowerCase().includes(texto) ||
      (exp.delegacion ?? '').toLowerCase().includes(texto)
    );
  }, [expedientes, filtro]);

  // Calcular datos de paginación
  const totalPaginas = Math.ceil(expedientesFiltrados.length / elementosPorPagina);
  const indiceInicio = (paginaActual - 1) * elementosPorPagina;
  const indiceFin = indiceInicio + elementosPorPagina;
  const expedientesPaginados = expedientesFiltrados.slice(indiceInicio, indiceFin);

  // Funciones de paginación
  const irAPagina = (pagina) => {
    setPaginaActual(Math.max(1, Math.min(pagina, totalPaginas)));
  };

  // Generar números de página para mostrar
  const generarNumerosPagina = () => {
    const numeros = [];
    const rango = 2; // Mostrar 2 páginas antes y después de la actual
    
    let inicio = Math.max(1, paginaActual - rango);
    let fin = Math.min(totalPaginas, paginaActual + rango);
    
    // Ajustar el rango si estamos cerca del inicio o final
    if (paginaActual <= rango) {
      fin = Math.min(totalPaginas, 2 * rango + 1);
    }
    if (paginaActual > totalPaginas - rango) {
      inicio = Math.max(1, totalPaginas - 2 * rango);
    }
    
    for (let i = inicio; i <= fin; i++) {
      numeros.push(i);
    }
    
    return numeros;
  };

  const eliminarDuplicados = () => {
    const vistos = new Set();
    const unicos = [];
    for (const exp of expedientes) {
      if (!vistos.has(String(exp.id))) {
        unicos.push(exp);
        vistos.add(String(exp.id));
      }
    }
    setExpedientes(unicos);
  };

  return (
    <>
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-primary">
            <tr>
              <th style={{ minWidth: 110 }}>N° de orden</th>
              <th style={{ minWidth: 90 }}>Cant. folios</th>
              <th style={{ minWidth: 130 }}>Fecha de ingreso</th>
              <th style={{ minWidth: 150 }}>Fecha de finalización</th>
              <th style={{ minWidth: 60, textAlign: 'center' }}>HV</th>
              <th style={{ minWidth: 110 }}>Delegación</th>
              <th className="text-end" style={{ minWidth: 110 }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {expedientesPaginados.map((exp) => (
              <tr key={exp.id}>
                <td>{exp.nro_exp ?? exp.id ?? "-"}</td>
                <td>{exp.cant_folios ?? "-"}</td>
                <td>{exp.fecha_inicio ?? "-"}</td>
                <td>{exp.fecha_finalizacion ?? "-"}</td>
                <td className="text-center">{exp.hipervulnerable ?? "-"}</td>
                <td>{exp.delegacion ?? "-"}</td>
                <td className="text-end">
                  <div className="btn-group btn-group-sm">
                    <button
                      className="btn btn-outline-primary"
                      title="Ver expediente"
                      onClick={() => navigate(`/expedientes/${exp.id}`)}
                    >
                      <i className="bi bi-eye"></i>
                    </button>
                    {/*
                      <button
                      className="btn btn-outline-primary"
                      title="Editar expediente"
                      onClick={() => abrirModal('editar', exp)}
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {expedientesFiltrados.length === 0 && (
          <div className="alert alert-light text-center">No se encontraron resultados.</div>
        )}
      </div>

      {/* Controles de paginación en la parte inferior */}
      {expedientesFiltrados.length > 0 && (
        <div className="card-footer">
          <div className="d-flex justify-content-between align-items-center">
            <div className="text-muted">
              Mostrando {indiceInicio + 1} a {Math.min(indiceFin, expedientesFiltrados.length)} de {expedientesFiltrados.length} expedientes
            </div>
            {totalPaginas > 1 && (
              <nav>
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
                    <li key={numero} className={`page-item ${numero === paginaActual ? 'active' : ''}`}>
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
        </div>
      )}

      {modal === 'editar' && expedienteSeleccionado && (
        <ModalEditarExpediente expediente={expedienteSeleccionado} onClose={cerrarModal} />
      )}
    </>
  );
}
