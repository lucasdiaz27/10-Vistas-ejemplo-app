import axios from "axios";

const BASE_URL = "https://site-backend-f8xg.onrender.com/pases";

// Traer pases por expediente
export const traerPasesPorExp = async (expedienteId, token) => {
  const res = await axios.get(`${BASE_URL}/traerPasesPorExp/${expedienteId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Crear un nuevo pase
// Recibe un FormData con el JSON del pase y el archivo PDF
export const crearPase = async (formData, token) => {
  // El backend espera form-data con 'pase' (JSON) y 'file' (PDF)
  const res = await axios.post(`${BASE_URL}/crearPase`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
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

// Obtener ENUM Area desde el backend
// Devuelve un array de strings con los valores del ENUM Area
export const obtenerAreasEnum = async (token) => {
  // Ahora apunta al endpoint correcto del backend para el ENUM Area
  const res = await axios.get("https://site-backend-f8xg.onrender.com/api/areas", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data; // Se espera un array tipo ["MESA_DE_ENTRADA", "ABOGADOS", ...]
};
