import React from "react";
import { Link } from "react-router-dom";

const Expedientetabla = ({ expedientes }) => {
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
              <tr key={exp.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{exp.id}</td>
                <td className="px-4 py-2 border-b">
                  {exp.solicitante?.nombre} {exp.solicitante?.apellido}
                </td>
                <td className="px-4 py-2 border-b">{exp.objeto?.join(", ")}</td>
                <td className="px-4 py-2 border-b">{exp.motivo?.join(", ")}</td>
                <td className="px-4 py-2 border-b">{exp.solicitante?.dni}</td>
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
