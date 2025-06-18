import axios from "axios";

const BASE_URL = "http://localhost:8080/expediente";

export const traerExpedientes = async (token) => {
  const res = await axios.get(`${BASE_URL}/traerExpedientes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
export const traerExpedientePorId = async (id, token) => {
  const res = await axios.get(`http://localhost:8080/expediente/traerExpedientePorId/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const validarYActualizarExpediente = async (id, nuevoEstado, callbackActualizarOCrear, token) => {
  try {
    const expediente = await traerExpedientePorId(id, token);
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

export const crearExpedienteDesdeDenuncia = async (denunciaId, token) => {
  const res = await axios.post(`denuncia/actualizarEstado/${denunciaId}`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const actualizarExpediente = async (id, expedienteActualizado, token) => {
  const res = await axios.put(`${BASE_URL}/${id}`, expedienteActualizado, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const existeExpedienteParaDenuncia = async (denunciaId, token) => {
  const expedientes = await traerExpedientes(token);
  // Ajustá según cómo venga el objeto expediente desde el backend:
  return expedientes.some(
    exp => exp.denuncia && String(exp.denuncia.id) === String(denunciaId)
  );
};

// despues agregar funciones como eliminarExpediente(id, token), etc.

//await crearExpedienteDesdeDenuncia(denunciaId, token);
// Recargar expedientes después de crear uno nuevo
// const nuevosExpedientes = await traerExpedientes(token);
// setExpedientes(nuevosExpedientes);


// ale

export const traerEstadoExpediente = async (nroExp) => {
  const res = await axios.get(`${BASE_URL}/traerEstados/${nroExp}`);
  return res.data;
}