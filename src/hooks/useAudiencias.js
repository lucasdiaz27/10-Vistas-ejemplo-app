import { useState, useEffect } from "react";
import { crearAudiencia, editarAudiencia, eliminarAudiencia, traerAudienciasPorExpediente } from "../apis/audienciasApi";
import { showSuccessAlert, showAlert } from "../utils/accessDenied";

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
        showSuccessAlert('¡Audiencia creada exitosamente! ');
      } else {
        await editarAudiencia(idAudiencia, audiencia, token);
        showSuccessAlert('¡Audiencia actualizada exitosamente! ');
      }
      await cargarAudiencias();
    } catch {
      showAlert({
        title: 'Error',
        text: 'No se pudo guardar la audiencia',
        icon: 'error'
      });
    }
  };

  const borrarAudiencia = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await eliminarAudiencia(id, token);
      await cargarAudiencias();
      showSuccessAlert('¡Audiencia eliminada correctamente! ');
    } catch {
      showAlert({
        title: 'Error',
        text: 'No se pudo eliminar la audiencia',
        icon: 'error'
      });
    }
  };

  return { audiencias, guardarAudiencia, borrarAudiencia };
}
