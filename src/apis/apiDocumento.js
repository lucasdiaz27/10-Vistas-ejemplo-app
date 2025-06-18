import axios from "axios";

export const traerArchivoPDF = async (id, token) => {
  const res = await axios.get(`http://localhost:8080/doc/traerPorId/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    responseType: "blob", // <-- importante
  });
  return res.data; // Esto es un Blob
};