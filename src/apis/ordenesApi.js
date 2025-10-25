// ordenesApi.js
// API para consumir las órdenes de un expediente desde el backend
import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_BASE_URL}doc`;

// Trae las órdenes por expediente
export const traerOrdenesPorExpediente = async (expedienteId, token) => {
  const res = await axios.get(`${BASE_URL}/traerOrdenesPorExpediente/${expedienteId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const eliminarOrden = async (id, token) => {
  const del = await axios.delete(`${BASE_URL}/eliminarDoc/${id}`, {
    headers: {Authorization: `Bearer ${token}`},
  })
  return del.data;
}

export const agregarOrden = async (formData, token) => {
  // El backend espera form-data con 'pase' (JSON) y 'file' (PDF)
  const res = await axios.post(`${BASE_URL}/crearOrden`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
}
