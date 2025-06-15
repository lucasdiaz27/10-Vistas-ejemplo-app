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

export const validarYActualizarExpediente = async (id, nuevoEstado, callbackActualizarOCrear) => {
  try {
    const expediente = await traerExpedientePorId(id);
    if (expediente && expediente.estado === nuevoEstado) {
      alert("El expediente ya tiene ese estado. No se puede actualizar.");
      return false;
    }
    // Si el estado es diferente, ejecutá el callback y pasale el expediente existente
    await callbackActualizarOCrear(expediente);
    return true;
  } catch (error) {
    // Si no existe el expediente, ejecutá el callback con null
    await callbackActualizarOCrear(null);
    return true;
  }
};

export const crearExpedienteDesdeDenuncia = async (denunciaId) => {
  const res = await axios.post(`${BASE_URL}/desde-denuncia/${denunciaId}`);
  return res.data;
};

export const actualizarExpediente = async (id, expedienteActualizado) => {
  const res = await axios.put(`${BASE_URL}/${id}`, expedienteActualizado);
  return res.data;
};

export const existeExpedienteParaDenuncia = async (denunciaId) => {
  const expedientes = await traerExpedientes();
  // Ajustá según cómo venga el objeto expediente desde el backend:
  return expedientes.some(
    exp => exp.denuncia && String(exp.denuncia.id) === String(denunciaId)
  );
};

// despues agregar funciones como eliminarExpediente(id), etc.
