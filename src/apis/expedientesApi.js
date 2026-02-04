
import Swal from 'sweetalert2';
import { authAxios } from '../utils/auth';

const BASE_URL = "/expediente";


// --- ENDPOINTS SEGÚN GUIA_FRONTEND.MD ---

export const crearExpediente = async (data, token) => {
  // POST /expediente
  const res = await authAxios.post(`${BASE_URL}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const obtenerExpedientePorId = async (id, token) => {
  // GET /expediente/{id}
  const res = await authAxios.get(`${BASE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const borrarExpediente = async (id, token) => {
  // DELETE /expediente/{id}
  const res = await authAxios.delete(`${BASE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const modificarExpediente = async (id, data, token) => {
  // PUT /expediente/{id}
  const res = await authAxios.put(`${BASE_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};


// --- ENDPOINTS LEGACY (Mantenidos por compatibilidad) ---

export const traerExpedientes = async (token) => {
  // TODO: Verificar si el backend soporta GET /expediente para la lista estándar.
  // Por ahora mantenemos el endpoint viejo.
  // Intento 1: REST estándar GET /expediente
  try {
    const res = await authAxios.get(`${BASE_URL}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (error) {
    console.warn("GET /expediente falló, intentando legacy /traerExpedientes", error);
    // Fallback legacy
    const res2 = await authAxios.get(`${BASE_URL}/traerExpedientes`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res2.data;
  }
};

export const traerExpedientePorId = async (id, token) => {
  // Redireccionamos al nuevo si es compatible, o dejamos el viejo
  return obtenerExpedientePorId(id, token);
};

export const validarYActualizarExpediente = async (id, nuevoEstado, callbackActualizarOCrear, token) => {
  try {
    const expediente = await traerExpedientePorId(id, token);
    if (expediente && expediente.estado === nuevoEstado) {
      Swal.fire({
        icon: 'warning',
        title: 'Estado repetido',
        text: 'El expediente ya tiene ese estado. No se puede actualizar.',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#3085d6',
        background: '#f8fafc',
        customClass: {
          title: 'swal2-title-modern',
          popup: 'swal2-popup-modern',
        },
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        }
      });
      return false;
    }
    // Si el estado es diferente, ejecutá el callback y pasale el expediente existente
    await callbackActualizarOCrear(expediente);
    return true;
  } catch {
    // Si no existe el expediente, ejecutá el callback con null
    await callbackActualizarOCrear(null);
    return true;
  }
};

export const crearExpedienteDesdeDenuncia = async (denunciaId, token) => {
  const res = await authAxios.post(`/denuncia/actualizarEstado/${denunciaId}`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const actualizarExpediente = async (id, expedienteActualizado, token) => {
  return modificarExpediente(id, expedienteActualizado, token);
};

export const existeExpedienteParaDenuncia = async (denunciaId, token) => {
  const expedientes = await traerExpedientes(token);
  // Ajustá según cómo venga el objeto expediente desde el backend:
  return expedientes.some(
    exp => exp.denuncia && String(exp.denuncia.id) === String(denunciaId)
  );
};

export const editarExpediente = async (id, expedienteUpdateDTO, token) => {
  return modificarExpediente(id, expedienteUpdateDTO, token);
};

export const traerPorUsuario = async (token) => {
  const res = await authAxios.get(`${BASE_URL}/traerPorUsuario`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const traerEstadoExpediente = async (nroExp) => { //expediente/traerEstados/
  const res = await authAxios.get(`${BASE_URL}/traerEstados/${nroExp}`);
  console.log("Respuesta", res)
  return res.data;
}
