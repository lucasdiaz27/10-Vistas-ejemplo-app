import React from "react";

const Expedientetabla = ({ expedientes, cambiarEstado }) => {
  return (
    <div className="overflow-x-auto shadow rounded-lg">
      <table className="min-w-full bg-white border border-gray-200 text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="px-4 py-2 border-b">Nro Formulario</th>
            <th className="px-4 py-2 border-b">Nro Orden</th>
            <th className="px-4 py-2 border-b">Solicitante</th>
            <th className="px-4 py-2 border-b">Tipo de documento</th>
            <th className="px-4 py-2 border-b">DNI</th>
            <th className="px-4 py-2 border-b">Fecha ingreso</th>
            <th className="px-4 py-2 border-b">Estado</th>
            <th className="px-4 py-2 border-b">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {expedientes && expedientes.length > 0 ? (
            expedientes.map((exp, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{exp.id}</td>
                <td className="px-4 py-2 border-b">{exp.nroOrden}</td>
                <td className="px-4 py-2 border-b">{exp.nombre}</td>
                <td className="px-4 py-2 border-b">{exp.tipoDocumento}</td>
                <td className="px-4 py-2 border-b">{exp.dni}</td>
                <td className="px-4 py-2 border-b">{exp.fechaIngreso}</td>
                <td className="px-4 py-2 border-b">{exp.estado}</td>
                <td className="px-4 py-2 border-b space-x-1">
                  <button
                    className="bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-700"
                    onClick={() => cambiarEstado(exp.id)}
                  >
                    Cambiar estado
                  </button>
                  <button className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">
                    ✔
                  </button>
                  <button className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">
                    ✖
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center py-4">
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
