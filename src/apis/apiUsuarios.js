import axios from "axios";

const API_URL = "http://100.83.50.21:8080/usuarios";

// --- FUNCIONES PARA LA GESTIÓN DE USUARIOS (VISTA ADMIN) ---

export async function traerUsuarios(token) {
  const res = await axios.get(`${API_URL}/traerUsuarios`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function traerUsuarioPorId(usuarioId, token) {
  const res = await axios.get(`${API_URL}/${usuarioId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function actualizarUsuario(usuarioId, datosUsuario, token) {
  const res = await axios.put(`${API_URL}/${usuarioId}`, datosUsuario, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export async function eliminarUsuario(usuarioId, token) {
  const res = await axios.delete(`${API_URL}/borrar/${usuarioId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

// --- FUNCIONES PARA EL PERFIL DEL USUARIO LOGUEADO (VISTA AJUSTES) ---

export const obtenerPerfilUsuario = async (token) => {
  const response = await axios.get(`${API_URL}/perfilUsuario`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const actualizarPerfilUsuario = async (datosPerfil, token) => {
  const response = await axios.put(
    `${API_URL}/actualizarNombre`,
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
  const response = await axios.put(
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