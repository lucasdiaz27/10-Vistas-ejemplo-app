// DetalleExpediente.jsx

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { traerExpedientePorId } from "../../apis/expedientesApi";
import TablaAudiencias from "./TablaAudiencias";
import ModalAudiencia from "./ModalAudiencia";

export default function DetalleExpediente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expediente, setExpediente] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("pases");
  const [modalAudiencia, setModalAudiencia] = useState({ show: false, modo: null, audiencia: null });
  const [audiencias, setAudiencias] = useState([]);

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

  useEffect(() => {
    if (expediente && Array.isArray(expediente.audiencias)) {
      setAudiencias(expediente.audiencias);
    }
  }, [expediente]);

  const handleNuevaAudiencia = () => {
    setModalAudiencia({ show: true, modo: "crear", audiencia: null });
  };

  const handleEditarAudiencia = (audiencia) => {
    setModalAudiencia({ show: true, modo: "editar", audiencia });
  };

  const handleGuardarAudiencia = (audiencia) => {
    if (modalAudiencia.modo === "crear") {
      setAudiencias([...audiencias, { ...audiencia, id: Date.now() }]);
    } else if (modalAudiencia.modo === "editar") {
      setAudiencias(audiencias.map(a => a.id === audiencia.id ? audiencia : a));
    }
    setModalAudiencia({ show: false, modo: null, audiencia: null });
  };

  const handleCerrarModal = () => {
    setModalAudiencia({ show: false, modo: null, audiencia: null });
  };

  if (cargando) return <div className="container mt-4">Cargando expediente...</div>;
  if (error) return <div className="alert alert-danger mt-4">{error}</div>;

  const denunciante = expediente.denuncia?.personas?.find(
    p => (p.rol || "").toLowerCase() === "denunciante"
  );

  return (
    <div className="container py-4">
      <button className="btn btn-outline-secondary mb-3" onClick={() => navigate(-1)}>
        <i className="bi bi-arrow-left"></i> Volver
      </button>
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title mb-3">
                <i className="bi bi-info-circle me-2"></i>Información General
              </h5>
              <p><strong>Número de Expediente:</strong> {expediente.nro_exp ?? '-'}</p>
              <p><strong>Número de Orden:</strong> {expediente.id}</p>
              <p><strong>Cant. folios:</strong> {expediente.cant_folios ?? "-"}</p>
              <p><strong>Fecha de ingreso:</strong> {expediente.fecha_inicio ?? "-"}</p>
              <p><strong>Fecha de finalización:</strong> {expediente.fecha_finalizacion ?? "-"}</p>
              <p><strong>HV:</strong> {expediente.hipervulnerable ?? "-"}</p>
              <p><strong>Delegación:</strong> {expediente.delegacion ?? "-"}</p>
              {/* Motivo en chips celestes, título arriba y chips debajo */}
              <div className="mb-2">
                <div style={{fontWeight: 500, fontSize: '1em', marginBottom: 2}}><strong>Motivo:</strong></div>
                <div>
                  {Array.isArray(expediente.denuncia?.motivo) && expediente.denuncia.motivo.length > 0 ? (
                    expediente.denuncia.motivo.map((motivo, idx) => (
                      <span
                        key={idx}
                        className="badge me-2 mb-1"
                        style={{
                          backgroundColor: '#e3f2fd', color: '#1976d2', fontWeight: 500, fontSize: '1em', borderRadius: '0.5rem', padding: '0.5em 0.9em', verticalAlign: 'middle'
                        }}
                      >
                        {motivo}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted">-</span>
                  )}
                </div>
              </div>
              {/* Estado, título arriba y chip debajo */}
              <div className="mb-2">
                <div style={{fontWeight: 500, fontSize: '1em', marginBottom: 2}}><strong>Estado:</strong></div>
                <div>
                  {(() => {
                    const estado = (expediente.denuncia?.estado || '').toUpperCase();
                    let color = '#fff3cd', text = 'Pendiente', icon = <i className="bi bi-hourglass-split me-1"></i>, textColor = '#856404';
                    if (estado === 'EN PROCESO') {
                      color = '#ffe5b4'; // naranja suave
                      textColor = '#a05a00';
                      text = 'En Proceso';
                      icon = <i className="bi bi-arrow-repeat me-1"></i>;
                    } else if (estado === 'FINALIZADO' || estado === 'APROBADO') {
                      color = '#d4edda'; // verde suave
                      textColor = '#256029';
                      text = estado.charAt(0) + estado.slice(1).toLowerCase();
                      icon = <i className="bi bi-check-circle me-1"></i>;
                    } else if (estado && estado !== 'PENDIENTE') {
                      color = '#e2e3e5'; // gris suave
                      textColor = '#383d41';
                      text = estado.charAt(0) + estado.slice(1).toLowerCase();
                      icon = <i className="bi bi-info-circle me-1"></i>;
                    }
                    return (
                      <span
                        className="badge d-inline-flex align-items-center"
                        style={{ backgroundColor: color, color: textColor, fontWeight: 500, fontSize: '1em', borderRadius: '0.5rem', padding: '0.5em 1em', verticalAlign: 'middle' }}
                      >
                        {icon}{text}
                      </span>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
          {/* Selector de pestañas */}
          <div className="card mb-4">
            <div className="card-body pb-0">
              <div className="d-flex align-items-center mb-3">
                <button
                  className={`btn btn-link px-3 py-2 ${tab === "pases" ? "fw-bold text-primary" : "text-secondary"}`}
                  style={{ textDecoration: "none" }}
                  onClick={() => setTab("pases")}
                >
                  <i className="bi bi-arrow-left-right me-2"></i>Historial de Pases
                </button>
                <button
                  className={`btn btn-link px-3 py-2 ${tab === "audiencias" ? "fw-bold text-primary" : "text-secondary"}`}
                  style={{ textDecoration: "none" }}
                  onClick={() => setTab("audiencias")}
                >
                  <i className="bi bi-calendar-event me-2"></i>Audiencias
                </button>
              </div>
              <div>
                {tab === "pases" ? (
                  Array.isArray(expediente.pases) && expediente.pases.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-sm table-bordered mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>Fecha</th>
                            <th>Origen</th>
                            <th>Destino</th>
                            <th>Estado</th>
                            <th>Asunto</th>
                          </tr>
                        </thead>
                        <tbody>
                          {expediente.pases.map((pase, idx) => (
                            <tr key={idx}>
                              <td>{pase.fecha || '-'}</td>
                              <td>{pase.origen || '-'}</td>
                              <td>{pase.destino || '-'}</td>
                              <td>{pase.estado || '-'}</td>
                              <td>{pase.asunto || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-muted">No hay pases registrados para este expediente.</div>
                  )
                ) : (
                  <TablaAudiencias
                    audiencias={audiencias}
                    onNueva={handleNuevaAudiencia}
                    onEditar={handleEditarAudiencia}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Personas involucradas y Archivos Adjuntos */}
        <div className="col-lg-4">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title mb-3">
                <i className="bi bi-people me-2"></i>Personas Involucradas
              </h5>
              {expediente.denuncia?.personas?.map(persona => (
                <div key={persona.id} className="mb-2">
                  <strong>{persona.rol.charAt(0).toUpperCase() + persona.rol.slice(1)}:</strong> {persona.nombre} {persona.apellido} - DNI: {persona.documento}
                </div>
              ))}
            </div>
          </div>
          {/* Archivos Adjuntos */}
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title mb-3">
                <i className="bi bi-paperclip me-2"></i>Archivos Adjuntos
              </h5>
              {Array.isArray(expediente.archivos) && expediente.archivos.length > 0 ? (
                <ul className="list-group">
                  {expediente.archivos.map((archivo, idx) => (
                    <li key={idx} className="list-group-item d-flex align-items-center">
                      <i className="bi bi-file-earmark me-2"></i>
                      <span className="me-auto">{archivo.nombre || `Archivo ${idx+1}`}</span>
                      <a
                        href={archivo.url || archivo.enlace || archivo.base64 || '#'}
                        className="btn btn-outline-secondary btn-sm"
                        target="_blank"
                        rel="noopener noreferrer"
                        download={archivo.nombre}
                      >
                        <i className="bi bi-eye"></i> Ver
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-muted">No hay archivos adjuntos.</div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Modal para crear/editar audiencia */}
      <ModalAudiencia
        show={modalAudiencia.show}
        modo={modalAudiencia.modo}
        audiencia={modalAudiencia.audiencia}
        onGuardar={handleGuardarAudiencia}
        onClose={handleCerrarModal}
      />
    </div>
  );
}
