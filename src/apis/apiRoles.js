import axios from "axios";

const API_URL = "https://100.83.50.21:8080/rol";

export async function traerRoles(token) {
  const res = await axios.get(`${API_URL}/traerRol`, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  return res.data;
}



