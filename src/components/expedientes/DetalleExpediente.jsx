// src/components/expedientes/DetalleExpediente.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

// Slices y Hooks
import { fetchExpedienteById } from "../../features/expediente/expedienteSlice";
import { useAudiencias } from "../../hooks/useAudiencias";
import { useOrdenes } from "../../hooks/useOrdenes";

// Componentes Hijos
import TablaPases from "./TablaPases";
import TablaAudiencias from "./TablaAudiencias";
import OrdenesTabla from "./OrdenesTabla";
import FormularioPaseModal from "./modales/FormularioPaseModal";
import ModalVerPase from '../pases/modales/ModalVerPase';
import ModalAudiencia from "./ModalAudiencia";
import ModalSubirOrden from "./modales/ModalSubirOrden";
import ModalEditarExpediente from "./modales/ModalEditarExpediente";
import { ModalPDF } from "../detalle-denuncia/ModalPDF";

// APIs (para funcionalidades no migradas a Redux aún)
import { traerDocDenuncia } from "../../apis/apiDenuncia";
import { traerArchivoPDF } from "../../apis/apiDocumento";

export default function DetalleExpediente() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Estados locales del componente
    const [tab, setTab] = useState("pases");
    const [mensaje, setMensaje] = useState("");
    const [modalPase, setModalPase] = useState({ show: false, modo: null, pase: null });
    const [modalAudiencia, setModalAudiencia] = useState({ show: false, modo: null, audiencia: null });
    const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
    const [mostrarModalOrden, setMostrarModalOrden] = useState(false);
    const [archivos, setArchivos] = useState([]);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);

    // Lectura del estado de Redux para Expediente
    const { expediente, estado, error } = useSelector((state) => state.expediente);
    const cargando = estado === "cargando";

    // Hooks para lógica que aún no está en Redux (se mantienen igual)
    const { audiencias, guardarAudiencia, borrarAudiencia } = useAudiencias(id, setMensaje);
    const { ordenes, descargarOrden, subirOrden, borrarOrden } = useOrdenes(id, setMensaje);

    // Carga inicial del expediente
    useEffect(() => {
        if (id) {
            dispatch(fetchExpedienteById(id));
        }
    }, [dispatch, id]);

    // Carga de archivos de la denuncia asociada
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (expediente && expediente.id_denuncia) {
            traerDocDenuncia(expediente.id_denuncia, token)
                .then((data) => setArchivos(data))
                .catch(() => setArchivos([]));
        }
    }, [expediente]);

    // --- MANEJADORES DE MODALES PARA PASES ---
    const handleNuevoPase = () => setModalPase({ show: true, modo: "crear", pase: null });
    const handleEditarPase = (pase) => setModalPase({ show: true, modo: "editar", pase });
    const handleVerPase = (pase) => setModalPase({ show: true, modo: "ver", pase });
    const handleCerrarModalPase = () => setModalPase({ show: false, modo: null, pase: null });

    // --- MANEJADORES PARA AUDIENCIAS ---
    const handleNuevaAudiencia = () => setModalAudiencia({ show: true, modo: "crear", audiencia: null });
    const handleEditarAudiencia = (audiencia) => setModalAudiencia({ show: true, modo: "editar", audiencia });
    const handleCerrarModal = () => setModalAudiencia({ show: false, modo: null, audiencia: null });
    const handleGuardarAudiencia = async (audiencia) => {
        await guardarAudiencia(audiencia, modalAudiencia.modo, modalAudiencia.audiencia?.id);
        setModalAudiencia({ show: false, modo: null, audiencia: null });
    };
    const handleEliminarAudiencia = async (id) => {
        await borrarAudiencia(id);
    };

    // --- MANEJADORES PARA ÓRDENES ---
    const handlerModalOrden = () => setMostrarModalOrden(true);
    const handlerSubirOrden = async (ordenData) => {
        await subirOrden(ordenData);
        setMostrarModalOrden(false);
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
            alert("No se pudo visualizar el documento");
        }
    };
    const handleEliminarOrden = async (orden) => {
        if (!window.confirm("¿Seguro que desea eliminar este documento?")) return;
        await borrarOrden(orden);
    };

    if (cargando) return <div className="container mt-4">Cargando expediente...</div>;
    if (error) return <div className="alert alert-danger mt-4">{error}</div>;
    if (!expediente) return <div className="alert alert-warning mt-4">No se encontró el expediente.</div>;

    return (
        <div className="container py-4">
            <div className="mb-3 d-flex gap-2">
                <button className="btn btn-outline-secondary me-2" onClick={() => navigate(-1)}>
                    <i className="bi bi-arrow-left"></i> Volver
                </button>
            </div>

            <div className="row g-4">
                <div className="col-lg-8">
                    {/* --- TARJETA DE INFORMACIÓN GENERAL --- */}
                    <div className="card mb-4">
                        <div className="card-body position-relative">
                            <h5 className="card-title mb-3 d-flex justify-content-between align-items-center">
                                <span><i className="bi bi-info-circle me-2"></i>Información General</span>
                                <button className="btn btn-outline-primary btn-sm" onClick={() => setMostrarModalEditar(true)} title="Editar expediente">
                                    <i className="bi bi-pencil"></i>
                                </button>
                            </h5>
                            <p><strong>Número de Expediente:</strong> {expediente.nro_exp ?? "-"}</p>
                            <p><strong>Número de Orden:</strong> {expediente.id}</p>
                        </div>
                    </div>

                    {/* --- PESTAÑAS (TABS) --- */}
                    <div className="card mb-4">
                        <div className="card-body pb-0">
                            <div className="d-flex align-items-center mb-3">
                                <button className={`btn btn-link px-3 py-2 ${tab === "pases" ? "fw-bold text-primary" : "text-secondary"}`} onClick={() => setTab("pases")}>
                                    <i className="bi bi-arrow-left-right me-2"></i>Historial de Pases
                                </button>
                                <button className={`btn btn-link px-3 py-2 ${tab === "audiencias" ? "fw-bold text-primary" : "text-secondary"}`} onClick={() => setTab("audiencias")}>
                                    <i className="bi bi-calendar-event me-2"></i>Audiencias
                                </button>
                                <button className={`btn btn-link px-3 py-2 ${tab === "ordenes" ? "fw-bold text-primary" : "text-secondary"}`} onClick={() => setTab("ordenes")}>
                                    <i className="bi bi-file-earmark-text me-2"></i>Órdenes
                                </button>
                            </div>
                            <div>
                                {tab === "pases" && (
                                    <TablaPases
                                        expedienteId={id}
                                        onNuevo={handleNuevoPase}
                                        onEditar={handleEditarPase}
                                        onVer={handleVerPase}
                                    />
                                )}
                                {tab === "audiencias" && (
                                    <TablaAudiencias
                                        expedienteId={expediente.id}
                                        token={localStorage.getItem("token")}
                                        personasInvolucradas={expediente.denuncia?.personas || []}
                                    />
                                )}
                                {tab === "ordenes" && (
                                    <OrdenesTabla ordenes={ordenes} onDescargar={handleDescargarOrden} onVer={handleVerOrden} onEliminar={handleEliminarOrden} mostrarModalOrden={handlerModalOrden} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- COLUMNA DERECHA (PERSONAS) --- */}
                <div className="col-lg-4">
                    <div className="card mb-4">
                        <div className="card-body">
                            <h5 className="card-title mb-3"><i className="bi bi-people me-2"></i>Personas Involucradas</h5>
                            {expediente.denuncia?.personas?.map((persona) => (
                                <div key={persona.id} className="mb-2">
                                    <strong>{persona.rol ? persona.rol.charAt(0).toUpperCase() + persona.rol.slice(1) : "Sin rol"}:</strong> {persona.nombre} {persona.apellido} - DNI: {persona.documento}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- RENDERIZADO DE TODOS LOS MODALES --- */}

            <FormularioPaseModal
                show={modalPase.show && (modalPase.modo === 'crear' || modalPase.modo === 'editar')}
                handleClose={handleCerrarModalPase}
                expedienteId={expediente.id}
                modo={modalPase.modo}
                paseInicial={modalPase.pase}
            />

            {modalPase.show && modalPase.modo === 'ver' && (
                <ModalVerPase
                    onClose={handleCerrarModalPase}
                    pase={modalPase.pase}
                />
            )}

            <ModalAudiencia show={modalAudiencia.show} modo={modalAudiencia.modo} audiencia={modalAudiencia.audiencia} onGuardar={handleGuardarAudiencia} onClose={handleCerrarModal} expedienteId={expediente.id} personasInvolucradas={expediente.denuncia?.personas || []} />
            <ModalSubirOrden show={mostrarModalOrden} onClose={() => setMostrarModalOrden(false)} expedienteId={expediente.id} onSubmitOrden={handlerSubirOrden} />
            {mostrarModalEditar && <ModalEditarExpediente expediente={expediente} onClose={() => setMostrarModalEditar(false)} actualizarExpediente={() => dispatch(fetchExpedienteById(id))} />}
            {archivoSeleccionado && pdfUrl && <ModalPDF archivo={archivoSeleccionado} pdfUrl={pdfUrl} onClose={() => { setArchivoSeleccionado(null); setPdfUrl(null); }} />}

        </div>
    );
}

