import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import ExpedientePDF from "./ExpedientePDF";
import ModalEditarExpediente from "./modales/ModalEditarExpediente";
import FormularioPaseModal from "./modales/FormularioPaseModal";
import TablaAudiencias from "./TablaAudiencias";
import ModalAudiencia from "./ModalAudiencia";
import { ArchivosDenuncia } from "../detalle-denuncia/ArchivosDenuncia";
import { ModalPDF } from "../detalle-denuncia/ModalPDF";
import { traerDocDenuncia } from "../../apis/apiDenuncia";
import { traerArchivoPDF } from "../../apis/apiDocumento";
import TablaPases from "./TablaPases";
import OrdenesTabla from "./OrdenesTabla";
import ModalSubirOrden from "./modales/ModalSubirOrden";
import ModalEditarOrden from "./modales/ModalEditarOrden";
import Swal from "sweetalert2";
import { useExpediente } from "../../hooks/useExpediente";
import { useAudiencias } from "../../hooks/useAudiencias";
 
import { ModalPdf } from "./modales/ModalPdf";
import { useOrdenes } from "../../hooks/useOrdenes";

export default function DetalleExpediente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState("pases");
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [mostrarPDF, setMostrarPDF] = useState(false);
  const [archivos, setArchivos] = useState([]);

  const [modalAudiencia, setModalAudiencia] = useState({show: false, modo: null, audiencia: null});
  // Este estado local se mantiene, ¡es correcto!
  const [modalPase, setModalPase] = useState({show: false, modo: null, pase: null});
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [mostrarModalOrden, setMostrarModalOrden] = useState(false);
  const [modalEditarOrden, setModalEditarOrden] = useState({ show: false, orden: null });

  const { expediente, cargando, error, setExpediente } = useExpediente(id);
  const { audiencias, guardarAudiencia, borrarAudiencia} = useAudiencias(id, setMensaje);
  const { ordenes, descargarOrden, subirOrden, borrarOrden, fetchOrdenes, actualizarOrden } = useOrdenes(id, setMensaje);

  

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (expediente && expediente.id_denuncia) {
      traerDocDenuncia(expediente.id_denuncia, token)
        .then((data) => setArchivos(data))
        .catch(() => setArchivos([]));
    }
  }, [expediente]);


  const handleNuevaAudiencia = () => {
    setModalAudiencia({ show: true, modo: "crear", audiencia: null });
  };
  const handleEditarAudiencia = (audiencia) => {
    setModalAudiencia({ show: true, modo: "editar", audiencia });
  };
  const handleCerrarModal = () => {
    setModalAudiencia({ show: false, modo: null, audiencia: null });
  };
  const handleGuardarAudiencia = async (audiencia) => {
    await guardarAudiencia(
      audiencia,
      modalAudiencia.modo,
      modalAudiencia.audiencia?.id
    );
    setModalAudiencia({ show: false, modo: null, audiencia: null });
  };
  const handleEliminarAudiencia = async (id) => {
    await borrarAudiencia(id);
  };


  const handleNuevoPase = () => {
    setModalPase({ show: true, modo: "crear", pase: null });
  };
  const handleEditarPase = (pase) => {
    setModalPase({ show: true, modo: "editar", pase });
  };


  const handlerSubirOrden = async (ordenData) => {
    await subirOrden(ordenData);
    setMostrarModalOrden(false);
  };
  
  const handlerModalOrden = () => {
    console.log("Abrir modal para subir orden");
    setMostrarModalOrden(true);
  };
  const handleDescargarOrden = async (orden) => {
    await descargarOrden(orden);
  };
  const handleVerOrden = async (orden) => {
    try {
      const token = localStorage.getItem("token");
      const blob = await traerArchivoPDF(orden.id, token);
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setArchivoSeleccionado(orden.id);
    } catch (err) {
      Swal.fire("Error", "No se pudo visualizar el documento", "error");
    }
  };
  const handleEliminarOrden = async (orden) => {
    await borrarOrden(orden);
  };
  const handleEditarOrdenClick = (orden) => {
    setModalEditarOrden({ show: true, orden: orden });
  };
  const handleGuardarOrdenEditada = async (ordenId, formData) => {
    await actualizarOrden(ordenId, formData); 
    setModalEditarOrden({ show: false, orden: null }); 
  };



  if (cargando)
    return <div className="container mt-4">Cargando expediente...</div>;
  if (error) return <div className="alert alert-danger mt-4">{error}</div>;
  if (!expediente)
    return (
      <div className="alert alert-warning mt-4">
        No se encontró el expediente.
      </div>
    );

  const denunciante = expediente.denuncia?.personas?.find(
    (p) => (p.rol || "").toLowerCase() === "denunciante"
  );
  
  const getEstadoVariant = (estado) => {
    if (!estado) return "secondary"; 
    const estadoLower = estado.toLowerCase();
    if (estadoLower.includes("finalizado")) return "success";
    if (estadoLower.includes("rechazado")) return "danger";
    if (estadoLower.includes("en inspección")) return "warning";
    if (estadoLower.includes("en dirección")) return "info";
    if (estadoLower.includes("en subdirección")) return "info";
    if (estadoLower.includes("asesoría legal")) return "primary";
    if (estadoLower.includes("admitido")) return "primary";
    if (estadoLower.includes("en espera")) return "secondary";
    return "dark"; 
  };

  const estadoActual = expediente.denuncia?.estado;
  const alertVariant = getEstadoVariant(estadoActual);


  return (
    <div className="container py-4">
      {/* ... (Botón Volver y lógica de PDF sin cambios) ... */}
      <div className="mb-3 d-flex gap-2">
        <button
          className="btn btn-outline-secondary me-2"
          onClick={() => navigate(-1)}
        >
          <i className="bi bi-arrow-left"></i> Volver
        </button>
        <ModalPdf />
      </div>

      {mostrarPDF && (
        // ... (Tu JSX de PDFViewer) ...
        <div className="mb-4">
          <h5>Previsualización del PDF:</h5>
          <PDFViewer width="100%" height={500}>
            <ExpedientePDF expediente={expediente} />
          </PDFViewer>
          <div className="mt-2">
            <button
              className="btn btn-secondary"
              onClick={() => setMostrarPDF(false)}
            >
              Cerrar previsualización
            </button>
          </div>
        </div>
      )}

      
      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div className="card h-100">
            <div className="card-body position-relative">
              {/* ... (Contenido de Card 'Información General') ... */}
              <h5 className="card-title mb-3 d-flex justify-content-between align-items-center">
                <span>
                  <i className="bi bi-info-circle me-2"></i>Información General
                </span>
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => setMostrarModalEditar(true)}
                  title="Editar expediente"
                >
                  <i className="bi bi-pencil"></i>
                </button>
              </h5>
              {/* ... (Resto de 'p' tags) ... */}
              <p>
                <strong>Número de Expediente:</strong>{" "}
                {expediente.nro_exp ?? "-"}
              </p>
              <p>
                <strong>Número de Orden:</strong> {expediente.id}
              </p>
              <p>
                <strong>Cant. folios:</strong> {expediente.cant_folios ?? "-"}
              </p>
              <p>
                <strong>Fecha de ingreso:</strong>{" "}
                {expediente.fecha_inicio ?? "-"}
              </p>
              <p>
                <strong>Fecha de finalización:</strong>{" "}
                {expediente.fecha_finalizacion ?? "-"}
              </p>
              <p>
                <strong>HV:</strong> {expediente.hipervulnerable ?? "-"}
              </p>
              <p>
                <strong>Delegación:</strong> {expediente.delegacion ?? "-"}
              </p>
              <div className="d-flex">
                <strong>Usuarios:</strong>
                <span className="ms-2">
                  {expediente.usuRespuesta
                    .map((usu) => usu.nombreUsuario)
                    .join(" - ")}
                </span>
              </div>
              <div className="mb-2 mt-2">
                <div
                  style={{ fontWeight: 500, fontSize: "1em", marginBottom: 2 }}
                >
                  <strong>Motivo:</strong>
                </div>
                <div>
                  {Array.isArray(expediente.denuncia?.motivo) &&
                  expediente.denuncia.motivo.length > 0 ? (
                    expediente.denuncia.motivo.map((motivo, idx) => (
                      <span
                        key={idx}
                        className="badge me-2 mb-1"
                        style={{
                          backgroundColor: "#e3f2fd",
                          color: "#1976d2",
                          fontWeight: 500,
                          fontSize: "1em",
                          borderRadius: "0.5rem",
                          padding: "0.5em 0.9em",
                          verticalAlign: "middle",
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
              {estadoActual && (
                <div className={`alert alert-${alertVariant} d-flex align-items-center mt-3`} role="alert">
                  <i className="bi bi-info-circle-fill me-3" style={{ fontSize: "1.5rem" }}></i>
                  <div>
                    <h5 className="alert-heading mb-0" style={{ fontWeight: 600 }}>
                      Actualmente en:
                    </h5>
                    <span className="fs-5">{estadoActual}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card h-100">
            <div className="card-body">
              {/* ... (Contenido de Card 'Personas Involucradas') ... */}
              <h5 className="card-title mb-3">
                <i className="bi bi-people me-2"></i>Personas Involucradas
              </h5>
              {expediente.denuncia?.personas?.map((persona) => (
                <div key={persona.id} className="mb-2">
                  <strong>
                    {persona.rol
                      ? persona.rol.charAt(0).toUpperCase() +
                        persona.rol.slice(1)
                      : "Sin rol"}
                    :
                  </strong>{" "}
                  {persona.nombre} {persona.apellido} - DNI: {persona.documento}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* --- FIN DE LA FILA 1 --- */}


      {/* --- ESTRUCTURA DE TABS (Sin cambios) --- */}
      <div className="row g-4">
        <div className="col-12"> 
          <div className="card mb-4"> 
            <div className="card-body pb-0">
              <div className="d-flex align-items-center mb-3">
                {/* ... (Botones de Tabs Pases/Audiencias/Órdenes) ... */}
                <button
                  className={`btn btn-link px-3 py-2 ${
                    tab === "pases" ? "fw-bold text-primary" : "text-secondary"
                  }`}
                  style={{ textDecoration: "none" }}
                  onClick={() => setTab("pases")}
                >
                  <i className="bi bi-arrow-left-right me-2"></i>Historial de
                  Pases
                </button>
                <button
                  className={`btn btn-link px-3 py-2 ${
                    tab === "audiencias"
                      ? "fw-bold text-primary"
                      : "text-secondary"
                  }`}
                  style={{ textDecoration: "none" }}
                  onClick={() => setTab("audiencias")}
                >
                  <i className="bi bi-calendar-event me-2"></i>Audiencias
                </button>
                <button
                  className={`btn btn-link px-3 py-2 ${
                    tab === "ordenes"
                      ? "fw-bold text-primary"
                      : "text-secondary"
                  }`}
                  style={{ textDecoration: "none" }}
                  onClick={() => setTab("ordenes")}
                >
                  <i className="bi bi-file-earmark-text me-2"></i>Órdenes
                </button>
              </div>
              <div style={{ width: "100%" }}>
                {tab === "pases" ? (
                  // 4. --- TablaPases MODIFICADA ---
                  <TablaPases
                    // pases={pases} (Eliminado)
                    // onEliminar={handleEliminarPase} (Eliminado)
                    onEditar={handleEditarPase} // Se mantiene
                    onNuevo={handleNuevoPase}   // Se mantiene
                    expedienteId={id}           // Añadido
                  />
                ) : tab === "audiencias" ? (
                  <TablaAudiencias
                    audiencias={audiencias}
                    onNueva={handleNuevaAudiencia}
                    onEditar={handleEditarAudiencia}
                    onEliminar={handleEliminarAudiencia}
                    personasInvolucradas={expediente.denuncia?.personas || []}
                  />
                ) : (
                  <OrdenesTabla
                    ordenes={ordenes}
                    onDescargar={handleDescargarOrden}
                    onVer={handleVerOrden}
                    onEditar={handleEditarOrdenClick}
                    onEliminar={handleEliminarOrden}
                    mostrarModalOrden={handlerModalOrden}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* --- FIN DE LA ESTRUCTURA DE TABS --- */}


      {/* --- Modales --- */}
      {/* ... (Modales de Órdenes y Audiencias sin cambios) ... */}
      {modalEditarOrden.show && (
        <ModalEditarOrden
          show={modalEditarOrden.show}
          onClose={() => setModalEditarOrden({ show: false, orden: null })}
          onGuardar={handleGuardarOrdenEditada}
          orden={modalEditarOrden.orden}
        />
      )}
      <ModalAudiencia
        show={modalAudiencia.show}
        modo={modalAudiencia.modo}
        audiencia={modalAudiencia.audiencia}
        onGuardar={handleGuardarAudiencia}
        onClose={handleCerrarModal}
        expedienteId={expediente.id} 
        personasInvolucradas={expediente.denuncia?.personas || []}
      />
      <ModalSubirOrden
        show={mostrarModalOrden}
        onClose={() => setMostrarModalOrden(false)}
        expedienteId={expediente.id}
        onSubmitOrden={handlerSubirOrden}
      />

      {/* 5. --- FormularioPaseModal MODIFICADO --- */}
      <FormularioPaseModal
        show={modalPase.show}
        handleClose={() =>
          setModalPase({ show: false, modo: null, pase: null })
        }
        expedienteId={expediente.id}
        usuarioId={
          localStorage.getItem("token")
            ? JSON.parse(atob(localStorage.getItem("token").split(".")[1])).jti
            : null
        }
        modo={modalPase.modo}
        pase={modalPase.pase}
        // onGuardar={handleGuardarPase} (Eliminado)
      />
      
      {/* ... (Resto de modales sin cambios) ... */}
      {mostrarModalEditar && (
        <ModalEditarExpediente
          expediente={expediente}
          onClose={() => setMostrarModalEditar(false)}
          actualizarExpediente={setExpediente} 
        />
      )}
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
  );
}