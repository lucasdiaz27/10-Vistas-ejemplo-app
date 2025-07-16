import axios from "axios";

const API_URL = "https://site-backend-f8xg.onrender.com/usuarios";

export const obtenerPerfilUsuario = async (token) => {
    const response = await axios.get(`${API_URL}/perfilUsuario`, {
        withCredentials: true,
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

export const actualizarNombre = async (nombre, token) => {
    const response = await axios.put(
        `${API_URL}/actualizarNombre`,
        { nombre },
        {
            headers: { "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
             },
            withCredentials: true,
        }
    );
    return response.data;
};

export const cambiarPassword = async (passwords, token) => {
    const response = await axios.put(
        `${API_URL}/cambiarPassword`,
        passwords,
        {
            headers: { "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
              },
            withCredentials: true,
        }
    );
    return response.data;
};
