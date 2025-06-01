import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { traerDenuncias, actualizarEstadoDenuncia } from "../apis/apiDenuncia";

const DetalleDenuncia = () => {
  const { id } = useParams();
  const [denuncia, setDenuncia] = useState(null);

  useEffect(() => {
    const obtenerDenuncia = async () => {
      try {
        const data = await traerDenuncias();
        const denunciaEncontrada = data.find((d) => d.id === parseInt(id));
        setDenuncia(denunciaEncontrada);
      } catch (error) {
        console.error("Error al obtener denuncia:", error);
      }
    };

    obtenerDenuncia();
  }, [id]);

  const handleActualizarEstado = async (nuevoEstado) => {
    try {
      await actualizarEstadoDenuncia(denuncia.id, nuevoEstado);
      setDenuncia({ ...denuncia, estado: nuevoEstado });
    } catch (error) {
      alert("Error al actualizar el estado");
      console.error(error);
    }
  };

  if (!denuncia) {
    return <p>Cargando denuncia...</p>;
  }

  return (
  <div className="container py-5">
    <div className="row justify-content-center">
      {/* Box Izquierdo */}
      <div className="col-md-5 m-3">
        <div className="p-4 bg-white shadow rounded">
          <h2>Detalle de Denuncia</h2>
          <p><strong>ID:</strong> {denuncia.id}</p>
          <p><strong>Objeto:</strong> {Array.isArray(denuncia.objeto) ? denuncia.objeto.join(", ") : denuncia.objeto}</p>
          <p><strong>Motivo:</strong> {Array.isArray(denuncia.motivo) ? denuncia.motivo.join(", ") : denuncia.motivo}</p> 
          <p><strong>Estado:</strong></p>
<select
  className="form-select mt-2"
  value={denuncia.estado || "Pendiente"}
  onChange={(e) => handleActualizarEstado(e.target.value)}
>
  <option value="Pendiente">Pendiente</option>
  <option value="En Proceso">En Proceso</option>
  <option value="No Admitido">No Admitido</option>
</select>

        </div>
      </div>

      {/* Box Derecho */}
      <div className="col-md-5 m-3">
        <div className="p-4 bg-white shadow rounded">
          <h4>Personas Involucradas</h4>
          <ul className="mt-3">
            {Array.isArray(denuncia.personas) && denuncia.personas.length > 0 ? (
              denuncia.personas.map((p, idx) => (
                <li key={idx} className="mb-3">
                  <strong>Nombre:</strong> {p.nombre} {p.apellido}<br />
                  <strong>DNI:</strong> {p.documento}<br />
                  <strong>Email:</strong> {p.email}<br />
                  <strong>Teléfono:</strong> {p.telefono}<br />
                </li>
              ))
            ) : (
              <li>No hay personas asociadas.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  </div>
);

};

export default DetalleDenuncia;