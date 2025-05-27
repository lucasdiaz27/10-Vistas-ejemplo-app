import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { traerDenuncias, eliminarDenuncia, actualizarEstadoDenuncia } from "../apis/apiDenuncia";

const DetalleDenuncia = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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

  const handleEliminar = async () => {
    try {
      await eliminarDenuncia(id);
      navigate("/lista-denuncias");
    } catch (error) {
      console.error("Error al eliminar denuncia:", error);
    }
  };

  const handleActualizarEstado = async (nuevoEstado) => {
    try {
      await actualizarEstadoDenuncia(denuncia.id, nuevoEstado);
      // Opcional: recargar la denuncia para ver el nuevo estado
      setDenuncia({ ...denuncia, estado: nuevoEstado });
    } catch (error) {
      console.error("Error al actualizar estado:", error);
    }
  };

  if (!denuncia) {
    return <p>Cargando denuncia...</p>;
  }

  return (
    <div>
      <h2>Detalle de Denuncia</h2>
      <p><strong>ID:</strong> {denuncia.id}</p>
      <p><strong>Objeto:</strong> {denuncia.objeto?.join(", ")}</p>
      <p><strong>Motivo:</strong> {denuncia.motivo?.join(", ")}</p>
      <p><strong>Estado:</strong> {denuncia.estado ?? "null"}</p>
      <h4>Personas Involucradas</h4>
      <ul>
        {denuncia.personas?.map((p, idx) => (
          <li key={idx}>
            <strong>Rol:</strong> {p.rol}<br />
            {p.persona ? (
              <>
                <strong>Nombre:</strong> {p.persona.nombre} {p.persona.apellido}<br />
                <strong>DNI:</strong> {p.persona.documento}<br />
                <strong>Email:</strong> {p.persona.email}<br />
                <strong>Teléfono:</strong> {p.persona.telefono}<br />
              </>
            ) : (
              <span className="text-danger">Datos de persona no disponibles</span>
            )}
            {p.nombre_delegado && (
              <>
                <strong>Delegado:</strong> {p.nombre_delegado} {p.apellido_delegado} (DNI: {p.dni_delegado})<br />
              </>
            )}
            <hr />
          </li>
        ))}
      </ul>
      <button onClick={handleEliminar} className="btn btn-danger">Eliminar Denuncia</button>
      <button
        onClick={() => handleActualizarEstado("Aprobada")}
        className="btn btn-success"
      >
        Aprobar
      </button>
      <button
        onClick={() => handleActualizarEstado("Rechazada")}
        className="btn btn-danger"
      >
        Rechazar
      </button>
    </div>
  );
};

export default DetalleDenuncia;