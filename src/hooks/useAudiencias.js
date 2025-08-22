import { useState, useEffect } from "react";
import { crearAudiencia, editarAudiencia, eliminarAudiencia, traerAudienciasPorExpediente } from "../apis/audienciasApi";

export const useAudiencias = (expedienteId, setMensaje) => {
  const [audiencias, setAudiencias] = useState([]);

  const cargarAudiencias = async () => {
    const token = localStorage.getItem("token");
    const data = await traerAudienciasPorExpediente(expedienteId, token);
    setAudiencias(data);
  };

  useEffect(() => {
    if (expedienteId) cargarAudiencias();
  }, [expedienteId]);

  const guardarAudiencia = async (audiencia, modo, idAudiencia) => {
    const token = localStorage.getItem("token");
    try {
      if (modo === "crear") {
        await crearAudiencia(audiencia, token);
        setMensaje("Audiencia creada correctamente");
      } else {
        await editarAudiencia(idAudiencia, audiencia, token);
        setMensaje("Audiencia editada correctamente");
      }
      await cargarAudiencias();
    } catch {
      alert("Error al guardar la audiencia");
    }
  };

  const borrarAudiencia = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await eliminarAudiencia(id, token);
      await cargarAudiencias();
      setMensaje("Audiencia eliminada correctamente");
    } catch {
      alert("Error al eliminar la audiencia");
    }
  };

  return { audiencias, guardarAudiencia, borrarAudiencia };
}
