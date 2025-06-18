import React, { useEffect, useState } from "react";
import { validarYActualizarExpediente } from "../apis/expedientesApi";
import { useParams, useNavigate } from "react-router-dom";
import {
  traerDenunciaPorId,
  actualizarEstadoDenuncia,
} from "../apis/apiDenuncia";
import { DescDetalle } from "../components/detalle-denuncia/DescDetalle";
import { PersonaDetalle } from "../components/detalle-denuncia/PersonaDetalle";
import Swal from "sweetalert2";

const ESTADOS = ["NO ADMITIDO", "RECHAZADO", "EN PROCESO", "PENDIENTE"];

export const DetalleDenuncia = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [denuncia, setDenuncia] = useState(null);
  const [estadoNuevo, setEstadoNuevo] = useState("");
  const [motivoCambio, setMotivoCambio] = useState("");
  const [showMotivo, setShowMotivo] = useState(false);
  const [tab, setTab] = useState("Denunciante");

  useEffect(() => {
    const obtenerDenuncia = async () => {
      try {
        const data = await traerDenunciaPorId(id);
        setDenuncia(data);
      } catch (error) {
        console.error("Error al obtener denuncia:", error);
      }
    };
    obtenerDenuncia();
  }, [id]);

  const handleEstadoChange = (e) => {
    setEstadoNuevo(e.target.value);
    setShowMotivo(true);
  };

  const handleEnviarMotivo = async () => {
    try {
      await actualizarEstadoDenuncia(denuncia.id, estadoNuevo, motivoCambio);
      setDenuncia({ ...denuncia, estado: estadoNuevo });
      setShowMotivo(false);
      setMotivoCambio("");
      navigate(
        `/menu-interno?vista=mesa-entrada&actualizarExpediente=1&id=${denuncia.id}&estado=${estadoNuevo}`
      );
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar',
        text: 'No se pudo actualizar el estado. Intenta nuevamente.',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#e53935',
        background: '#f8fafc',
        customClass: {
          title: 'swal2-title-modern',
          popup: 'swal2-popup-modern',
        },
        showClass: {
          popup: 'animate__animated animate__shakeX'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        }
      });
    }
  };

  if (!denuncia)
    return <div className="container py-5">Cargando denuncia...</div>;

  // Personas involucradas (ejemplo, ajusta según tu estructura real)
  const personas = [
    { label: "Denunciante", ...denuncia.personas?.[0] },
    { label: "Denunciado", ...denuncia.personas?.[1] },
    { label: "Técnico", ...denuncia.personas?.[2] },
  ];

  return (
    <div className="container py-4">
      <h3 className="mb-4">Detalle de Denuncia #{denuncia.id}</h3>
      {console.log(personas)}
      <div className="row g-4">
        {/* Información General y Estado */}
        <div className="col-lg-8">
          <DescDetalle denuncia={denuncia} />
          {/* Personas involucradas */}
          <PersonaDetalle denuncia={denuncia} personas={personas} tab={tab} setTab={setTab} />
          {/* Archivos adjuntos */}
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title mb-3">
                <i className="bi bi-paperclip me-2"></i>Archivos Adjuntos
              </h5>
              {denuncia.archivos?.length > 0 ? (
                <ul className="list-group">
                  {denuncia.archivos.map((archivo, idx) => (
                    <li
                      className="list-group-item d-flex align-items-center"
                      key={idx}
                    >
                      <i className="bi bi-file-earmark me-2"></i>
                      <span className="me-auto">{archivo.nombre}</span>
                      <a
                        href={archivo.url}
                        className="btn btn-outline-secondary btn-sm"
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="bi bi-download"></i>
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
        {/* Estado y info adicional */}
        <div className="col-lg-4">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title mb-3">
                <i className="bi bi-check-circle me-2"></i>Estado de la Denuncia
              </h5>
              <div className="mb-2">
                <label className="form-label fw-bold">Estado actual</label>
                <select
                  className="form-select"
                  value={estadoNuevo || denuncia.estado}
                  onChange={handleEstadoChange}
                >
                  <option value="">{denuncia.estado}</option>
                  {ESTADOS.map((estado) => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>
              </div>
              {showMotivo && (
                <div className="mb-2">
                  <label className="form-label">
                    Motivo del cambio de estado
                  </label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={motivoCambio}
                    onChange={(e) => setMotivoCambio(e.target.value)}
                  />
                  <button
                    className="btn btn-primary mt-2"
                    onClick={handleEnviarMotivo}
                    disabled={!motivoCambio}
                  >
                    Enviar
                  </button>
                </div>
              )}
            </div>
          </div>
          {/* Información adicional */}
          <div className="card">
            <div className="card-body">
              <h5 className="card-title mb-3">
                <i className="bi bi-info-square me-2"></i>Información Adicional
              </h5>
              <div>
                <b>Fecha de creación:</b> {denuncia.fechaCreacion}
              </div>
              <div>
                <b>Última actualización:</b> {denuncia.ultimaActualizacion}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
