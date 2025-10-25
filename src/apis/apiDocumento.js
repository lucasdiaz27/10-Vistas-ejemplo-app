import { authAxios } from "../utils/auth";

const BASE_URL = `/doc`;

export const traerArchivoPDF = async (id, token) => {
  const res = await authAxios.get(`${BASE_URL}/traerPorId/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    responseType: "blob", // <-- importante
  });
  return res.data; // Esto es un Blob
};