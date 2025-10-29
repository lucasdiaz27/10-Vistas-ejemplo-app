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

// --- 🚀 NUEVA FUNCIÓN AÑADIDA ---
// Asumo que tu OrdenCreateDTO (el que usas para crear) también sirve para actualizar
// y que el endpoint es similar a los otros.
export const actualizarOrden = async (ordenId, ordenData, token) => {
  try {
    // Usamos el BASE_URL y un endpoint consistente con tu backend
    const response = await authAxios.put(`${BASE_URL}/actualizarOrden/${ordenId}`, ordenData, {
      headers: {
        Authorization: `Bearer ${token}`
        // No se necesita 'Content-Type': 'multipart/form-data' porque no enviamos archivo
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar la orden:', error.response || error);
    throw error.response?.data || new Error('Error al actualizar la orden');
  }
};
// --- FIN DE LA MODIFICACIÓN ---

