import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import React from "react";
import Expedientetabla from "../components/Expedientetabla";

const expedientes = [
  { id: 1, nombre: "Rea Gabriel Alejandro", dni: "45853860", fechaIngreso: "05-11-2024", estado: "PENDIENTE" },
  { id: 2, nombre: "Sosa Matias", dni: "987654321", fechaIngreso: "05-11-2024", estado: "APROBADO" },
  { id: 3, nombre: "Coro Maxi", dni: "123456789", fechaIngreso: "05-11-2024", estado: "RECHAZADO" },
];
// dsp agregar mas ahora me dio paja

const MenuInterno = () => {
const location = useLocation();
  const [vista, setVista] = useState(null);

  const expedientesEjemplo = [
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
  ];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const vistaParam = params.get("vista");
    setVista(vistaParam);
  }, [location]);

  return (
    <div className="container mt-4">
      <h2>Panel Interno</h2>

      {vista === "mesa-entrada" && <Expedientetabla />}
      {vista === "pases" && <p>Contenido de Pases (próximamente)</p>}
      {vista === "expedientes" && <p>Listado de expedientes</p>}
      {vista === "formulario" && <p>Formulario interno</p>}
      {vista === "usuarios" && <p>Gestión de usuarios</p>}
      {vista === "ajustes" && <p>Configuración del sistema</p>}
      {!vista && <p>Seleccioná una opción del menú superior.</p>}
    </div>
  );

  return (
    <div className="container mt-4">
      {/*Buscador*/}
      <div className="mb-4">
        <h2>Buscar solicitud</h2>
        <p>Ingresa número de solicitud para buscar formulario</p>
        <input
          type="text"
          className="form-control d-inline-block me-2"
          style={{ width: "200px" }}
        />
        <input
          type="text"
          className="form-control d-inline-block"
          style={{ width: "200px" }}
        />
      </div>

      <Expedientetabla expedientes={expedientes} />
      <div className="mt-5">
        <h4>Tabla fija de pruebas</h4>
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>Nombre</th>
              <th>Area</th>
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

      {/*Tabla*/}
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>Nro Formulario</th>
              <th>Solicitante</th>
              <th>DNI</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Rea Gabriel Alejandro</td>
              <td>45853860</td>
              <td>05-11-2024</td>
              <td>PENDIENTE</td>
              <td>
                <button className="btn btn-secondary btn-sm me-2">Detalles</button>
                <button className="btn btn-success btn-sm me-1">✔</button>
                <button className="btn btn-danger btn-sm">✖</button>
              </td>
            </tr>
            <tr>
              <td>2</td>
              <td>Sosa Matias</td>
              <td>987654321</td>
              <td>05-11-2024</td>
              <td>APROBADO</td>
              <td>
                <button className="btn btn-secondary btn-sm me-2">Detalles</button>
                <button className="btn btn-success btn-sm me-1">✔</button>
                <button className="btn btn-danger btn-sm">✖</button>
              </td>
            </tr>
            <tr>
              <td>1</td>
              <td>Coro Maxi</td>
              <td>123456789</td>
              <td>05-11-2024</td>
              <td>RECHAZADO</td>
              <td>
                <button className="btn btn-secondary btn-sm me-2">Detalles</button>
                <button className="btn btn-success btn-sm me-1">✔</button>
                <button className="btn btn-danger btn-sm">✖</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MenuInterno;

  