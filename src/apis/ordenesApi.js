// ordenesApi.js
// API para consumir las órdenes de un expediente desde el backend
import axios from "axios";

const BASE_URL = "http://localhost:8080/documento";

// Trae las órdenes por expediente
export const traerOrdenesPorExpediente = async (expedienteId, token) => {
  const res = await axios.get(`${BASE_URL}/traerOrdenesPorExpediente/${expedienteId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
