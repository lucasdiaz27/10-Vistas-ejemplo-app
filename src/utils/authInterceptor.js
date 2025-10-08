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
    // Cambiar a 1 minuto desde la emisión del token
    const issueTime = parsed.iat * 1000; // tiempo de emisión en milisegundos
    const oneMinute = 1 * 60 * 1000; // 1 minuto en milisegundos
    const forcedExpirationTime = issueTime + oneMinute;
    
    console.log('Token emitido:', new Date(issueTime).toLocaleString());
    console.log('Forzando expiración:', new Date(forcedExpirationTime).toLocaleString());
    console.log('Tiempo actual:', new Date().toLocaleString());
    
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
      console.log('Estado del token:', { expired,
        url: config.url,
        isRefreshUrl: config.url.includes('/auth/refresh') });
      
      if (expired && !config.url.includes('/auth/refresh')) {
        console.log('⚠️ Token expirado, se lanzará error 401');
        // En lugar de throw axios.Cancel, retornamos Promise.reject
        return Promise.reject({
          response: { status: 401 },
          config: config
        });
      }
      
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Token agregado a la petición');
    } 
    return config;
  },
  (error) => {
    console.log(' Error en interceptor de petición:', error);
    return Promise.reject(error);
  }
);



// interceptor para las respuestas
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log('🚨 Interceptor error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.response?.data?.message || error.message,
      isRetry: error.config?._retry,
      isRefreshing
    });
    const originalRequest = error.config;


    // si el error no es 401 o ya intentamos refrescar el token, rechazamos
    if (error.response?.status !== 401 || originalRequest._retry) {
      console.log('❌ No intentamos refresh porque:', {
        status: error.response?.status,
        alreadyRetried: originalRequest._retry
      });
      return Promise.reject(error);
    }

    // si ya estamos refrescando, agregamos la petición a la cola
    if (isRefreshing) {
      console.log('⏳ Refresh en proceso, agregando petición a cola');
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(token => {
          console.log('✅ Usando nuevo token de la cola');
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        })
        .catch(err => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      console.log('❌ No hay refresh token disponible');
      isRefreshing = false;
      window.location.href = '/login';
      return Promise.reject(error);
    }

    try {
      console.log('🔄 Iniciando refresh token silencioso...');
      const response = await axios.create().post('http://localhost:8080/auth/refresh', null, {
        headers: {
          Authorization: `Bearer ${refreshToken}`
        }
      });
      console.log('✅ Refresh token exitoso');

      const { access_token: newToken, refresh_token: newRefreshToken } = response.data;
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      
      processQueue(null, newToken);
      console.log('✅ Cola de peticiones procesada con éxito');
      
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      console.log('❌ Error fatal durante el refresh:', refreshError);
      processQueue(refreshError, null);
      
    if (refreshError.response?.status === 401 || refreshError.response?.status === 403) {
        console.log('🚪 Refresh token inválido o expirado, redirigiendo al login');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
      
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;