import { authAxios } from "../utils/auth";


// La URL base para los endpoints de autenticación
const AUTH_URL = `/auth`;

/**
 * Registra un nuevo usuario. Esta función NO envía token.
 * @param {object} data - El objeto de usuario completo que pide Ale.
 */
export const registerUsuario = async (data) => {
  return authAxios.post(`${AUTH_URL}/register`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

