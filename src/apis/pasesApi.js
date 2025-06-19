import axios from "axios";

const BASE_URL = "http://localhost:8080/pases";

// Traer pases por expediente
export const traerPasesPorExp = async (expedienteId, token) => {
  const res = await axios.get(`${BASE_URL}/traerPasesPorExp/${expedienteId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Crear un nuevo pase
export const crearPase = async (pase, token) => {
  const res = await axios.post(`${BASE_URL}/crearPase`, pase, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Editar un pase existente
export const editarPase = async (id, pase, token) => {
  const res = await axios.put(`${BASE_URL}/editarPase/${id}`, pase, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Eliminar un pase
export const eliminarPase = async (id, token) => {
  const res = await axios.delete(`${BASE_URL}/borrarPase/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
