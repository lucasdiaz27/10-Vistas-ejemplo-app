import { authAxios } from "../utils/auth";

const BASE_URL = `/doc`;

export const traerOrdenesPorExpediente = async (expedienteId, token) => {
  const res = await authAxios.get(`${BASE_URL}/traerOrdenesPorExpediente/${expedienteId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const eliminarOrden = async (id, token) => {
  const del = await authAxios.delete(`${BASE_URL}/eliminarDoc/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
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

export const actualizarOrden = async (ordenId, nuevoNombre, token) => {
  try {
    const response = await authAxios.put(`${BASE_URL}/editarNombre/${ordenId}`, nuevoNombre, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar la orden:', error.response || error);
    throw error.response?.data || new Error('Error al actualizar la orden');
  }
};

// NUEVA FUNCIÓN PARA DESCARGAR EL ZIP 
export const descargarZipOrdenes = async (expedienteId, token) => {
  const res = await authAxios.get(`${BASE_URL}/descargarZip/${expedienteId}`, {
    headers: { Authorization: `Bearer ${token}` },
    responseType: 'blob', // ¡CRUCIAL! Indica que esperamos un archivo binario
  });
  return res.data; // Devuelve el Blob del ZIP
};