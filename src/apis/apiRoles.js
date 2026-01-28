import { authAxios } from "../utils/auth";

const API_URL = "/rol";

// =======================
// Traer roles
// =======================
export async function traerRoles(token) {
  const res = await authAxios.get(`${API_URL}/traerRol`, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  return res.data;
}

// =======================
// Crear rol (ADMIN)
// =======================
export const crearRol = async (nombre, descripcion) => {
  const res = await authAxios.post(API_URL, {
    nombre,
    descripcion,
  });
  return res.data;
};



