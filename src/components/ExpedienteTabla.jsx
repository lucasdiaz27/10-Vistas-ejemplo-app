import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { traerDenuncias } from "../apis/apiDenuncia";

const Expedientetabla = () => {
  const [expedientes, setExpedientes] = useState([]);

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

  return (
    <div className="overflow-x-auto shadow rounded-lg">
      <table className="min-w-full bg-white border border-gray-200 text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="px-4 py-2 border-b">ID</th>
            <th className="px-4 py-2 border-b">Solicitante</th>
            <th className="px-4 py-2 border-b">Objeto</th>
            <th className="px-4 py-2 border-b">Motivo</th>
            <th className="px-4 py-2 border-b">DNI</th>
            <th className="px-4 py-2 border-b">Estado</th>
            <th className="px-4 py-2 border-b">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {expedientes && expedientes.length > 0 ? (
            expedientes.map((exp) => (
              console.log("Personas:", exp.personas),
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
                <td className="px-4 py-2 border-b">{exp.estado ?? "null"}</td>
                <td className="px-4 py-2 border-b space-x-1">
                  <Link
                    to={`/denuncia/${exp.id}`}
                    className="btn btn-primary btn-sm"
                  >
                    Ver detalle
                  </Link>
                  <button className="btn btn-success btn-sm">✔</button>
                  <button className="btn btn-danger btn-sm">✖</button>
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
