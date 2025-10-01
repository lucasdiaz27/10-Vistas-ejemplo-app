import axios from 'axios';

// crear instancia de axios para las llamadas autenticadas
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080'
});

// variable para controlar si estamos refrescando el token
let isRefreshing = false;
// cola de peticiones fallidas que esperan el nuevo token
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// función para verificar si un token está expirado
const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    const parsed = JSON.parse(jsonPayload);
    // Forzar expiración después de 15 minutos desde la emisión del token
    const issueTime = parsed.iat * 1000; // tiempo de emisión en milisegundos
    const fifteenMinutes = 15 * 60 * 1000; // 15 minutos en milisegundos
    const forcedExpirationTime = issueTime + fifteenMinutes;
    
    console.log('Token emitido:', new Date(issueTime).toLocaleString());
    console.log('Forzando expiración:', new Date(forcedExpirationTime).toLocaleString());
    console.log('Tiempo actual:', new Date().toLocaleString());
    
    // El token expirará después de 15 minutos de su emisión
    return Date.now() >= forcedExpirationTime;
  } catch (error) {
    console.error('Error al decodificar token:', error);
    return true;
  }
};

// interceptor para las peticiones
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('Interceptor de petición ejecutándose');
    const token = localStorage.getItem('token');
    if (token) {
      // Verificar si el token está expirado antes de usarlo
      const expired = isTokenExpired(token);
      console.log('Estado del token:', { 
        expired,
        tiempoRestante: token ? new Date(JSON.parse(atob(token.split('.')[1])).exp * 1000) - Date.now() : 'N/A'
      });
      
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Token agregado a la petición');
    } else {
      console.log('No hay token disponible');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// interceptor para las respuestas
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log('Interceptor error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.response?.data?.message || error.message,
      headers: error.config?.headers
    });
    const originalRequest = error.config;

    // si el error no es 401 o ya intentamos refrescar el token, rechazamos
    if (error.response?.status !== 401 || originalRequest._retry) {
      console.log('No intentamos refresh porque:', {
        status: error.response?.status,
        alreadyRetried: originalRequest._retry
      });
      return Promise.reject(error);
    }

    // si ya estamos refrescando, agregamos la petición a la cola
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        })
        .catch(err => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      // si no hay refresh token, redirigimos al login
      window.location.href = '/login';
      return Promise.reject(error);
    }

    try {
      console.log('Intentando refresh token...');
      // intentamos obtener un nuevo token
      const response = await axios.create().post('http://localhost:8080/auth/refresh', null, {
        headers: {
          Authorization: `Bearer ${refreshToken}`
        }
      });
      console.log('Refresh token exitoso');

      const { access_token: newToken, refresh_token: newRefreshToken } = response.data;
      
      // guardamos los nuevos tokens
      localStorage.setItem('token', newToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      
      // actualizamos el header de la petición original
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      
      // procesamos la cola de peticiones pendientes
      processQueue(null, newToken);
      
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      // si falla el refresh, limpiamos todo y redirigimos al login
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;