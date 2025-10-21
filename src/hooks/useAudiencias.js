// src/hooks/useAudiencias.js
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAudiencias,
  crearAudienciaThunk,
  editarAudienciaThunk,
  eliminarAudienciaThunk,
  selectAudiencias,
} from "../features/audiencias/audienciaSlice";

export const useAudiencias = (expedienteId, setMensaje) => {
  const dispatch = useDispatch();
  const audiencias = useSelector(selectAudiencias);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (expedienteId) {
      dispatch(fetchAudiencias({ expedienteId, token }));
    }
  }, [expedienteId, dispatch, token]);

  const guardarAudiencia = async (audiencia, modo, idAudiencia) => {
    try {
      if (modo === "crear") {
        await dispatch(crearAudienciaThunk({ audiencia, token })).unwrap();
        setMensaje("Audiencia creada correctamente");
      } else {
        await dispatch(
          editarAudienciaThunk({ id: idAudiencia, audiencia, token })
        ).unwrap();
        setMensaje("Audiencia editada correctamente");
      }
    } catch (error) {
      alert("Error al guardar la audiencia");
      console.error(error);
    }
  };

  const borrarAudiencia = async (id) => {
    try {
      await dispatch(eliminarAudienciaThunk({ id, token })).unwrap();
      setMensaje("Audiencia eliminada correctamente");
    } catch (error) {
      alert("Error al eliminar la audiencia");
      console.error(error);
    }
  };

  return { audiencias, guardarAudiencia, borrarAudiencia };
};
