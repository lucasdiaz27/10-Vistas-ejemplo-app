import { authAxios } from "../utils/auth";

const API_URL = `/rol`;

export async function traerRoles(token) {
  const res = await authAxios.get(`${API_URL}/traerRol`, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  return res.data;
}



