import { authAxios as axios } from '../utils/auth';

const API_URL = "http://localhost:8080/rol";

export async function traerRoles(token) {
  const res = await axios.get(`${API_URL}/traerRol`, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  return res.data;
}



