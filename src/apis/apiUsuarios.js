import axios from "axios";

const API_URL = "https://site-backend-f8xg.onrender.com/auth"; // Cambia el puerto si tu backend usa otro
const USUARIOS_URL = "https://site-backend-f8xg.onrender.com/usuarios";

export async function crearUsuario({ email, password, nombre, rol }, token) {
  const res = await axios.post(
    `${API_URL}/register`,
    {
      email,
      password,
      name: nombre, // El backend espera 'name'
      rol,
    },
    {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  );
  return res.data;
}

export async function traerUsuarios(token) {
  const res = await axios.get(`${USUARIOS_URL}/traerUsuarios`, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  return res.data;
}

export async function eliminarUsuario(usuarioId, token) {
  const res = await axios.delete(`${USUARIOS_URL}/borrar/${usuarioId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
