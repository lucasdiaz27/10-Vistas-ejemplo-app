import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import React from "react";
import Expedientetabla from "../components/Expedientetabla";

const MenuInterno = () => {
  const location = useLocation();
  const [vista, setVista] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const vistaParam = params.get("vista");
    setVista(vistaParam);
  }, [location]);

  const expedientes = [
    {
      id: 1,
      nroOrden: "001",
      nombre: "Juan Pérez",
      tipoDocumento: "Reclamo",
      dni: "12345678",
      fechaIngreso: "2025-05-19",
      estado: "Pendiente",
    },
    {
      id: 2,
      nroOrden: "002",
      nombre: "Ana Gómez",
      tipoDocumento: "Denuncia",
      dni: "23456789",
      fechaIngreso: "2025-05-18",
      estado: "En proceso",
    },
    {
      id: 3,
      nroOrden: "003",
      nombre: "Lucas Díaz",
      tipoDocumento: "Reclamo",
      dni: "34567890",
      fechaIngreso: "2025-05-17",
      estado: "Aprobado",
    },
  ];

  return (
    <div className="container mt-4">
      <h2>Panel Interno</h2>

      {/* Vista dinámica según parámetro en URL */}
      {vista === "mesa-entrada" && (
        <>
          {/* Buscador */}
          <div className="mb-4">
            <h4>Buscar solicitud</h4>
            <p>Ingresá número de solicitud para buscar formulario</p>
            <input
              type="text"
              placeholder="Número de formulario"
              className="form-control d-inline-block me-2"
              style={{ width: "200px" }}
            />
            <input
              type="text"
              placeholder="DNI"
              className="form-control d-inline-block"
              style={{ width: "200px" }}
            />
          </div>

          {/* Tabla de expedientes */}
          <Expedientetabla expedientes={expedientes} />

          {/* Tabla fija de prueba */}
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


  