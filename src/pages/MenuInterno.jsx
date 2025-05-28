import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import React from "react";
import Expedientetabla from "../components/Expedientetabla";

const MenuInterno = () => {
  const location = useLocation();
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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const vistaParam = params.get("vista");
    setVista(vistaParam);
  }, [location]);

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
      <h2>Panel Interno</h2>

      {vista === "mesa-entrada" && (
        <>
          {/* Buscador */}
          
            <p>Filtrá por nombre, estado, número o DNI</p>
            

          {/* Tabla filtrada */}
          <Expedientetabla
            expedientes={expedientesFiltrados}
            cambiarEstado={cambiarEstado}
          />

          {/* Tabla fija de pruebas */}
          <div className="mt-5">
            <h4>Tabla fija de pruebas</h4>
            <table className="table table-bordered table-hover">
              <thead className="table-light">
                <tr>
                  <th>Nombre</th>
                  <th>Área</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Lucas Díaz</td>
                  <td>Inspección</td>
                </tr>
                <tr>
                  <td>Ale Rea</td>
                  <td>Legales</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}

      {vista === "pases" && <p>Contenido de Pases (próximamente)</p>}
      {vista === "expedientes" && <p>Listado de expedientes</p>}
      {vista === "formulario" && <p>Formulario interno</p>}
      {vista === "usuarios" && <p>Gestión de usuarios</p>}
      {vista === "ajustes" && <p>Configuración del sistema</p>}
      {!vista && <p>Seleccioná una opción del menú superior.</p>}
    </div>
  );
};

export default MenuInterno;


  