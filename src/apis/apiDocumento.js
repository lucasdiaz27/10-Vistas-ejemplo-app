import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_BASE_URL}/doc`;

export const traerArchivoPDF = async (id, token) => {
  const res = await axios.get(`${BASE_URL}/traerPorId/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    responseType: "blob", // <-- importante
  });
  return res.data; // Esto es un Blob
};