import axios from "axios";
import Swal from 'sweetalert2';

const BASE_URL = "https://100.83.50.21:8080/expediente";

export const traerExpedientes = async (token) => {
  const res = await axios.get(`${BASE_URL}/traerExpedientes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
export const traerExpedientePorId = async (id, token) => {
  const res = await axios.get(`${BASE_URL}/traerExpedientePorId/${id}`, {
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
  const res = await axios.post(`https://100.83.50.21:8080/denuncia/actualizarEstado/${denunciaId}`, null, {
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

export const editarExpediente = async (id, expedienteUpdateDTO, token) => {
  const res = await axios.put(
    `${BASE_URL}/editarExpediente/${id}`,
    expedienteUpdateDTO,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const traerPorUsuario = async (token) => {
  const res = await axios.get(`${BASE_URL}/traerPorUsuario`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
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