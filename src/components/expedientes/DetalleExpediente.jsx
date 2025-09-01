// DetalleExpediente.jsx

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
import OrdenesTabla from "./OrdenesTabla"; // Importa la tabla de órdenes
import ModalSubirOrden from "./modales/ModalSubirOrden";
import { useExpediente } from "../../hooks/useExpediente";
import { useAudiencias } from "../../hooks/useAudiencias";
import { usePases } from "../../hooks/usePases";
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

  // Modales de los componentes
  const [modalAudiencia, setModalAudiencia] = useState({show: false, modo: null, audiencia: null});
  const [modalPase, setModalPase] = useState({show: false, modo: null, pase: null});
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [mostrarModalOrden, setMostrarModalOrden] = useState(false);

  // Llama al hook de Expedientes
  const { expediente, cargando, error, setExpediente } = useExpediente(id);
  const { audiencias, guardarAudiencia, borrarAudiencia} = useAudiencias(id, setMensaje);
  const { ordenes, descargarOrden, subirOrden, borrarOrden, fetchOrdenes } = useOrdenes(id, setMensaje);
  const { pases, guardarPase, borrarPase } = usePases(id, setMensaje, fetchOrdenes);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (expediente && expediente.id_denuncia) {
      traerDocDenuncia(expediente.id_denuncia, token)
        .then((data) => setArchivos(data))
        .catch(() => setArchivos([]));
    }
  }, [expediente]);

  // Abren los modales según lo que sea --- Para cerrar también
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

  // --- Handlers para los pases, después la lógica de negocio se maneja en el hook ---
  const handleNuevoPase = () => {
    setModalPase({ show: true, modo: "crear", pase: null });
  };
  const handleEditarPase = (pase) => {
    setModalPase({ show: true, modo: "editar", pase });
  };
  const handleEliminarPase = async (id) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("¿Seguro que desea eliminar este pase?")) return;
    await borrarPase(id, token);
  };
  const handleGuardarPase = async (paseData) => {
    setModalPase({ show: false, modo: null, pase: null });
    await guardarPase(paseData, modalPase);
  };

  // Handlers para la tabla de órdenes
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
      const blob = await traerArchivoPDF(orden.id, token); // Ajusta el método si es necesario
      const url = URL.createObjectURL(blob);

      setPdfUrl(url);
      setArchivoSeleccionado(orden.id);
    } catch (err) {
      alert("No se pudo visualizar el documento");
    }
  };
  const handleEliminarOrden = async (orden) => {
    if (!window.confirm("¿Seguro que desea eliminar este documento?")) return;
    await borrarOrden(orden);
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

  return (
    <div className="container py-4">
      <div className="mb-3 d-flex gap-2">
        {mensaje && (
          <div
            className="alert alert-success alert-dismissible fade show"
            role="alert"
          >
            {mensaje}
            <button
              type="button"
              className="btn-close"
              onClick={() => setMensaje("")}
            ></button>
          </div>
        )}
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate(-1)}
        >
          <i className="bi bi-arrow-left"></i> Volver
        </button>
      </div>

      {mostrarPDF && (
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

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-body position-relative">
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
              {/* Motivo en chips celestes, título arriba y chips debajo */}
              <div className="mb-2">
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
              <div className="mb-2">
                <div style={{ fontWeight: 500, fontSize: "1em", marginBottom: 2 }}>
                  <strong>Estado:</strong>
                </div>
                <div>
                  <span
                    className="badge d-inline-flex gap-2 align-items-center"
                    style={{
                      backgroundColor: "#e2e3e5",
                      color: "#383d41",
                      fontWeight: 500,
                      fontSize: "1em",
                      borderRadius: "0.5rem",
                      padding: "0.5em 1em",
                      verticalAlign: "middle",
                    }}>
                    <i className="bi bi-info-circle"></i>
                    {expediente.denuncia?.estado}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* Selector de pestañas */}
          <div className="card mb-4">
            <div className="card-body pb-0">
              <div className="d-flex align-items-center mb-3">
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
                {/* Nueva sección: Órdenes */}
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
                  <TablaPases
                    pases={pases}
                    onEditar={handleEditarPase}
                    onEliminar={handleEliminarPase}
                    onNuevo={handleNuevoPase}
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
                  // Sección Órdenes: tabla ocupa todo el ancho
                  <OrdenesTabla
                    ordenes={ordenes}
                    onDescargar={handleDescargarOrden}
                    onVer={handleVerOrden}
                    onEliminar={handleEliminarOrden}
                    mostrarModalOrden={handlerModalOrden}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card mb-4">
            <div className="card-body">
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
      {/* Modal para crear/editar audiencia */}
      <ModalAudiencia
        show={modalAudiencia.show}
        modo={modalAudiencia.modo}
        audiencia={modalAudiencia.audiencia}
        onGuardar={handleGuardarAudiencia}
        onClose={handleCerrarModal}
        expedienteId={expediente.id} // id real del expediente, no nro_exp
        personasInvolucradas={expediente.denuncia?.personas || []}
      />
      <ModalSubirOrden
        show={mostrarModalOrden}
        onClose={() => setMostrarModalOrden(false)}
        expedienteId={expediente.id}
        onSubmitOrden={handlerSubirOrden}
      />
      {/* Modal para crear/editar pase */}
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
        onGuardar={handleGuardarPase}
      />
      {mostrarModalEditar && (
        <ModalEditarExpediente
          expediente={expediente}
          onClose={() => setMostrarModalEditar(false)}
          actualizarExpediente={setExpediente} // si lo necesitás para refrescar luego de editar
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
