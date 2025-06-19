import axios from "axios";

const API_URL = "http://localhost:8080/auth"; // Cambia el puerto si tu backend usa otro
const USUARIOS_URL = "http://localhost:8080/usuarios";

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
