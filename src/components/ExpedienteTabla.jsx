import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { traerExpedientes, borrarExpediente } from "../apis/expedientesApi";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

const Expedientetabla = () => {
  const [expedientes, setExpedientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const cargarExpedientes = async () => {
    try {
      const token = localStorage.getItem('token');
      const data = await traerExpedientes(token);
      setExpedientes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar expedientes:", error);
    }
  };

  useEffect(() => {
    cargarExpedientes();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await borrarExpediente(id, token);
        Swal.fire('Eliminado', 'El expediente ha sido eliminado.', 'success');
        cargarExpedientes();
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar el expediente', 'error');
      }
    }
  };

  // Filtrado
  const expedientesFiltrados = expedientes.filter((exp) => {
    const descripcion = (exp.descripcion || "").toLowerCase();
    const tipo = (exp.tipo || "").toLowerCase();
    const texto = busqueda.toLowerCase();
    return (
      descripcion.includes(texto) ||
      tipo.includes(texto) ||
      String(exp.id).includes(texto)
    );
  });

  return (
    <div className="mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          placeholder="Buscar..."
          className="form-control"
          style={{ width: "300px" }}
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        {/* Botón para crear nuevo expediente (si aplica UI directa) */}
      </div>

      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full bg-white border border-gray-200 text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2 border-b">ID</th>
              <th className="px-4 py-2 border-b">Descripción</th>
              <th className="px-4 py-2 border-b">Tipo</th>
              <th className="px-4 py-2 border-b">Fecha Creación</th>
              <th className="px-4 py-2 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {expedientesFiltrados && expedientesFiltrados.length > 0 ? (
              expedientesFiltrados.map((exp) => (
                <tr key={exp.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{exp.id}</td>
                  <td className="px-4 py-2 border-b">{exp.descripcion}</td>
                  <td className="px-4 py-2 border-b">
                    <span className="badge bg-secondary">{exp.tipo}</span>
                  </td>
                  <td className="px-4 py-2 border-b">
                    {exp.createdAt ? new Date(exp.createdAt).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-4 py-2 d-flex align-items-center gap-2">
                    <Link
                      to={`/expediente/${exp.id}`}
                      className="btn btn-link p-0 text-primary"
                      title="Ver detalle"
                    >
                      <FaEye />
                    </Link>
                    <button
                      className="btn btn-link p-0 text-danger"
                      title="Eliminar"
                      onClick={() => handleDelete(exp.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No hay expedientes disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Expedientetabla;
