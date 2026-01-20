# 📋 Tareas Frontend - Nuevas Features de Seguridad del Backend

**Fecha:** 9 de enero de 2026  
**Para:** Leonel y Maximiliano  
**Basado en:** Nueva implementación de seguridad del backend

---

## 🎯 Resumen Ejecutivo

El backend acaba de implementar **5 capas de seguridad**:
1. JWT Authentication ✅ (Frontend ya tiene)
2. Rate Limiting (429) ❌ (Frontend NO maneja)
3. Input Validation ✅ (Backend valida)
4. CORS ✅ (Backend ya lo hace)
5. Audit Logging ❌ (Frontend NO tiene panel)

**Lo que falta en Frontend:**
- Página de **Registro** (Leo)
- Manejo de error **429 (Rate Limiting)** (Ambos)
- **CRUD de Expedientes** (Maxi)
- **Gestión de Usuario** (Leo)
- **Panel de Auditoría** (Maxi - solo si hay ADMIN)
- **APIs faltantes** (Ambos)

---

## ✅ Lo que Ya Existe (NO TOCAR)

```
✅ src/utils/authInterceptor.js   → Refrescamiento automático de tokens
✅ src/utils/auth.js               → Utilidades de tokens
✅ src/pages/Login.jsx             → Login funcional
✅ src/routes/PrivateRoute.jsx     → Protección de rutas
✅ src/apis/apiDenuncia.js         → APIs de denuncia
✅ src/pages/formulario.jsx        → Formulario de denuncia
```

**IMPORTANTE:** El interceptor ya tiene todo lo necesario. Solo agregan el token automáticamente a las peticiones.

---

## 📌 TAREA 1: Página de Registro (Leo)

### Ubicación
`src/pages/Registro.jsx` (CREAR NUEVO)

### Qué debe hacer
Formulario de registro con estos campos:
- email
- password (mín 8 caracteres)
- nombre
- apellido
- rol (OPERADOR, DENUNCIANTE, ADMIN)
- documento
- teléfono
- código postal (cp)
- localidad
- domicilio

### Validación
- Email válido (@Email)
- Password >= 8 caracteres
- Todos los campos requeridos

### Respuestas esperadas
- **200:** Éxito → guardar tokens → redirigir a dashboard
- **400:** Errores de validación → mostrar por campo
- **409:** Email duplicado → mostrar error

### Ejemplo mínimo
```jsx
import { useState } from 'react';
import { registerUsuario } from '../apis/apiAuth';
import { useNavigate } from 'react-router-dom';

const Registro = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '', password: '', name: '', apellido: '',
    rol: 'OPERADOR', documento: '', telefono: '',
    cp: '', localidad: '', domicilio: ''
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUsuario(formData);
      
      // Guardar tokens
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      
      // Redirigir
      navigate('/menu-interno');
    } catch (error) {
      if (error.response?.status === 400) {
        setErrors(error.response.data.details || {});
      } else if (error.response?.status === 409) {
        setErrors({ email: error.response.data.error });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* email */}
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
      />
      {errors.email && <span className="error">{errors.email}</span>}
      
      {/* password */}
      <input
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
        placeholder="Mínimo 8 caracteres"
      />
      {errors.password && <span className="error">{errors.password}</span>}
      
      {/* ...resto de campos */}
      
      <button type="submit">Registrarse</button>
    </form>
  );
};

export default Registro;
```

**Checklist:**
- [ ] Crear `Registro.jsx`
- [ ] Formulario con todos los campos
- [ ] Validación cliente (email, password >= 8)
- [ ] Mostrar errores por campo
- [ ] Guardar tokens en localStorage
- [ ] Redirigir a dashboard
- [ ] Ruta en `SiteApp.jsx` (antes de login)

---

## 📌 TAREA 2: Manejo de Rate Limiting (429) - AMBOS

### Dónde implementar
`src/utils/authInterceptor.js` (MODIFICAR)

### Qué debe hacer
Cuando backend responde **429**, mostrar:
- "Demasiados intentos. Espera 60 segundos"
- Deshabilitar botones de login/registro por 60s

### Ubicación en el interceptor
En la sección de `response.use()`, agregar:

```javascript
// DENTRO DEL INTERCEPTOR, en la función de error
if (error.response?.status === 429) {
  console.log('⚠️ Rate limit excedido (429)');
  
  // Mostrar alerta al usuario
  alert('Demasiados intentos. Espera 60 segundos antes de intentar de nuevo.');
  
  // Opcionalmente: Deshabilitar inputs por 60s
  const loginForm = document.querySelector('form');
  if (loginForm) {
    loginForm.style.pointerEvents = 'none';
    loginForm.style.opacity = '0.6';
    
    setTimeout(() => {
      loginForm.style.pointerEvents = 'auto';
      loginForm.style.opacity = '1';
    }, 60000); // 60 segundos
  }
  
  return Promise.reject(error);
}
```

**Checklist:**
- [ ] Agregar manejo de 429 en interceptor
- [ ] Mostrar mensaje de espera
- [ ] Opcionalmente deshabilitar formularios

---

## 📌 TAREA 3: CRUD Expedientes (Maxi)

### APIs a crear
`src/apis/apiExpedientes.js` (CREAR NUEVO)

```javascript
import { authAxios } from "../utils/auth";

const BASE_URL = "/expediente";

// Crear expediente
export const crearExpediente = async (data) => {
  return authAxios.post(BASE_URL, data);
};

// Obtener expediente por ID
export const obtenerExpediente = async (id) => {
  return authAxios.get(`${BASE_URL}/${id}`);
};

// Actualizar expediente
export const actualizarExpediente = async (id, data) => {
  return authAxios.put(`${BASE_URL}/${id}`, data);
};

// Eliminar expediente
export const eliminarExpediente = async (id) => {
  return authAxios.delete(`${BASE_URL}/${id}`);
};

// Listar expedientes del usuario
export const listarExpedientes = async () => {
  return authAxios.get(BASE_URL);
};
```

### Componentes a crear
`src/pages/Expedientes.jsx` (CREAR NUEVO)

```jsx
import { useState, useEffect } from 'react';
import { listarExpedientes, crearExpediente, eliminarExpediente } from '../apis/apiExpedientes';

const Expedientes = () => {
  const [expedientes, setExpedientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ descripcion: '', tipo: 'civil' });

  useEffect(() => {
    cargarExpedientes();
  }, []);

  const cargarExpedientes = async () => {
    try {
      setLoading(true);
      const response = await listarExpedientes();
      setExpedientes(response.data || []);
    } catch (err) {
      setError('Error al cargar expedientes');
    } finally {
      setLoading(false);
    }
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    try {
      await crearExpediente(formData);
      setFormData({ descripcion: '', tipo: 'civil' });
      cargarExpedientes();
      alert('Expediente creado');
    } catch (err) {
      if (err.response?.status === 400) {
        setError(Object.values(err.response.data.details)[0]);
      } else {
        setError('Error al crear expediente');
      }
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro?')) return;
    try {
      await eliminarExpediente(id);
      cargarExpedientes();
    } catch (err) {
      setError('Error al eliminar');
    }
  };

  return (
    <div>
      <h2>Expedientes</h2>
      
      <form onSubmit={handleCrear}>
        <input
          type="text"
          placeholder="Descripción"
          value={formData.descripcion}
          onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
          required
        />
        <select
          value={formData.tipo}
          onChange={(e) => setFormData({...formData, tipo: e.target.value})}
        >
          <option value="civil">Civil</option>
          <option value="penal">Penal</option>
          <option value="laboral">Laboral</option>
        </select>
        <button type="submit">Crear</button>
      </form>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <p>Cargando...</p>}

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Descripción</th>
            <th>Tipo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {expedientes.map(exp => (
            <tr key={exp.id}>
              <td>{exp.id}</td>
              <td>{exp.descripcion}</td>
              <td>{exp.tipo}</td>
              <td>
                <button onClick={() => handleEliminar(exp.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Expedientes;
```

**Checklist:**
- [ ] Crear `apiExpedientes.js`
- [ ] Crear `Expedientes.jsx` (listar, crear, eliminar)
- [ ] Página de detalle (opcional)
- [ ] Agregar ruta en `SiteApp.jsx`

---

## 📌 TAREA 4: Gestión de Usuario (Leo)

### APIs a crear
`src/apis/apiUsuario.js` (CREAR NUEVO)

```javascript
import { authAxios } from "../utils/auth";

const BASE_URL = "/usuario";

// Cambiar nombre
export const cambiarNombre = async (id, nombre) => {
  return authAxios.put(`${BASE_URL}/${id}/nombre`, { nombre });
};

// Cambiar contraseña
export const cambiarPassword = async (id, passwordAntigua, passwordNueva) => {
  return authAxios.put(`${BASE_URL}/${id}/password`, {
    passwordAntigua,
    passwordNueva
  });
};

// Actualizar usuario
export const actualizarUsuario = async (id, data) => {
  return authAxios.put(`${BASE_URL}/${id}`, data);
};

// Eliminar usuario
export const eliminarUsuario = async (id) => {
  return authAxios.delete(`${BASE_URL}/${id}`);
};
```

### Componente a crear
`src/pages/Ajustes.jsx` (YA EXISTE, MODIFICAR)

**Agregar secciones:**

1. **Cambiar Nombre**
```jsx
const [nuevoNombre, setNuevoNombre] = useState('');

const handleCambiarNombre = async (e) => {
  e.preventDefault();
  try {
    await cambiarNombre(userId, nuevoNombre);
    alert('Nombre actualizado');
    setNuevoNombre('');
  } catch (error) {
    if (error.response?.status === 401) {
      alert('Sesión expirada');
    } else {
      alert('Error al cambiar nombre');
    }
  }
};

return (
  <form onSubmit={handleCambiarNombre}>
    <input
      type="text"
      placeholder="Nuevo nombre"
      value={nuevoNombre}
      onChange={(e) => setNuevoNombre(e.target.value)}
    />
    <button type="submit">Cambiar Nombre</button>
  </form>
);
```

2. **Cambiar Contraseña**
```jsx
const [passwords, setPasswords] = useState({ 
  old: '', 
  new: '', 
  confirm: '' 
});

const handleCambiarPassword = async (e) => {
  e.preventDefault();
  
  if (passwords.new !== passwords.confirm) {
    alert('Las contraseñas no coinciden');
    return;
  }
  
  if (passwords.new.length < 8) {
    alert('La contraseña debe tener mínimo 8 caracteres');
    return;
  }
  
  try {
    await cambiarPassword(userId, passwords.old, passwords.new);
    alert('Contraseña actualizada');
    setPasswords({ old: '', new: '', confirm: '' });
  } catch (error) {
    if (error.response?.status === 401) {
      alert('Contraseña antigua incorrecta');
    } else {
      alert('Error al cambiar contraseña');
    }
  }
};

return (
  <form onSubmit={handleCambiarPassword}>
    <input
      type="password"
      placeholder="Contraseña antigua"
      value={passwords.old}
      onChange={(e) => setPasswords({...passwords, old: e.target.value})}
    />
    <input
      type="password"
      placeholder="Nueva contraseña"
      value={passwords.new}
      onChange={(e) => setPasswords({...passwords, new: e.target.value})}
    />
    <input
      type="password"
      placeholder="Confirmar contraseña"
      value={passwords.confirm}
      onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
    />
    <button type="submit">Cambiar Contraseña</button>
  </form>
);
```

**Checklist:**
- [ ] Crear `apiUsuario.js`
- [ ] Agregar sección cambiar nombre en `Ajustes.jsx`
- [ ] Agregar sección cambiar contraseña
- [ ] Validar que password nueva >= 8 caracteres
- [ ] Validar que password nueva = confirmación
- [ ] Manejo de error 401 (contraseña antigua incorrecta)

---

## 📌 TAREA 5: Panel de Auditoría (Maxi - OPCIONAL)

### APIs a crear
`src/apis/apiAuditoria.js` (CREAR NUEVO)

```javascript
import { authAxios } from "../utils/auth";

const BASE_URL = "/api/auditoria";

// Obtener logs (solo ADMIN)
export const obtenerLogsAuditoria = async (page = 0, size = 10) => {
  return authAxios.get(`${BASE_URL}/logs?page=${page}&size=${size}`);
};
```

### Componente a crear
`src/pages/Auditoria.jsx` (CREAR NUEVO)

```jsx
import { useState, useEffect } from 'react';
import { obtenerLogsAuditoria } from '../apis/apiAuditoria';

const Auditoria = () => {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarLogs();
  }, [page]);

  const cargarLogs = async () => {
    try {
      setLoading(true);
      const response = await obtenerLogsAuditoria(page, 10);
      setLogs(response.data.content || []);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      if (err.response?.status === 403) {
        setError('No tienes permisos para ver auditoría (requiere ser ADMIN)');
      } else {
        setError('Error al cargar logs');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Auditoría del Sistema</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <p>Cargando...</p>}

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Acción</th>
            <th>Descripción</th>
            <th>IP</th>
            <th>Resultado</th>
            <th>Fecha/Hora</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id}>
              <td>{log.id}</td>
              <td>{log.usuario}</td>
              <td>{log.accion}</td>
              <td>{log.descripcion}</td>
              <td>{log.ipCliente}</td>
              <td>
                <span className={log.resultado === 'SUCCESS' ? 'badge bg-success' : 'badge bg-danger'}>
                  {log.resultado}
                </span>
              </td>
              <td>{new Date(log.fechaHora).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>
          Anterior
        </button>
        <span>Página {page + 1} de {totalPages}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}>
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Auditoria;
```

**Checklist:**
- [ ] Crear `apiAuditoria.js`
- [ ] Crear `Auditoria.jsx`
- [ ] Tabla con paginación
- [ ] Mostrar error 403 si no es ADMIN
- [ ] Agregar ruta en `SiteApp.jsx` (protegida por rol ADMIN)

---

## 📌 TAREA 6: APIs Adicionales (Ambos)

### Crear `src/apis/apiDocumento.js`
```javascript
import { authAxios } from "../utils/auth";

const BASE_URL = "/documento";

// Crear orden de documento
export const crearOrdenDocumento = async (tipo, expedienteId) => {
  return authAxios.post(`${BASE_URL}/orden`, { tipo, expedienteId });
};

// Eliminar documento
export const eliminarDocumento = async (id) => {
  return authAxios.delete(`${BASE_URL}/${id}`);
};
```

### Crear `src/apis/apiRol.js`
```javascript
import { authAxios } from "../utils/auth";

const BASE_URL = "/rol";

// Crear rol (solo ADMIN)
export const crearRol = async (nombre, descripcion) => {
  return authAxios.post(BASE_URL, { nombre, descripcion });
};
```

**Checklist:**
- [ ] Crear `apiDocumento.js`
- [ ] Crear `apiRol.js`

---

## 🔐 Errores HTTP a Manejar - TODOS

| Código | Significado | Qué hacer |
|--------|-------------|-----------|
| **400** | Validación inválida | Mostrar errores por campo |
| **401** | Sin token/token expirado | Refrescamiento automático (ya lo hace el interceptor) |
| **403** | Sin permisos (no es ADMIN) | Mostrar "No tienes permiso" |
| **404** | Recurso no existe | Mostrar "No encontrado" |
| **409** | Email/recurso duplicado | Mostrar error específico |
| **429** | Rate limit (>10 req/60s) | Mostrar "Espera 60 segundos" |
| **500** | Error servidor | Mostrar "Error del servidor, intenta más tarde" |

---

## 🧪 Testing Checklist

- [ ] Flujo de **Registro → Login → Dashboard** completo
- [ ] **Rate limiting**: 11 intentos de login = error 429
- [ ] **Token expirado**: Espera 1 hora, intenta acción, se refrescar automáticamente
- [ ] **Cambiar contraseña**: Funciona y se puede loguear con nueva
- [ ] **CRUD Expedientes**: Crear, leer, actualizar, eliminar
- [ ] **Panel auditoría**: Solo visible para ADMIN, muestra logs
- [ ] **Sin token**: Intentar ir a ruta protegida = redirect a login
- [ ] **Error 400**: Campos inválidos muestran mensajes claros

---

## 📚 Referencias Rápidas

**Endpoints del Backend:**
```
POST   /auth/register              → Registro
POST   /auth/login                 → Login
POST   /auth/logout                → Logout
POST   /auth/refresh               → Refrescar token

POST   /expediente                 → Crear expediente
GET    /expediente/{id}            → Obtener expediente
PUT    /expediente/{id}            → Actualizar expediente
DELETE /expediente/{id}            → Eliminar expediente

PUT    /usuario/{id}               → Actualizar usuario
PUT    /usuario/{id}/nombre        → Cambiar nombre
PUT    /usuario/{id}/password      → Cambiar contraseña
DELETE /usuario/{id}               → Eliminar usuario

POST   /documento/orden            → Crear orden documento
DELETE /documento/{id}             → Eliminar documento

POST   /rol                        → Crear rol

GET    /api/auditoria/logs         → Ver logs (ADMIN)
```

**Rutas Protegidas:**
- `/expediente/*` - Requiere token
- `/usuario/*` - Requiere token
- `/api/auditoria/logs` - Requiere token ADMIN

---

## ⚡ Orden Recomendado de Implementación

1. **Leo:** Página de Registro (crítico)
2. **Ambos:** Manejo de 429 en interceptor (crítico)
3. **Maxi:** CRUD Expedientes (importante)
4. **Leo:** Gestión de Usuario (importante)
5. **Maxi:** Panel de Auditoría (opcional)
6. **Ambos:** Resto de APIs

---

## 📞 Preguntas Frecuentes

**P: ¿El token se refresca automáticamente?**  
R: SÍ, el interceptor en `authInterceptor.js` ya lo hace.

**P: ¿Dónde se guardan los tokens?**  
R: En `localStorage` (token y refreshToken).

**P: ¿Qué pasa si refreshToken expira?**  
R: El usuario se redirige a login automáticamente.

**P: ¿Cómo sé si soy ADMIN?**  
R: Decodifica el JWT con `parseJwt()` y verifica los `authorities`.

**P: ¿Rate limiting se aplica a todas las rutas?**  
R: SÍ, a todas. Máximo 10 peticiones por 60 segundos por IP.

---

**Última actualización:** 9 de enero de 2026  
**Estado:** Listo para implementar
