import { authAxios } from "../utils/auth";

const BASE_URL = `/audiencias`;

// Traer audiencias por expediente
export const traerAudienciasPorExpediente = async (expedienteId, token) => {
  const res = await authAxios.get(`${BASE_URL}/traeAudiPorExp/${expedienteId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  return res.data;
};

// Crear una nueva audiencia
export const crearAudiencia = async (audiencia, token) => {
  const res = await authAxios.post(`${BASE_URL}/creaAudiencia`, audiencia, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  return res.data;
};

// Editar una audiencia existente
export const editarAudiencia = async (id, audiencia, token) => {
  const res = await authAxios.put(`${BASE_URL}/editarAudi/${id}`, audiencia, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  return res.data;
};

// Eliminar una audiencia
export const eliminarAudiencia = async (id, token) => {
  const res = await authAxios.delete(`${BASE_URL}/borrarAudiencia/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  return res.data;
};
