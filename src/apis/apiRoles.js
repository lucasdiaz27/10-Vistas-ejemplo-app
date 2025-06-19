import axios from "axios";

const API_URL = "http://localhost:8080/rol/traerRol";

export async function traerRoles(token) {
  const res = await axios.get(API_URL, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  return res.data;
}



