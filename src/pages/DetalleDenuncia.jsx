import React, { useEffect, useState } from "react";
import { validarYActualizarExpediente } from "../apis/expedientesApi";
import { useParams, useNavigate } from "react-router-dom";
import {
  traerDenunciaPorId,
  actualizarEstadoDenuncia,
  mandarCorreo,
  traerHistorialDenuncia, // funcion para consultar el historial de estados
} from "../apis/apiDenuncia";
import { DescDetalle } from "../components/detalle-denuncia/DescDetalle";
import { PersonaDetalle } from "../components/detalle-denuncia/PersonaDetalle";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import { ArchivosDenuncia } from "../components/detalle-denuncia/ArchivosDenuncia";
import { ModalPDF } from "../components/detalle-denuncia/ModalPDF";
import { traerArchivoPDF } from "../apis/apiDocumento";
import { HistorialEstados } from "../components/detalle-denuncia/HistorialEstados";


const ESTADOS = ["NO ADMITIDO", "RECHAZADO", "EN PROCESO", "PENDIENTE"];

export const DetalleDenuncia = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [denuncia, setDenuncia] = useState(null);
  const [estadoNuevo, setEstadoNuevo] = useState("");
  const [motivoCambio, setMotivoCambio] = useState("");
  const [showMotivo, setShowMotivo] = useState(false);
  const [tab, setTab] = useState("Denunciante");
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [showCorreoModal, setShowCorreoModal] = useState(false);
  const [observacionCorreo, setObservacionCorreo] = useState("");
  const [historialEstados, setHistorialEstados] = useState([]);


  useEffect(() => {
    const obtenerDenuncia = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          // Decodifica el token
          const decoded = jwtDecode(token);
          // Accede al rol (ajusta el nombre según tu backend, puede ser 'role', 'rol', 'authorities', etc.)
          const rol = decoded.rol;
          console.log("Rol del usuario:", rol);
        }
        const data = await traerDenunciaPorId(id, token);
        setDenuncia(data);

        // Traer el historial de estados de la denuncia
        const historial = await traerHistorialDenuncia(id, token);
        setHistorialEstados(historial);
      } catch (error) {
        console.error("Error al obtener denuncia:", error);
      }
    };
    obtenerDenuncia();
  }, [id]);

  const handleEstadoChange = async (e) => {
    // obtenemos el nuevo estado seleccionado
    const nuevoEstado = e.target.value;
    // obtenemos el token del usuario
    const token = localStorage.getItem("token");
    // consultamos el historial de la denuncia
    try {
      const historial = await traerHistorialDenuncia(denuncia.id, token);
      // validamos si el cambio de estado es permitido segun el historial
      const cambioPermitido = validarCambioEstado(
        historial,
        denuncia.estado,
        nuevoEstado
      );
      if (!cambioPermitido) {
        // si el cambio no es permitido, mostramos un popup de error y no permitimos el cambio
        Swal.fire({
          icon: "error",
          title: "cambio de estado no permitido",
          text: "no se puede cambiar a ese estado segun el historial de la denuncia",
          confirmButtonText: "aceptar",
          confirmButtonColor: "#e53935",
          background: "#f8fafc",
          customClass: {
            title: "swal2-title-modern",
            popup: "swal2-popup-modern",
          },
          showClass: {
            popup: "animate__animated animate__shakeX",
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutUp",
          },
        });
        return;
      }
      // si el cambio es permitido, mostramos un popup de confirmacion antes de continuar
      const confirm = await Swal.fire({
        icon: "question",
        title: "confirmar cambio de estado",
        text: `estas seguro que quieres cambiar el estado a ${nuevoEstado}?`,
        showCancelButton: true,
        confirmButtonText: "si, cambiar",
        cancelButtonText: "cancelar",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#e53935",
        background: "#f8fafc",
        customClass: {
          title: "swal2-title-modern",
          popup: "swal2-popup-modern",
        },
        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp",
        },
      });
      if (confirm.isConfirmed) {
        // si el usuario confirma, habilitamos el textarea de motivo y guardamos el estado nuevo
        setEstadoNuevo(nuevoEstado);
        setShowMotivo(true);
      }
    } catch (error) {
      // si hay error al consultar el historial, mostramos un mensaje
      Swal.fire({
        icon: "error",
        title: "error al consultar historial",
        text: "no se pudo consultar el historial de la denuncia",
        confirmButtonText: "aceptar",
        confirmButtonColor: "#e53935",
        background: "#f8fafc",
        customClass: {
          title: "swal2-title-modern",
          popup: "swal2-popup-modern",
        },
        showClass: {
          popup: "animate__animated animate__shakeX",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp",
        },
      });
    }
  };

  const handleVerArchivo = async (archivo) => {
    const token = localStorage.getItem("token");
    const blob = await traerArchivoPDF(archivo.id, token);
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);
    setArchivoSeleccionado(archivo);
    //window.open(url);
    //console.log(blob.size);
  };

  const handleEnviarMotivo = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log(token);
      await actualizarEstadoDenuncia(
        denuncia.id,
        estadoNuevo,
        motivoCambio,
        token
      );
      setDenuncia({ ...denuncia, estado: estadoNuevo });
      setShowMotivo(false);
      setMotivoCambio("");
      // mostramos un popup de exito al cambiar el estado
      Swal.fire({
        icon: "success",
        title: "estado actualizado",
        text: `el estado se cambio correctamente a ${estadoNuevo}`,
        confirmButtonText: "aceptar",
        confirmButtonColor: "#3085d6",
        background: "#f8fafc",
        customClass: {
          title: "swal2-title-modern",
          popup: "swal2-popup-modern",
        },
        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp",
        },
      });
      navigate(
        `/menu-interno?vista=mesa-entrada&actualizarExpediente=1&id=${denuncia.id}&estado=${estadoNuevo}`
      );
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error al actualizar",
        text: "No se pudo actualizar el estado. Intenta nuevamente.",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#e53935",
        background: "#f8fafc",
        customClass: {
          title: "swal2-title-modern",
          popup: "swal2-popup-modern",
        },
        showClass: {
          popup: "animate__animated animate__shakeX",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp",
        },
      });
    }
  };

  const handleAbrirCorreoModal = () => {
    setObservacionCorreo("");
    setShowCorreoModal(true);
  };

  const handleCerrarCorreoModal = () => {
    setShowCorreoModal(false);
  };

  const handleEnviarCorreo = async () => {
    // Aquí deberías llamar a tu endpoint para enviar el correo
    const token = localStorage.getItem("token");
    await mandarCorreo(id, observacionCorreo, token);
    setShowCorreoModal(false);
    Swal.fire({
      icon: "success",
      title: "Correo enviado",
      text: "El correo fue enviado correctamente.",
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#3085d6",
      background: "#f8fafc",
      customClass: {
        title: "swal2-title-modern",
        popup: "swal2-popup-modern",
      },
      showClass: {
        popup: "animate__animated animate__fadeInDown",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp",
      },
    });
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
          <PersonaDetalle
            denuncia={denuncia}
            personas={personas}
            tab={tab}
            setTab={setTab}
          />
          {/* Archivos adjuntos */}
          <div className="card mb-4">
            <div className="card-body">
              <ArchivosDenuncia id={id} onVerArchivo={handleVerArchivo} />
            </div>
            {archivoSeleccionado && pdfUrl && (
              <ModalPDF
                archivo={archivoSeleccionado}
                pdfUrl={pdfUrl}
                onClose={() => {
                  setArchivoSeleccionado(null);
                  setPdfUrl(null);
                }}
              />
            )}
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
                {/* Botón para mandar correo */}
                <button
                  className="btn btn-outline-secondary mt-2"
                  onClick={handleAbrirCorreoModal}
                  type="button"
                >
                  Mandar correo
                </button>
              </div>
              
              {/* Historial de estados */}
              <div className="mt-3">
                <HistorialEstados historial={historialEstados} />
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
      {/* Modal para enviar correo */}
      {showCorreoModal && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            background: "rgba(0,0,0,0.3)",
          }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Mandar correo</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCerrarCorreoModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-2">
                  <label className="form-label">Observación</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={observacionCorreo}
                    onChange={(e) => setObservacionCorreo(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCerrarCorreoModal}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleEnviarCorreo}
                  disabled={!observacionCorreo}
                >
                  Enviar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// funcion para validar si el cambio de estado es permitido segun el historial
// se puede personalizar la logica segun las reglas de negocio
function validarCambioEstado(historial, estadoActual, estadoNuevo) {
  // ejemplo: solo se permite cambiar a un estado que no este en el historial
  // y que sea distinto al actual
  if (estadoActual === estadoNuevo) return false;
  if (historial.some((h) => h.estado === estadoNuevo)) return false;

  // ejemplo: permitir solo ciertos saltos de estado
  // const transicionesPermitidas = {
  //   'PENDIENTE': ['EN PROCESO', 'RECHAZADO'],
  //   'EN PROCESO': ['RECHAZADO', 'NO ADMITIDO'],
  //   // agregar mas reglas segun negocio
  // };
  // if (transicionesPermitidas[estadoActual] && !transicionesPermitidas[estadoActual].includes(estadoNuevo)) return false;

  // ejemplo: bloquear retrocesos de estado
  // si el ultimo estado en el historial es mas avanzado que el nuevo, no permitir
  // const ordenEstados = ['PENDIENTE', 'EN PROCESO', 'RECHAZADO', 'NO ADMITIDO'];
  // const ultimoEstado = historial.length > 0 ? historial[historial.length - 1].estado : estadoActual;
  // if (ordenEstados.indexOf(estadoNuevo) < ordenEstados.indexOf(ultimoEstado)) return false;

  // ejemplo: permitir cambios solo si el ultimo estado en el historial es 'PENDIENTE'
  // if (historial.length > 0 && historial[historial.length - 1].estado !== 'PENDIENTE') return false;

  // se pueden agregar mas reglas aqui
  return true;
}
