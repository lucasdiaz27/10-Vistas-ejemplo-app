import axios from "axios";

// La URL base para los endpoints de autenticación
const AUTH_URL = `${import.meta.env.VITE_BASE_URL}/auth`;

/**
 * Registra un nuevo usuario. Esta función NO envía token.
 * @param {object} data - El objeto de usuario completo que pide Ale.
 */
export const registerUsuario = async (data) => {
  return axios.post(`${AUTH_URL}/register`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

