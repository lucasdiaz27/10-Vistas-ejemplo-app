import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2";
import { traerDenuncias } from "../apis/apiDenuncia";
import MesaEntradaTabla from "../components/MesaEntradaTabla";
import VistaUsuarios2 from "../components/usuarios/VistaUsuarios2";
import {
  existeExpedienteParaDenuncia,
  crearExpedienteDesdeDenuncia,
  actualizarExpediente,
  traerExpedientes,
} from "../apis/expedientesApi";
import Expedientes from "../components/expedientes/Expedientes";
import Pases from "../components/pases/Pases";
import GeneradorPDF from "../components/pdf/GeneradorPDF"; // <-- Importa el nuevo componente

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
    if (!vistaParam) {
      navigate("/menu-interno?vista=mesa-entrada", { replace: true });
      return;
    }
    setVista(vistaParam);
    if (vistaParam === "mesa-entrada") {
      setDenuncias([]);
      const token = localStorage.getItem("token"); // <-- Obtén el token aquí
      console.log(token)
      traerDenuncias(token)
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setDenuncias(
              data.map((d) => {
                return {
                  id: d.id,
                  solicitante:
                    d.personas && d.personas.length > 0
                      ? `${d.personas[0].nombre || ""} ${
                          d.personas[0].apellido || ""
                        }`.trim()
                      : "",
                  objeto: Array.isArray(d.objeto)
                    ? d.objeto.join(", ")
                    : d.objeto || "",
                  motivo: Array.isArray(d.motivo)
                    ? d.motivo.join(", ")
                    : d.motivo || "",
                  descripcion: d.descripcion || "",
                  fechaIngreso:
                    d.fechaIngreso || d.fechaCreacion || d.fecha || "",
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
  }, [location, navigate]);

  // Ejemplo local de denuncias para visualizar la tabla si el backend no responde
  useEffect(() => {
    if (vista === "mesa-entrada" && denuncias.length === 0) {
      setDenuncias([
        {
          id: 101,
          solicitante: "Juan Pérez",
          objeto: "Ruidos molestos",
          motivo: "Vecino con música alta",
          descripcion:
            "El vecino del departamento 3B pone música fuerte todas las noches.",
          fechaIngreso: "2025-06-04",
          estado: "Pendiente",
          archivo: null,
        },
        {
          id: 102,
          solicitante: "Ana Gómez",
          objeto: "Obra sin permiso",
          motivo: "Construcción ilegal",
          descripcion:
            "Se está construyendo una ampliación sin cartel de obra.",
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
    "ADMITIDO": { label: "ADMITIDO", color: "success" },
    "RECHAZADO": { label: "RECHAZADO", color: "danger" },
    "AS. LEGAL": { label: "ASESORÍA LEGAL", color: "info" },
    "EN PROCESO": { label: "EN PROCESO", color: "info" },
    "EN INSPECCIÓN": { label: "EN INSPECCIÓN", color: "warning" },
    "EN SUBDIR": { label: "EN SUBDIRECCIÓN", color: "primary" },
    "EN DIR": { label: "EN DIRECCIÓN", color: "primary" },
    "FINALIZADO": { label: "FINALIZADO", color: "success" },
    // Estados en minúsculas para compatibilidad con datos existentes
    "admitido": { label: "ADMITIDO", color: "success" },
    "rechazado": { label: "RECHAZADO", color: "danger" },
    "as. legal": { label: "ASESORÍA LEGAL", color: "info" },
    "en proceso": { label: "EN PROCESO", color: "info" },
    "en inspección": { label: "EN INSPECCIÓN", color: "warning" },
    "en subdir": { label: "EN SUBDIRECCIÓN", color: "primary" },
    "en dir": { label: "EN DIRECCIÓN", color: "primary" },
    "finalizado": { label: "FINALIZADO", color: "success" },
    // Estados anteriores para compatibilidad
    "pendiente": { label: "PENDIENTE", color: "warning" },
    "aprobada": { label: "APROBADA", color: "success" },
    "no admitido": { label: "NO ADMITIDO", color: "secondary" },
    "rechazada": { label: "RECHAZADA", color: "danger" },
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

  // Actualiza el estado del expediente existente según el id de la denuncia
  const actualizarEstadoExpediente = (
    denunciaId,
    nuevoEstado,
    datosDenuncia = null
  ) => {
    setExpedientes((prev) => {
      // Convertí ambos a string para comparar SIEMPRE
      const existe = prev.some((exp) => String(exp.id) === String(denunciaId));

      let nuevos;
      if (existe) {
        // Solo actualiza el estado del expediente existente
        nuevos = prev.map((exp) =>
          String(exp.id) === String(denunciaId)
            ? { ...exp, estado: nuevoEstado }
            : exp
        );
      } else if (datosDenuncia) {
        // Si no existe, crea un nuevo expediente con los datos de la denuncia
        const nuevoExpediente = {
          id: String(datosDenuncia.id),
          nombre: datosDenuncia.solicitante,
          tipoDocumento: datosDenuncia.objeto,
          dni: "", // o datosDenuncia.dni si lo tenés
          fechaIngreso: datosDenuncia.fechaIngreso,
          estado: nuevoEstado,
        };
        nuevos = [...prev, nuevoExpediente];
      } else {
        return prev;
      }

      // Ordena por fechaIngreso (o por id si preferís)
      nuevos = nuevos
        .sort((a, b) => new Date(a.fechaIngreso) - new Date(b.fechaIngreso))
        .map((exp, idx) => ({
          ...exp,
          nroOrden: (idx + 1).toString().padStart(3, "0"),
        }));

      return nuevos;
    });
  };

  // const handleActualizarExpediente = async (
  //   denunciaId,
  //   nuevoEstado,
  //   dataParaActualizarOCrear
  // ) => {
  //   const expedientes = await traerExpedientes();
  //   // Buscá el expediente relacionado a la denuncia
  //   const expediente = expedientes.find(
  //     (exp) => exp.denuncia && String(exp.denuncia.id) === String(denunciaId)
  //   );

  //   if (nuevoEstado.toLowerCase() === "en proceso") {
  //     if (expediente) {
  //       // Si ya existe, solo actualizá el estado
  //       await actualizarExpediente(expediente.id, {
  //         ...expediente,
  //         estado: "En proceso",
  //       });
  //     } else {
  //       // Si no existe, creá el expediente
  //       await crearExpedienteDesdeDenuncia(denunciaId);
  //     }
  //   } else {
  //     // Para otros estados, actualizá el expediente si existe
  //     if (expediente) {
  //       await actualizarExpediente(expediente.id, {
  //         ...expediente,
  //         estado: nuevoEstado,
  //       });
  //     } else {
  //       alert("No existe expediente para esta denuncia.");
  //     }
  //   }
  // };

  // Filtrado y búsqueda de denuncias - Ahora se maneja en MesaEntradaTabla
  // const denunciasFiltradas = denuncias.filter((d) => {
  //   const texto = busquedaDenuncia.toLowerCase();
  //   // Normalizar estado para evitar problemas de mayúsculas/minúsculas y espacios
  //   const estadoDenuncia = (d.estado || "").toLowerCase().trim();
  //   const estadoFiltro = (filtroEstado || "").toLowerCase().trim();
  //   return (
  //     (!filtroEstado || estadoDenuncia === estadoFiltro) &&
  //     (d.id?.toString().includes(texto) ||
  //       (d.solicitante || "").toLowerCase().includes(texto) ||
  //       (d.objeto || "").toLowerCase().includes(texto) ||
  //       (d.motivo || "").toLowerCase().includes(texto) ||
  //       (d.descripcion || "").toLowerCase().includes(texto) ||
  //       (d.fechaIngreso || "").toLowerCase().includes(texto))
  //   );
  // });

  // Acciones
  const abrirDetalle = (denuncia) => navigate(`/denuncia/${denuncia.id}`);
  const aceptar = (id) => {
    setDenuncias((prev) =>
      prev.map((d) => (d.id === id ? { ...d, estado: "Aprobada" } : d))
    );
    const datosDenuncia = denuncias.find((d) => d.id === id);
    //handleActualizarExpediente(id, "Aprobada", datosDenuncia);
  };
  const rechazar = (id) => {
    setDenuncias((prev) =>
      prev.map((d) => (d.id === id ? { ...d, estado: "Rechazada" } : d))
    );
    const datosDenuncia = denuncias.find((d) => d.id === id);
    //handleActualizarExpediente(id, "Rechazada", datosDenuncia);
  };

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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("actualizarExpediente") === "1") {
      const id = params.get("id");
      const estado = params.get("estado");
      if (denuncias.length > 0) {
        const datosDenuncia = denuncias.find(
          (d) => String(d.id) === String(id)
        );
        if (id && estado && datosDenuncia) {
          //handleActualizarExpediente(id, estado, datosDenuncia);
          navigate("/menu-interno?vista=mesa-entrada", { replace: true });
        }
      }
    }
  }, [location.search, denuncias, navigate]);

  const handleCrearExpedienteEnProceso = async (denunciaId) => {
    const yaExiste = await existeExpedienteParaDenuncia(denunciaId);
    if (yaExiste) {
      alert(
        "Ya existe un expediente para esta denuncia. No se puede crear otro."
      );
      Swal.fire({
        icon: 'warning',
        title: 'Expediente existente',
        text: 'Ya existe un expediente para esta denuncia. No se puede crear otro.',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#ff9800',
        background: '#f8fafc',
        customClass: {
          title: 'swal2-title-modern',
          popup: 'swal2-popup-modern',
        },
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        }
      });
      return;
    }
    await crearExpedienteDesdeDenuncia(denunciaId);
    // Opcional: recargá la lista de expedientes
  };

  return (
    <div className="container mt-4">
      {vista === "mesa-entrada" && (
        <>
          <MesaEntradaTabla
            denuncias={denuncias}
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
      {/* NUEVO: Opción para probar el generador de PDF */}
      {vista === "prueba-pdf" && (
        <div className="my-4">
          <h2>Prueba Generador de PDF</h2>
          <GeneradorPDF />
        </div>
      )}
      {!vista && <p>Seleccioná una opción del menú superior.</p>}
    </div>
  );
};

export default MenuInterno;
