import { authAxios as axios } from '../utils/auth';

const API_URL = `${import.meta.env.VITE_BASE_URL}rol`;

export async function traerRoles(token) {
  const res = await axios.get(`${API_URL}/traerRol`, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  return res.data;
}



