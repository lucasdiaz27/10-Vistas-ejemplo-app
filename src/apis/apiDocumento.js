import { authAxios } from "../utils/auth";

const BASE_URL = "/documento";

// =======================
// PDF / Archivo
// =======================
export const traerArchivoPDF = async (id) => {
  const res = await authAxios.get(`${BASE_URL}/traerPorId/${id}`, {
    responseType: "blob",
  });
  return res.data;
};

// =======================
// Documento
// =======================

// Crear orden de documento
export const crearOrdenDocumento = async (tipo, expedienteId) => {
  const res = await authAxios.post(`${BASE_URL}/orden`, {
    tipo,
    expedienteId,
  });
  return res.data;
};

// Eliminar documento
export const eliminarDocumento = async (id) => {
  const res = await authAxios.delete(`${BASE_URL}/${id}`);
  return res.data;
};
