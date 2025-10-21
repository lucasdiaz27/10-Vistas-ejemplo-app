import axios from "axios";

const BASE_URL = "http://localhost:8080/audiencias";

// función auxiliar para obtener token siempre que se haga una request
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

// Traer audiencias por expediente
export const traerAudienciasPorExpediente = async (expedienteId) => {
  const res = await axios.get(`${BASE_URL}/traeAudiPorExp/${expedienteId}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

// Crear una nueva audiencia
export const crearAudiencia = async (audiencia) => {
  const res = await axios.post(`${BASE_URL}/creaAudiencia`, audiencia, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

// Editar una audiencia existente
export const editarAudiencia = async (id, audiencia) => {
  const res = await axios.put(`${BASE_URL}/editarAudi/${id}`, audiencia, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

// Eliminar una audiencia
export const eliminarAudiencia = async (id) => {
  const res = await axios.delete(`${BASE_URL}/borrarAudiencia/${id}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};
