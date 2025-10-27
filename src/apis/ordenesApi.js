// ordenesApi.js
// API para consumir las órdenes de un expediente desde el backend

import { authAxios } from "../utils/auth";

const BASE_URL = `/doc`;

// Trae las órdenes por expediente
export const traerOrdenesPorExpediente = async (expedienteId, token) => {
  const res = await authAxios.get(`${BASE_URL}/traerOrdenesPorExpediente/${expedienteId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const eliminarOrden = async (id, token) => {
  const del = await authAxios.delete(`${BASE_URL}/eliminarDoc/${id}`, {
    headers: {Authorization: `Bearer ${token}`},
  })
  return del.data;
}

export const agregarOrden = async (formData, token) => {
  // El backend espera form-data con 'pase' (JSON) y 'file' (PDF)
  const res = await authAxios.post(`${BASE_URL}/crearOrden`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
}
