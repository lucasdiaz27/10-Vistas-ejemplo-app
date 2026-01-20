# Guía de Implementación Frontend - Seguridad del Backend

## Para: Leonel y Maximiliano (Equipo Frontend)

Esta guía contiene **TODOS los endpoints de seguridad** que el frontend debe integrar, con ejemplos de código listos para implementar.

---

## Índice Rápido
1. [Endpoints de Autenticación](#endpoints-de-autenticación)
2. [Endpoints Protegidos](#endpoints-protegidos)
3. [Manejo de Tokens](#manejo-de-tokens)
4. [Gestión de Errores](#gestión-de-errores)
5. [Ejemplos de Implementación](#ejemplos-de-implementación)
6. [Configuración CORS](#configuración-cors)

---

## Endpoints de Autenticación

### 1. REGISTRO DE USUARIO
**POST** `http://localhost:8080/auth/register`

#### Request
```json
{
  "email": "usuario@example.com",
  "password": "SecurePassword123",
  "name": "Juan",
  "apellido": "Perez",
  "rol": "OPERADOR",
  "documento": "12345678",
  "telefono": "1234567890",
  "cp": "1425",
  "localidad": "CABA",
  "domicilio": "Calle 123"
}
```

#### Parámetros Requeridos
| Campo | Tipo | Validación | Ejemplo |
|-------|------|-----------|---------|
| `email` | string | @Email (debe ser email válido) | usuario@example.com |
| `password` | string | @NotBlank, min 8 caracteres | SecurePass123 |
| `name` | string | @NotBlank | Juan |
| `apellido` | string | @NotBlank | Perez |
| `rol` | string | @NotNull (OPERADOR, DENUNCIANTE, ADMIN) | OPERADOR |
| `documento` | string | @NotBlank | 12345678 |
| `telefono` | string | @NotBlank | 1234567890 |
| `cp` | string | @NotBlank | 1425 |
| `localidad` | string | @NotBlank | CABA |
| `domicilio` | string | @NotBlank | Calle 123 |

#### Response - Éxito (200)
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3VhcmlvQGV4YW1wbGUuY29tIiwiaWF0IjoxNjczMzA0OTQyLCJleHAiOjE2NzMzMDg1NDJ9.SIGNATURE...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3VhcmlvQGV4YW1wbGUuY29tIiwiaWF0IjoxNjczMzA0OTQyLCJleHAiOjE2NzM0MTI3NDJ9.SIGNATURE..."
}
```

#### Response - Error (400)
```json
{
  "error": "Validation failed",
  "details": {
    "email": "El email debe ser válido",
    "password": "La contraseña debe tener mínimo 8 caracteres"
  }
}
```

#### Response - Error (409 - Email duplicado)
```json
{
  "error": "El email ya está en uso: usuario@example.com"
}
```

#### Qué Hacer Frontend
1. **Validar** email con formato válido
2. **Validar** password >= 8 caracteres
3. **Llenar** todos los campos (nombre, apellido, rol, documento, etc)
4. **Enviar** petición POST
5. **Guardar** token y refreshToken (ver sección [Manejo de Tokens](#manejo-de-tokens))
6. **Redirigir** a dashboard/inicio

---

### 2. LOGIN DE USUARIO
**POST** `http://localhost:8080/auth/login`

#### Request
```json
{
  "email": "usuario@example.com",
  "password": "SecurePassword123"
}
```

#### Parámetros Requeridos
| Campo | Tipo | Validación | Ejemplo |
|-------|------|-----------|---------|
| `email` | string | @Email | usuario@example.com |
| `password` | string | @NotBlank | SecurePassword123 |

#### Response - Éxito (200)
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Response - Error (401 - Credenciales Inválidas)
```json
{
  "error": "Credenciales invalidas"
}
```

#### Response - Error (400 - Validación)
```json
{
  "error": "Validation failed",
  "details": {
    "email": "El email debe ser válido"
  }
}
```

#### Response - Error (429 - Rate Limiting)
```json
{
  "timestamp": "2026-01-09T14:36:42.123Z",
  "status": 429,
  "error": "Too Many Requests",
  "message": "Rate limit exceeded. Please wait 60 seconds."
}
```

#### Qué Hacer Frontend
1. **Validar** email y password
2. **Enviar** petición POST
3. **Manejar** error 429: mostrar "Intentos excedidos, espera 60 segundos"
4. **Guardar** token y refreshToken
5. **Redirigir** a dashboard

---

### 3. REFRESCAR TOKEN
**POST** `http://localhost:8080/auth/refresh`

#### Request - Header
```
Authorization: Bearer <refreshToken>
```

#### Response - Éxito (200)
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Response - Error (401 - Token Inválido)
```json
{
  "error": "Token invalido o expirado"
}
```

#### Qué Hacer Frontend
1. **Guardar** en interceptor HTTP
2. **Detectar** cuando token expira (exp en JWT)
3. **Enviar** refreshToken automáticamente
4. **Obtener** nuevo token
5. **Reintentar** petición original

---

### 4. LOGOUT DE USUARIO
**POST** `http://localhost:8080/auth/logout`

#### Request - Header
```
Authorization: Bearer <token>
```

#### Response - Éxito (200)
```json
"Sesión cerrada correctamente"
```

#### Response - Error (401 - Sin Token)
```json
{
  "error": "Token no proporcionado o formato incorrecto"
}
```

#### Qué Hacer Frontend
1. **Obtener** token del localStorage/sessionStorage
2. **Enviar** petición POST
3. **Limpiar** token del almacenamiento local
4. **Limpiar** datos del usuario del estado (Redux/Context)
5. **Redirigir** a login

---

## Endpoints Protegidos

Todos estos endpoints **REQUIEREN** header `Authorization: Bearer <token>`

### EXPEDIENTE

#### Crear Expediente
**POST** `http://localhost:8080/expediente`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "descripcion": "Expediente sobre demanda civil",
  "tipo": "civil"
}
```

**Response (200):**
```json
{
  "id": 1,
  "descripcion": "Expediente sobre demanda civil",
  "tipo": "civil",
  "createdAt": "2026-01-09T14:35:20"
}
```

---

#### Actualizar Expediente
**PUT** `http://localhost:8080/expediente/{id}`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "descripcion": "Expediente actualizado",
  "tipo": "penal"
}
```

**Response (200):**
```json
{
  "id": 1,
  "descripcion": "Expediente actualizado",
  "tipo": "penal",
  "updatedAt": "2026-01-09T14:40:20"
}
```

---

#### Obtener Expediente por ID
**GET** `http://localhost:8080/expediente/{id}`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": 1,
  "descripcion": "Expediente sobre demanda civil",
  "tipo": "civil",
  "createdAt": "2026-01-09T14:35:20"
}
```

---

#### Eliminar Expediente
**DELETE** `http://localhost:8080/expediente/{id}`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
"Expediente eliminado correctamente"
```

---

### USUARIO

#### Actualizar Usuario
**PUT** `http://localhost:8080/usuario/{id}`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "email": "newemail@example.com",
  "nombre": "Juan",
  "rol": "OPERADOR"
}
```

**Response (200):**
```json
{
  "id": 1,
  "email": "newemail@example.com",
  "nombre": "Juan",
  "rol": "OPERADOR"
}
```

---

#### Cambiar Nombre
**PUT** `http://localhost:8080/usuario/{id}/nombre`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "nombre": "Juan Pablo"
}
```

**Response (200):**
```json
"Nombre actualizado correctamente"
```

---

#### Cambiar Contraseña
**PUT** `http://localhost:8080/usuario/{id}/password`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "passwordAntigua": "OldPassword123",
  "passwordNueva": "NewPassword456"
}
```

**Response (200):**
```json
"Contraseña actualizada correctamente"
```

**Response (401 - Contraseña Antigua Incorrecta):**
```json
{
  "error": "Contraseña antigua incorrecta"
}
```

---

#### Eliminar Usuario
**DELETE** `http://localhost:8080/usuario/{id}`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
"Usuario eliminado correctamente"
```

---

### DENUNCIA

#### Crear Denuncia
**POST** `http://localhost:8080/denuncia`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "descripcion": "Descripción de la denuncia",
  "tipo": "penal",
  "motivo": "fraude"
}
```

**Response (200):**
```json
{
  "id": 1,
  "descripcion": "Descripción de la denuncia",
  "tipo": "penal",
  "motivo": "fraude",
  "estado": "ABIERTA",
  "createdAt": "2026-01-09T14:35:20"
}
```

---

#### Actualizar Estado de Denuncia
**PUT** `http://localhost:8080/denuncia/{id}/estado`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "nuevoEstado": "RESUELTA"
}
```

**Response (200):**
```json
{
  "id": 1,
  "estado": "RESUELTA",
  "updatedAt": "2026-01-09T14:40:20"
}
```

---

### DOCUMENTO

#### Crear Orden de Documento
**POST** `http://localhost:8080/documento/orden`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "tipo": "CERTIFICADO",
  "expedienteId": 1
}
```

**Response (200):**
```json
{
  "id": 1,
  "tipo": "CERTIFICADO",
  "expedienteId": 1,
  "estado": "PENDIENTE",
  "createdAt": "2026-01-09T14:35:20"
}
```

---

#### Eliminar Documento
**DELETE** `http://localhost:8080/documento/{id}`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
"Documento eliminado correctamente"
```

---

### ROL

#### Crear Rol
**POST** `http://localhost:8080/rol`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "nombre": "SUPERVISOR",
  "descripcion": "Rol de supervisor del sistema"
}
```

**Response (200):**
```json
{
  "id": 1,
  "nombre": "SUPERVISOR",
  "descripcion": "Rol de supervisor del sistema"
}
```

---

### AUDITORÍA (Solo ADMIN)

#### Ver Logs de Auditoría
**GET** `http://localhost:8080/api/auditoria/logs?page=0&size=10`

**Headers:**
```
Authorization: Bearer <token>
(El usuario DEBE tener rol ADMIN)
```

**Response - Éxito (200):**
```json
{
  "content": [
    {
      "id": 1,
      "usuario": "juan@example.com",
      "accion": "LOGIN_SUCCESS",
      "descripcion": "Sesion iniciada: juan@example.com",
      "ipCliente": "192.168.1.50",
      "resultado": "SUCCESS",
      "tipoEntidad": "Usuario",
      "idEntidad": 1,
      "fechaHora": "2026-01-09T14:30:45"
    },
    {
      "id": 2,
      "usuario": "juan@example.com",
      "accion": "CREATE_EXPEDIENTE_SUCCESS",
      "descripcion": "Expediente creado: 1",
      "ipCliente": "192.168.1.50",
      "resultado": "SUCCESS",
      "tipoEntidad": "Expediente",
      "idEntidad": 1,
      "fechaHora": "2026-01-09T14:35:20"
    }
  ],
  "totalElements": 150,
  "totalPages": 15,
  "currentPage": 0,
  "pageSize": 10
}
```

**Response - Error (403 - No es ADMIN):**
```json
{
  "error": "Access Denied"
}
```

---

## Manejo de Tokens

### Almacenamiento

#### Opción 1: localStorage (SIMPLE, menos seguro)
```javascript
// Al recibir tokens
localStorage.setItem('token', response.token);
localStorage.setItem('refreshToken', response.refreshToken);

// Al leer
const token = localStorage.getItem('token');
```

#### Opción 2: sessionStorage (SEGURO, se pierde al cerrar tab)
```javascript
sessionStorage.setItem('token', response.token);
sessionStorage.setItem('refreshToken', response.refreshToken);
```

#### Opción 3: httpOnly Cookie (MÁS SEGURO, recomendado)
```javascript
// Backend debe enviar como cookie
// Frontend no puede acceder a httpOnly cookies (privadas del servidor)
// Se envían automáticamente en cada petición
```

### Estructura JWT
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3VhcmlvQGV4YW1wbGUuY29tIiwiaWF0IjoxNjczMzA0OTQyLCJleHAiOjE2NzMzMDg1NDJ9.SIGNATURE
│                                                │                                                                          │         │
├─ Header (Base64)                             ├─ Payload (Base64) + Claims (email, iat, exp)        └─ Signature (HMAC-SHA256)
```

#### Decodificar JWT (sin validar - solo lectura)
```javascript
function parseJWT(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(jsonPayload);
}

// Uso
const token = localStorage.getItem('token');
const payload = parseJWT(token);
console.log(payload.sub); // email
console.log(payload.exp); // timestamp de expiración
```

### Verificar si Token Expiró
```javascript
function isTokenExpired(token) {
  const payload = parseJWT(token);
  const currentTime = Math.floor(Date.now() / 1000); // en segundos
  return payload.exp < currentTime;
}

// Uso
if (isTokenExpired(token)) {
  console.log('Token expirado, necesita renovación');
}
```

### Interceptor HTTP (Axios)
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080'
});

// Request Interceptor - Agregar token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor - Manejar token expirado
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si 401 y no es un reintento
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await api.post('/auth/refresh', {}, {
          headers: { Authorization: `Bearer ${refreshToken}` }
        });

        // Guardar nuevo token
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('refreshToken', response.data.refreshToken);

        // Reintentar petición original
        originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh falló, ir a login
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

### Interceptor HTTP (Fetch)
```javascript
async function fetchWithToken(url, options = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Si 401, intenta refrescar
  if (response.status === 401) {
    const refreshToken = localStorage.getItem('refreshToken');
    const refreshResponse = await fetch('http://localhost:8080/auth/refresh', {
      method: 'POST',
      headers: { Authorization: `Bearer ${refreshToken}` },
    });

    if (refreshResponse.ok) {
      const data = await refreshResponse.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);

      // Reintentar con nuevo token
      headers.Authorization = `Bearer ${data.token}`;
      return fetch(url, { ...options, headers });
    } else {
      // Logout
      localStorage.clear();
      window.location.href = '/login';
    }
  }

  return response;
}

// Uso
const response = await fetchWithToken('http://localhost:8080/expediente');
const data = await response.json();
```

---

## Gestión de Errores

### Códigos HTTP
| Código | Significado | Qué Hacer |
|--------|-------------|-----------|
| 200 | OK - Petición exitosa | Procesar respuesta normalmente |
| 400 | Bad Request - Datos inválidos | Mostrar errores de validación |
| 401 | Unauthorized - Sin token válido | Redirigir a login, intentar refrescar |
| 403 | Forbidden - Sin permisos | Mostrar "No tienes permiso" |
| 404 | Not Found - Recurso no existe | Mostrar "No encontrado" |
| 429 | Too Many Requests - Rate Limit | Mostrar "Demasiados intentos, espera 60s" |
| 500 | Server Error - Error del backend | Mostrar "Error del servidor" |

### Manejo de Errores en React
```javascript
async function createExpediente(data) {
  try {
    const response = await api.post('/expediente', data);
    console.log('Éxito:', response.data);
    showSuccessMessage('Expediente creado correctamente');
    return response.data;
  } catch (error) {
    // Errores de validación
    if (error.response?.status === 400) {
      const details = error.response.data.details;
      Object.entries(details).forEach(([field, message]) => {
        showErrorMessage(`${field}: ${message}`);
      });
    }
    // Token expirado/inválido
    else if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    // Rate limiting
    else if (error.response?.status === 429) {
      showErrorMessage('Demasiados intentos. Espera 60 segundos');
    }
    // Sin permisos
    else if (error.response?.status === 403) {
      showErrorMessage('No tienes permisos para esta acción');
    }
    // Error del servidor
    else if (error.response?.status === 500) {
      showErrorMessage('Error del servidor. Intenta más tarde');
    }
    // Error de red
    else if (!error.response) {
      showErrorMessage('Error de conexión. Verifica tu internet');
    }
    
    return null;
  }
}
```

---

## Ejemplos de Implementación

### Ejemplo 1: Flujo de Registro (React)

```javascript
import { useState } from 'react';
import axios from 'axios';

export function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    apellido: '',
    rol: 'OPERADOR',
    documento: '',
    telefono: '',
    cp: '',
    localidad: '',
    domicilio: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccess('');

    try {
      const response = await axios.post(
        'http://localhost:8080/auth/register',
        formData
      );

      // Guardar tokens
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);

      setSuccess('¡Registro exitoso! Redirigiendo...');
      
      // Redirigir a dashboard después de 2 segundos
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);

    } catch (error) {
      // Errores de validación
      if (error.response?.status === 400) {
        setErrors(error.response.data.details || {});
      }
      // Email duplicado
      else if (error.response?.status === 409) {
        setErrors({ email: error.response.data.error });
      }
      // Otros errores
      else {
        setErrors({ general: error.response?.data?.error || 'Error al registrarse' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Email */}
      <div>
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      {/* Contraseña */}
      <div>
        <label>Contraseña (mín. 8 caracteres)</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        {errors.password && <span className="error">{errors.password}</span>}
      </div>

      {/* Nombre */}
      <div>
        <label>Nombre</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>

      {/* Apellido */}
      <div>
        <label>Apellido</label>
        <input
          type="text"
          name="apellido"
          value={formData.apellido}
          onChange={handleChange}
          required
        />
        {errors.apellido && <span className="error">{errors.apellido}</span>}
      </div>

      {/* Rol */}
      <div>
        <label>Rol</label>
        <select name="rol" value={formData.rol} onChange={handleChange}>
          <option value="OPERADOR">Operador</option>
          <option value="DENUNCIANTE">Denunciante</option>
          <option value="ADMIN">Administrador</option>
        </select>
        {errors.rol && <span className="error">{errors.rol}</span>}
      </div>

      {/* Documento */}
      <div>
        <label>Documento</label>
        <input
          type="text"
          name="documento"
          value={formData.documento}
          onChange={handleChange}
          required
        />
        {errors.documento && <span className="error">{errors.documento}</span>}
      </div>

      {/* Teléfono */}
      <div>
        <label>Teléfono</label>
        <input
          type="tel"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          required
        />
        {errors.telefono && <span className="error">{errors.telefono}</span>}
      </div>

      {/* CP */}
      <div>
        <label>Código Postal</label>
        <input
          type="text"
          name="cp"
          value={formData.cp}
          onChange={handleChange}
          required
        />
        {errors.cp && <span className="error">{errors.cp}</span>}
      </div>

      {/* Localidad */}
      <div>
        <label>Localidad</label>
        <input
          type="text"
          name="localidad"
          value={formData.localidad}
          onChange={handleChange}
          required
        />
        {errors.localidad && <span className="error">{errors.localidad}</span>}
      </div>

      {/* Domicilio */}
      <div>
        <label>Domicilio</label>
        <input
          type="text"
          name="domicilio"
          value={formData.domicilio}
          onChange={handleChange}
          required
        />
        {errors.domicilio && <span className="error">{errors.domicilio}</span>}
      </div>

      {/* Error General */}
      {errors.general && (
        <div className="error-message">{errors.general}</div>
      )}

      {/* Mensaje de Éxito */}
      {success && (
        <div className="success-message">{success}</div>
      )}

      {/* Botón Submit */}
      <button type="submit" disabled={loading}>
        {loading ? 'Registrando...' : 'Registrarse'}
      </button>
    </form>
  );
}
```

---

### Ejemplo 2: Flujo de Login (React)

```javascript
import { useState } from 'react';
import axios from 'axios';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post(
        'http://localhost:8080/auth/login',
        { email, password }
      );

      // Guardar tokens
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);

      setMessage('¡Login exitoso! Redirigiendo...');
      
      // Redirigir después de 1 segundo
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);

    } catch (err) {
      // Validación
      if (err.response?.status === 400) {
        const details = err.response.data.details;
        const fieldError = Object.values(details)[0];
        setError(fieldError);
      }
      // Credenciales inválidas
      else if (err.response?.status === 401) {
        setError('Email o contraseña incorrectos');
      }
      // Rate limiting (demasiados intentos)
      else if (err.response?.status === 429) {
        setError('Demasiados intentos. Espera 60 segundos antes de intentar de nuevo');
      }
      // Error del servidor
      else if (err.response?.status === 500) {
        setError('Error del servidor. Intenta más tarde');
      }
      // Sin conexión
      else if (!err.response) {
        setError('Error de conexión. Verifica tu internet');
      }
      else {
        setError('Error al iniciar sesión');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Iniciar Sesión</h2>

      <div>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}

      <button type="submit" disabled={loading}>
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>

      <p>
        ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
      </p>
    </form>
  );
}
```

---

### Ejemplo 3: Crear Expediente (React)

```javascript
import { useState } from 'react';
import axios from 'axios';

export function CreateExpedientePage() {
  const [descripcion, setDescripcion] = useState('');
  const [tipo, setTipo] = useState('civil');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Obtener token
      const token = localStorage.getItem('token');

      // Petición con token en header
      const response = await axios.post(
        'http://localhost:8080/expediente',
        { descripcion, tipo },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setSuccess(`Expediente #${response.data.id} creado correctamente`);
      
      // Limpiar formulario
      setDescripcion('');
      setTipo('civil');

      // Redirigir después de 2 segundos
      setTimeout(() => {
        window.location.href = `/expediente/${response.data.id}`;
      }, 2000);

    } catch (err) {
      // Validación
      if (err.response?.status === 400) {
        const fieldError = Object.values(err.response.data.details)[0];
        setError(fieldError);
      }
      // Sin token / token inválido
      else if (err.response?.status === 401) {
        setError('Sesión expirada. Por favor, inicia sesión nuevamente');
        localStorage.clear();
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
      // Sin permisos
      else if (err.response?.status === 403) {
        setError('No tienes permiso para crear expedientes');
      }
      else {
        setError('Error al crear expediente');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Crear Expediente</h2>

      <div>
        <label>Descripción</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
          placeholder="Ingresa la descripción del expediente"
        />
      </div>

      <div>
        <label>Tipo</label>
        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="civil">Civil</option>
          <option value="penal">Penal</option>
          <option value="laboral">Laboral</option>
        </select>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <button type="submit" disabled={loading}>
        {loading ? 'Creando...' : 'Crear Expediente'}
      </button>
    </form>
  );
}
```

---

### Ejemplo 4: Logout (React)

```javascript
export function LogoutButton() {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    if (!window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      await axios.post(
        'http://localhost:8080/auth/logout',
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Limpiar almacenamiento
      localStorage.clear();
      sessionStorage.clear();

      // Redirigir a login
      window.location.href = '/login';

    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      
      // Aunque falle, limpiar datos locales
      localStorage.clear();
      window.location.href = '/login';
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleLogout} disabled={loading}>
      {loading ? 'Cerrando sesión...' : 'Cerrar Sesión'}
    </button>
  );
}
```

---

## Configuración CORS

### Orígenes Permitidos (Automático según Entorno)

**Desarrollo:**
```
http://localhost:5173
http://localhost:5174
https://*.ngrok-free.app (para testing remoto)
```

**Producción:**
```
https://sde.gob.ar
https://www.sde.gob.ar
```

### Cómo Cambiar Entorno
```bash
# En backend
export SPRING_PROFILES_ACTIVE=dev   # Desarrollo
export SPRING_PROFILES_ACTIVE=prod  # Producción
```

### Headers Soportados
- `Content-Type`
- `Authorization`
- Otros headers estándar

### Métodos Soportados
- `GET`
- `POST`
- `PUT`
- `DELETE`
- `OPTIONS`

---

## Resumen de Tareas para Leo y Maxi

### Leo:
1. **Autenticación (Auth)**
   - [ ] Crear página de Registro
   - [ ] Crear página de Login
   - [ ] Implementar manejo de tokens (localStorage)
   - [ ] Crear interceptor HTTP para agregar token automáticamente
   - [ ] Implementar logout
   - [ ] Mostrar errores de validación al usuario

### Maxi:
1. **Operaciones Protegidas**
   - [ ] Crear interfaz de Expedientes (crear, actualizar, eliminar)
   - [ ] Crear interfaz de Usuario (cambiar nombre, contraseña)
   - [ ] Crear interfaz de Denuncias (crear, cambiar estado)
   - [ ] Crear interfaz de Documentos (crear, eliminar)
   - [ ] Crear panel de Auditoría (solo visible para ADMIN)

### Ambos:
1. **Manejo de Errores**
   - [ ] Mostrar error 400 (validación)
   - [ ] Mostrar error 401 (sin autenticación)
   - [ ] Mostrar error 403 (sin permisos)
   - [ ] Mostrar error 429 (rate limiting - espera 60s)
   - [ ] Mostrar error 500 (servidor)

2. **Testing**
   - [ ] Probar flujo completo de registro
   - [ ] Probar flujo completo de login
   - [ ] Probar crear expediente
   - [ ] Probar logout
   - [ ] Probar token expirado (refrescamiento automático)
   - [ ] Probar peticiones sin token (debe redirigir a login)

---

## URLs Base

```
Desarrollo: http://localhost:8080
Producción: https://api.sde.gob.ar (ajustar según configuración real)
```

---

## Notas Importantes

1. **Token siempre en Header**: No envíes token en el body, siempre en `Authorization: Bearer <token>`
2. **Content-Type**: Siempre `application/json` cuando envíes JSON
3. **Errores 401**: Significa token expirado o inválido → redirigir a login
4. **Rate Limiting (429)**: Se resetea después de 60 segundos
5. **CORS**: Si aparece error de CORS en console, probablemente sea porque cambió el perfil a producción
6. **Token válido 1 hora**: Después necesitas usar refreshToken
7. **RefreshToken válido 7 días**: Después necesita hacer login nuevamente

