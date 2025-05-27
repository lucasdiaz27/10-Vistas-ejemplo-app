import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { traerDenuncias } from "../apis/apiDenuncia";

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
      <h4>Personas Involucradas</h4>
      <ul>
        {Array.isArray(denuncia.personas) && denuncia.personas.length > 0 ? (
          denuncia.personas.map((p, idx) => (
            <li key={idx} style={{ marginBottom: "1em" }}>
              <strong>Nombre:</strong> {p.nombre} {p.apellido}<br />
              <strong>DNI:</strong> {p.documento}<br />
              <strong>Email:</strong> {p.email}<br />
              <strong>Teléfono:</strong> {p.telefono}<br />
              {/* Agrega aquí cualquier otro campo que venga en el objeto persona */}
            </li>
          ))
        ) : (
          <li>No hay personas asociadas.</li>
        )}
      </ul>
      {/* Agrega aquí cualquier otro campo que venga en el objeto denuncia */}
    </div>
  );
};

export default DetalleDenuncia;