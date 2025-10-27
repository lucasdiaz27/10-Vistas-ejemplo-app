// utils/auth.js
import customAxiosInstance from './authInterceptor';

// decodifica un JWT y retorna el payload como objeto JS
export function parseJwt(token) {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

// guarda los tokens en el localStorage
export function setTokens(accessToken, refreshToken) {
  localStorage.setItem('token', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
}

// elimina los tokens del localStorage
export function removeTokens() {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
}

// verifica si hay tokens almacenados
export function hasTokens() {
  return localStorage.getItem('token') && localStorage.getItem('refreshToken');
}

// obtiene el token de acceso
export function getAccessToken() {
  return localStorage.getItem('token');
}

// obtiene el refresh token
export function getRefreshToken() {
  return localStorage.getItem('refreshToken');
}

// verifica si el token de acceso está expirado
export function isTokenExpired(token) {
  const payload = parseJwt(token);
  if (!payload) return true;
  
  // exp está en segundos, lo convertimos a milisegundos
  const expiry = payload.exp * 1000;
  return Date.now() >= expiry;
}

// instancia de axios configurada con el interceptor de autenticación
export const authAxios = customAxiosInstance;
