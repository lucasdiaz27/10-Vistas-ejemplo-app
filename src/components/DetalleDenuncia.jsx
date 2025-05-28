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
    <div>
      <h2>Detalle de Denuncia</h2>
      <p><strong>ID:</strong> {denuncia.id}</p>
      <p><strong>Objeto:</strong> {Array.isArray(denuncia.objeto) ? denuncia.objeto.join(", ") : denuncia.objeto}</p>
      <p><strong>Motivo:</strong> {Array.isArray(denuncia.motivo) ? denuncia.motivo.join(", ") : denuncia.motivo}</p>
      <p><strong>Estado:</strong> {denuncia.estado ?? "null"}</p>
      <p><strong>Fecha de ingreso:</strong> {denuncia.fechaIngreso || "-"}</p>
      <div style={{ margin: "1em 0" }}>
        <button
          className="btn btn-success"
          onClick={() => handleActualizarEstado("Aprobada")}
        >
          Aprobar
        </button>
        <button
          className="btn btn-danger"
          style={{ marginLeft: "1em" }}
          onClick={() => handleActualizarEstado("Rechazada")}
        >
          Rechazar
        </button>
      </div>
      <h4>Personas Involucradas</h4>
      <ul>
        {Array.isArray(denuncia.personas) && denuncia.personas.length > 0 ? (
          denuncia.personas.map((p, idx) => (
            <li key={idx} style={{ marginBottom: "1em" }}>
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
  );
};

export default DetalleDenuncia;