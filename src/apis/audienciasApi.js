import axios from "axios";

const BASE_URL = "http://localhost:8080/audiencias";

// Traer audiencias por expediente
export const traerAudienciasPorExpediente = async (expedienteId) => {
  const res = await axios.get(`${BASE_URL}/traeAudiPorExp/${expedienteId}`);
  return res.data;
};

// Crear una nueva audiencia
export const crearAudiencia = async (audiencia) => {
  const res = await axios.post(`${BASE_URL}/creaAudiencia`, audiencia);
  return res.data;
};

// Editar una audiencia existente
export const editarAudiencia = async (id, audiencia) => {
  const res = await axios.put(`${BASE_URL}/editarAudi/${id}`, audiencia);
  return res.data;
};

// Eliminar una audiencia
export const eliminarAudiencia = async (id) => {
  const res = await axios.delete(`${BASE_URL}/borrarAudiencia/${id}`);
  return res.data;
};
