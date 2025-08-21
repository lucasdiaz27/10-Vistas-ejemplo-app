import axios from "axios";

const BASE_URL = "http://localhost:8080/audiencias";

// Traer audiencias por expediente
export const traerAudienciasPorExpediente = async (expedienteId, token) => {
  const res = await axios.get(`${BASE_URL}/traeAudiPorExp/${expedienteId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  return res.data;
};

// Crear una nueva audiencia
export const crearAudiencia = async (audiencia, token) => {
  const res = await axios.post(`${BASE_URL}/creaAudiencia`, audiencia, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  return res.data;
};

// Editar una audiencia existente
export const editarAudiencia = async (id, audiencia, token) => {
  const res = await axios.put(`${BASE_URL}/editarAudi/${id}`, audiencia, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  return res.data;
};

// Eliminar una audiencia
export const eliminarAudiencia = async (id, token) => {
  const res = await axios.delete(`${BASE_URL}/borrarAudiencia/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  return res.data;
};
