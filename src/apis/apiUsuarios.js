import { authAxios } from "../utils/auth";



const API_URL = `/usuarios`; // Backend usa plural

// --- FUNCIONES PARA LA GESTIÓN DE USUARIOS (VISTA ADMIN) ---

export async function traerUsuarios(token) {
  // Nota: GUÍA no muestra endpoint para listar usuarios (salvo auditoria),
  // pero mantendremos este por si acaso, quizás en /usuario o /usuarios (plural)
  // Si falla, revertir a /usuarios
  const res = await authAxios.get(`${API_URL}/traerUsuarios`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function traerUsuarioPorId(usuarioId, token) {
  const res = await authAxios.get(`${API_URL}/${usuarioId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function actualizarUsuario(usuarioId, datosUsuario, token) {
  // PUT /usuario/{id}
  const res = await authAxios.put(`${API_URL}/${usuarioId}`, datosUsuario, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export async function eliminarUsuario(usuarioId, token) {
  const res = await authAxios.delete(`${API_URL}/${usuarioId}`, { // MD dice DELETE /usuario/{id}
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

// --- FUNCIONES PARA EL PERFIL DEL USUARIO LOGUEADO (VISTA AJUSTES) ---

export const obtenerPerfilUsuario = async (token) => {
  // MD no especifica "mi perfil", asumimos uso de traerUsuarioPorId o similar.
  // Mantenemos el endpoint viejo pero ojo con la URL base
  const response = await authAxios.get(`${API_URL}/perfilUsuario`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const actualizarPerfilUsuario = async (datosPerfil, token) => {
  // Ajustes.jsx llama a esto. Quizás deba llamar a actualizarUsuario(id, data).
  // Si no tenemos ID, usamos el endpoint 'actualizarNombre' viejo pero corregido?
  // O mejor, intentamos respetar MD: PUT /usuario/{id}
  // Supondremos que `actualizarNombre` era viejo.
  // Como Ajustes.jsx no pasa ID a esta función (ver Ajustes.jsx), 
  // mantendremos el endpoint viejo o intentaremos adivinar. 
  // Mejor: Mantenemos el viejo endpoint SI no está en MD, o standardizamos si Ajustes lo permite.
  // Ajustes.jsx NO tiene ID del usuario en el state `form`, solo data.
  // Así que mantendremos el endpoint '/actualizarNombre' asumiendo es un endpoint custom del backend viejo,
  // O, si queremos ser estrictos con MD, Ajustes debe pasar el ID.

  const response = await authAxios.put(
    `${API_URL}/actualizarNombre`, // Posiblemente legacy
    datosPerfil,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
    }
  );
  return response.data;
};

export const cambiarPassword = async (passwords, token) => {
  // Ajustes.jsx llama a esto sin ID. MD dice PUT /usuario/{id}/password.
  // Necesitamos el ID.
  // Temporalmente apuntamos a un endpoint genérico si existe, o fallará.
  // Asumiremos que el backend viejo tiene /cambiarPassword. 
  // SI queremos cumplir MD, deberíamos refactorizar Ajustes.jsx para obtener ID.

  const response = await authAxios.put(
    `${API_URL}/cambiarPassword`,
    passwords,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
    }
  );
  return response.data;
};
