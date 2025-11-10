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
import { ModalCorreo } from "../components/detalle-denuncia/ModalCorreo";
import { EstadoDenuncia } from "../components/detalle-denuncia/EstadoDenuncia";


const ESTADOS = ["EN ESPERA", "ADMITIDO", "RECHAZADO", "ASESORÍA LEGAL", "EN INSPECCIÓN", "EN SUBDIRECCIÓN", "EN DIRECCIÓN", "FINALIZADO"];

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
        const data = await traerDenunciaPorId(id, token);
        setDenuncia(data);

        // Traer el historial de estados de la denuncia
        try {
          const historial = await traerHistorialDenuncia(id, token);
          setHistorialEstados(historial || []);
        } catch (error) {
          setHistorialEstados([]);
        }
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
    let historial = [];
    try {
      historial = await traerHistorialDenuncia(denuncia.id, token);
    } catch (error) {
      // Si hay error, asumimos historial vacío (por ejemplo, 400 o 404)
      historial = [];
    }
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
  };

  const handleVerArchivo = async (archivo) => {
    const token = localStorage.getItem("token");
    const blob = await traerArchivoPDF(archivo.id, token);
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);
    setArchivoSeleccionado(archivo);
    //window.open(url);
  // console.log(blob.size);
  };

  const handleEnviarMotivo = async () => {
    try {
      const token = localStorage.getItem("token");
      await actualizarEstadoDenuncia(
        denuncia.id,
        estadoNuevo,
        motivoCambio,
        token
      );
      setDenuncia({ ...denuncia, estado: estadoNuevo });
      setShowMotivo(false);
      setMotivoCambio("");
      setEstadoNuevo(""); // Resetea el estadoNuevo para permitir nuevos cambios
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

      {/* --- 🚀 BOTÓN DE VOLVER AÑADIDO --- */}
      <div className="mb-3">
        <button 
          className="btn btn-outline-secondary" 
          onClick={() => navigate(-1)} // Usa la función 'navigate' ya importada
        >
          <i className="bi bi-arrow-left me-1"></i> Volver
        </button>
      </div>
      {/* --- FIN DEL BOTÓN --- */}

      <h3 className="mb-4">Detalle de Denuncia #{denuncia.id}</h3>
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
              <EstadoDenuncia
                estadoActual={denuncia.estado}
                estadoNuevo={estadoNuevo}
                onChange={handleEstadoChange}
                ESTADOS={ESTADOS}
                onCorreo={handleAbrirCorreoModal}
                showMotivo={showMotivo}
                motivoCambio={motivoCambio}
                setMotivoCambio={setMotivoCambio}
                onEnviarMotivo={handleEnviarMotivo}
              />
              {/* Historial de estados */}
              <div className="mt-3">
                <HistorialEstados historial={historialEstados} />
              </div>
            </div>
          </div>
          {/* Información adicional */}
          {/* <div className="card">
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
          </div> */}
        </div>
      </div>
      {/* Modal para enviar correo */}
      <ModalCorreo
        show={showCorreoModal}
        observacion={observacionCorreo}
        setObservacion={setObservacionCorreo}
        onClose={handleCerrarCorreoModal}
        onSend={handleEnviarCorreo}
      />
    </div>
  );
};

// ... (tu función 'validarCambioEstado' se mantiene igual)
// funcion para validar si el cambio de estado es permitido segun el historial
// se puede personalizar la logica segun las reglas de negocio
function validarCambioEstado(historial, estadoActual, estadoNuevo) {
  // ejemplo: solo se permite cambiar a un estado que no este en el historial
  // y que sea distinto al actual
  if (estadoActual === estadoNuevo) return false;
  const transicionesPermitidas = {
    "EN ESPERA": ["ADMITIDO", "RECHAZADO"],
    "ADMITIDO": ["ASESORÍA LEGAL", "EN DIRECCIÓN", "EN INSPECCIÓN", "EN SUBDIRECCIÓN", "FINALIZADO"],
    "ASESORÍA LEGAL": ["EN INSPECCIÓN", "EN SUBDIRECCIÓN", "EN DIRECCIÓN", "FINALIZADO"],
    "EN INSPECCIÓN": ["EN SUBDIRECCIÓN", "EN DIRECCIÓN", "ASESORÍA LEGAL"],
    "EN SUBDIRECCIÓN": ["EN DIRECCIÓN", "FINALIZADO", "EN INSPECCIÓN", "ASESORÍA LEGAL"],
    "EN DIRECCIÓN": ["FINALIZADO", "EN SUBDIRECCIÓN", "EN INSPECCIÓN", "ASESORÍA LEGAL"],
    "RECHAZADO": [],
    "FINALIZADO": [],
  };
  const transiciones = transicionesPermitidas[estadoActual] || [];
  return transiciones.includes(estadoNuevo); // Chequea si ese estado nuevo está permitido según las transiciones definidas. Es decir, si el estado nuevo está en la lista de transiciones permitidas del estado actual, entonces es un cambio válido.
  // ejemplo: permitir solo ciertos saltos de estado
  // const transicionesPermitidas = {
  //    'PENDIENTE': ['EN PROCESO', 'RECHAZADO'],
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
}