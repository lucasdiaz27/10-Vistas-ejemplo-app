import axios from "axios";

export const traerArchivoPDF = async (id, token) => {
  const res = await axios.get(`https://site-backend-f8xg.onrender.com/doc/traerPorId/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    responseType: "blob", // <-- importante
  });
  return res.data; // Esto es un Blob
};