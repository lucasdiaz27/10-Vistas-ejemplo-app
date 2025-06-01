import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { traerDenuncias } from "../apis/apiDenuncia";
import { date } from "zod";
import { FaEye, FaEdit } from "react-icons/fa";


const Expedientetabla = () => {
  const [expedientes, setExpedientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const cargarExpedientes = async () => {
      try {
        const data = await traerDenuncias();
        setExpedientes(data);
      } catch (error) {
        console.error("Error al cargar expedientes:", error);
      }
    };
    cargarExpedientes();
  }, []);

  const getSolicitante = (personas) => {
    if (!Array.isArray(personas) || personas.length === 0) return "";
    return `${personas[0].nombre || ""} ${personas[0].apellido || ""}`;
  };

  const getDniSolicitante = (personas) => {
    if (!Array.isArray(personas) || personas.length === 0) return "";
    return personas[0].documento || "";
  };

  // Filtrado
  const expedientesFiltrados = expedientes.filter((exp) => {
    const solicitante = getSolicitante(exp.personas).toLowerCase();
    const dni = getDniSolicitante(exp.personas).toLowerCase();
    const estado = (exp.estado ?? "").toLowerCase();
    const nroOrden = (exp.nroOrden ?? "").toLowerCase();
    const texto = busqueda.toLowerCase();
    return (
      solicitante.includes(texto) ||
      dni.includes(texto) ||
      estado.includes(texto) ||
      nroOrden.includes(texto)
    );
  });

  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Buscar por nombre, estado, número o DNI"
        className="form-control mb-3"
        style={{ width: "300px" }}
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
      <div className="overflow-x-auto shadow rounded-lg">
      </div>
      <table className="min-w-full bg-white border border-gray-200 text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="px-4 py-2 border-b">ID</th>
            <th className="px-4 py-2 border-b">Solicitante</th>
            <th className="px-4 py-2 border-b">Objeto</th>
            <th className="px-4 py-2 border-b">Motivo</th>
            <th className="px-4 py-2 border-b">Descripcion</th>
            <th className="px-4 py-2 border-b">Fecha de Ingreso</th>
            <th className="px-4 py-2 border-b">Estado</th>
            <th className="px-4 py-2 border-b">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {expedientesFiltrados && expedientesFiltrados.length > 0 ? (
            expedientesFiltrados.map((exp) => (
              <tr key={exp.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{exp.id}</td>
                <td className="px-4 py-2 border-b">
                  {getSolicitante(exp.personas)}
                </td>
                <td className="px-4 py-2 border-b">{exp.objeto?.join(", ")}</td>
                <td className="px-4 py-2 border-b">{exp.motivo?.join(", ")}</td>
                <td className="px-4 py-2 border-b">
                  {getDniSolicitante(exp.personas)}
                </td>
                <td className="px-4 py-2 border-b">{date}</td> {/* tratandod de poner fecha*/}
                <td className="px-4 py-2 border-b">{exp.estado ?? "null"}</td>
                <td className="px-4 py-2  d-flex align-items-center gap-2">
  <Link
    to={`/denuncia/${exp.id}`}
    className="btn btn-link p-0 text-primary"
    title="Ver detalle"
  >
    <FaEye />
  </Link>

  <button
    className="btn btn-link p-0 text-secondary"
    title="Editar"
    onClick={() => alert("Todavía no anda esto xD")}
  >
    <FaEdit />
  </button>
</td>

              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center py-4">
                No hay expedientes disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Expedientetabla;
