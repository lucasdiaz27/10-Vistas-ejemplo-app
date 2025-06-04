import axios from "axios";

const BASE_URL = "http://localhost:8080/expediente";

export const traerExpedientes = async () => {
  const res = await axios.get(`${BASE_URL}/traerExpedientes`);
  return res.data;
};
export const traerExpedientePorId = async (id) => {
  const res = await axios.get(`http://localhost:8080/expediente/traerExpedientePorId/${id}`);
  return res.data;
};

// despues agregar funciones como eliminarExpediente(id), actualizarExpediente(id, data), etc.
