import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import React from "react";
import Expedientetabla from "../components/Expedientetabla";
import Pases from "../components/pases/Pases";
import Expedientes from "../components/expedientes/Expedientes";
import { FaEye } from "react-icons/fa";
import { traerDenuncias } from "../apis/apiDenuncia";
import MesaEntradaTabla from "../components/MesaEntradaTabla";
import VistaUsuarios2 from "../components/usuarios/VistaUsuarios2";
// import VistaAjustes from "../components/ajustes/VistaAjustes";

const MenuInterno = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [vista, setVista] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [expedientes, setExpedientes] = useState([
    {
      id: 1,
      nroOrden: "001",
      nombre: "Luma Perez",
      tipoDocumento: "Reclamo",
      dni: "12345678",
      fechaIngreso: "2025-05-19",
      estado: "Pendiente",
    },
    {
      id: 2,
      nroOrden: "002",
      nombre: "Ale React",
      tipoDocumento: "Denuncia",
      dni: "23456789",
      fechaIngreso: "2025-05-18",
      estado: "En proceso",
    },
    {
      id: 3,
      nroOrden: "003",
      nombre: "Lucas Diaz",
      tipoDocumento: "Reclamo",
      dni: "34567890",
      fechaIngreso: "2025-05-17",
      estado: "Aprobado",
    },
  ]);
  const [modal, setModal] = useState({ abierto: false, denuncia: null });
  const [denuncias, setDenuncias] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState("");
  const [busquedaDenuncia, setBusquedaDenuncia] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const vistaParam = params.get("vista");
    setVista(vistaParam);
    if (vistaParam === "mesa-entrada") {
      setDenuncias([]);
      traerDenuncias()
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setDenuncias(
              data.map((d) => {
                return {
                  id: d.id,
                  solicitante:
                    d.personas && d.personas.length > 0
                      ? `${d.personas[0].nombre || ""} ${d.personas[0].apellido || ""}`.trim()
                      : "",
                  objeto: Array.isArray(d.objeto)
                    ? d.objeto.join(", ")
                    : d.objeto || "",
                  motivo: Array.isArray(d.motivo)
                    ? d.motivo.join(", ")
                    : d.motivo || "",
                  descripcion: d.descripcion || "",
                  fechaIngreso: d.fechaIngreso || d.fechaCreacion || d.fecha || "",
                  estado: d.estado || "",
                  archivo: d.archivo || null,
                };
              })
            );
          } else {
            setDenuncias([]);
          }
        })
        .catch((err) => {
          setDenuncias([]);
          console.error("Error al traer denuncias del backend:", err);
        });
    }
  }, [location]);

  // Ejemplo local de denuncias para visualizar la tabla si el backend no responde
  useEffect(() => {
    if (vista === "mesa-entrada" && denuncias.length === 0) {
      setDenuncias([
        {
          id: 101,
          solicitante: "Juan Pérez",
          objeto: "Ruidos molestos",
          motivo: "Vecino con música alta",
          descripcion: "El vecino del departamento 3B pone música fuerte todas las noches.",
          fechaIngreso: "2025-06-04",
          estado: "Pendiente",
          archivo: null,
        },
        {
          id: 102,
          solicitante: "Ana Gómez",
          objeto: "Obra sin permiso",
          motivo: "Construcción ilegal",
          descripcion: "Se está construyendo una ampliación sin cartel de obra.",
          fechaIngreso: "2025-06-03",
          estado: "Aprobada",
          archivo: null,
        },
        {
          id: 103,
          solicitante: "Carlos Ruiz",
          objeto: "Mascota suelta",
          motivo: "Perro sin correa",
          descripcion: "Un perro grande circula suelto en la plaza.",
          fechaIngreso: "2025-06-02",
          estado: "Rechazada",
          archivo: null,
        },
      ]);
    }
  }, [vista, denuncias.length]);

  // Mapeo de estados a colores y etiquetas más estéticas
  const ESTADO_CONFIG = {
    pendiente: { label: "Pendiente", color: "warning" },
    aprobada: { label: "Aprobada", color: "success" },
    "en proceso": { label: "En Proceso", color: "info" },
    "no admitido": { label: "No Admitido", color: "secondary" },
    rechazada: { label: "Rechazada", color: "danger" },
  };

  //  Cambia estado de un expediente
  const cambiarEstado = (id) => {
    const nuevos = expedientes.map((exp) => {
      if (exp.id === id) {
        let nuevoEstado = "Pendiente";
        if (exp.estado === "Pendiente") nuevoEstado = "En proceso";
        else if (exp.estado === "En proceso") nuevoEstado = "Aprobado";
        else if (exp.estado === "Aprobado") nuevoEstado = "Pendiente";

        return { ...exp, estado: nuevoEstado };
      }
      return exp;
    });

    setExpedientes(nuevos);
  };

  // Filtrado y búsqueda de denuncias
  const denunciasFiltradas = denuncias.filter((d) => {
    const texto = busquedaDenuncia.toLowerCase();
    // Normalizar estado para evitar problemas de mayúsculas/minúsculas y espacios
    const estadoDenuncia = (d.estado || "").toLowerCase().trim();
    const estadoFiltro = (filtroEstado || "").toLowerCase().trim();
    return (
      (!filtroEstado || estadoDenuncia === estadoFiltro) &&
      (
        d.id?.toString().includes(texto) ||
        (d.solicitante || "").toLowerCase().includes(texto) ||
        (d.objeto || "").toLowerCase().includes(texto) ||
        (d.motivo || "").toLowerCase().includes(texto) ||
        (d.descripcion || "").toLowerCase().includes(texto) ||
        (d.fechaIngreso || "").toLowerCase().includes(texto)
      )
    );
  });

  // Acciones
  const abrirDetalle = (denuncia) => navigate(`/denuncia/${denuncia.id}`);
  const aceptar = (id) => alert(`Denuncia ${id} aceptada (ejemplo)`);
  const rechazar = (id) => alert(`Denuncia ${id} rechazada (ejemplo)`);

  //  Filtro general (por nombre, estado, nroOrden o dni)
  const texto = busqueda.toLowerCase();
  const expedientesFiltrados = expedientes.filter((exp) => {
    return (
      exp.nroOrden.toLowerCase().includes(texto) ||
      exp.dni.toLowerCase().includes(texto) ||
      exp.nombre.toLowerCase().includes(texto) ||
      exp.estado.toLowerCase().includes(texto)
    );
  });

  return (
    <div className="container mt-4">
      <h2 className="mb-4 fw-bold">Mesa de Entrada</h2>
      {vista === "mesa-entrada" && (
        <>
          <MesaEntradaTabla
            denuncias={denunciasFiltradas}
            filtroEstado={filtroEstado}
            setFiltroEstado={setFiltroEstado}
            busquedaDenuncia={busquedaDenuncia}
            setBusquedaDenuncia={setBusquedaDenuncia}
            abrirDetalle={abrirDetalle}
            aceptar={aceptar}
            rechazar={rechazar}
            estadoConfig={ESTADO_CONFIG}
          />
        </>
      )}
      {vista === "pases" && <Pases />}
      {vista === "expedientes" && <Expedientes />}
      {vista === "formulario" && <p>Formulario interno</p>}
      {vista === "usuarios" && <VistaUsuarios2 />}
      {vista === "ajustes" && <p>Vista de ajustes (en construcción)</p>}
      {!vista && <p>Seleccioná una opción del menú superior.</p>}
    </div>
  );
};

export default MenuInterno;