# Guía Completa de Implementación de Seguridad

## Índice
1. [Resumen General](#resumen-general)
2. [Componentes de Seguridad](#componentes-de-seguridad)
3. [Flujos de Funcionamiento](#flujos-de-funcionamiento)
4. [Arquitectura General](#arquitectura-general)
5. [Ejemplos de Uso](#ejemplos-de-uso)
6. [Configuración en Producción](#configuración-en-producción)

---

## Resumen General

Se implementó un sistema completo de seguridad que protege el backend contra:
- **Ataques de fuerza bruta** (Rate Limiting)
- **CORS inseguro** (CORS Estricto)
- **Validación de datos insegura** (OWASP Input Validation)
- **Acceso no autorizado** (JWT Authentication)
- **Falta de trazabilidad** (Audit Logging)

### Principios de Diseño
- **Defensa en profundidad**: múltiples capas de protección
- **Principio de menor privilegio**: cada usuario solo puede hacer lo necesario
- **Trazabilidad completa**: cada acción se registra para auditoría
- **Rate limiting**: prevención de abuso de API

---

## Componentes de Seguridad

### 1. JWT (JSON Web Tokens) - Autenticación
**Ubicación:** `src/main/java/com/dircomercio/site_backend/auth/`

#### ¿Qué es?
Sistema de autenticación sin estado basado en tokens firmados criptográficamente. Permite que un usuario se autentique una sola vez y luego use un token para las siguientes peticiones sin necesidad de enviar contraseña.

#### Archivo: `JwtService.java`
```
Responsabilidades:
├── generateToken(Usuario) → Crea JWT con claims (email, roles)
├── generateRefreshToken(Usuario) → Crea token de refrescamiento
├── extractUsername(token) → Extrae email del token
├── isTokenValid(token, usuario) → Verifica firma y expiración
└── isTokenExpired(token) → Valida que no haya expirado
```

**Configuración en `application.properties`:**
```properties
jwt.secret=${JWT_SECRET}              # Clave para firmar tokens (debe ser larga y segura)
jwt.expiration=${JWT_EXPIRATION}      # Validez del token (ej: 1 hora)
jwt.refresh-expiration=${JWT_REFRESH_EXPIRATION}  # Validez refresh (ej: 7 días)
```

#### Archivo: `JwtAuthFilter.java`
- **Funciona como:** Filtro servlet que intercepta cada petición
- **Qué hace:**
  1. Extrae el token del header `Authorization: Bearer <token>`
  2. Valida que el token sea válido y no esté expirado
  3. Carga los datos del usuario en el contexto de seguridad
  4. Permite que Spring Security continúe procesando la petición

#### Archivo: `TokenRepository.java` + `Token.java` (Entidad)
- **Base de datos de tokens:** Almacena tokens emitidos
- **Campos:**
  - `token`: el JWT en sí
  - `user`: relación a Usuario
  - `tokenType`: siempre BEARER
  - `expired`: si fue marcado como expirado
  - `revoked`: si fue revocado (logout)

**¿Por qué almacenar tokens si son sin estado?**
Para poder **revocar tokens** cuando el usuario cierra sesión. Sin esto, un token válido seguiría funcionando hasta expirar.

---

### 2. CORS Estricto - Control de Origen
**Ubicación:** `src/main/java/com/dircomercio/site_backend/auth/config/SecurityConfig.java` (método `corsConfigurationSource()`)

#### ¿Qué es?
CORS (Cross-Origin Resource Sharing) controla qué dominios pueden hacer peticiones al backend. Sin esto, cualquier sitio web podría acceder a tu API.

#### Configuración Dual
Se detecta automáticamente el perfil activo:

**Desarrollo (`spring.profiles.active=dev`):**
```
Orígenes permitidos:
- http://localhost:5173
- http://localhost:5174
- ngrok (para testing remoto)
```

**Producción (`spring.profiles.active=prod`):**
```
Orígenes permitidos:
- https://sde.gob.ar
- https://www.sde.gob.ar
```

#### Métodos Permitidos
- `GET`, `POST`, `PUT`, `DELETE` (todas las operaciones CRUD)

#### Headers Permitidos
- `Content-Type`: tipos de datos aceptados
- `Authorization`: para enviar tokens JWT

#### Credenciales
- `allowCredentials = true`: permite cookies y headers de autenticación

**Flujo de CORS:**
```
1. Frontend hace petición OPTIONS (preflight)
2. Backend responde con sus politicas CORS
3. Si el origen está permitido, frontend envía petición real
4. Si no está permitido, navegador rechaza la petición
```

---

### 3. Rate Limiting - Prevención de Abuso
**Ubicación:** `src/main/java/com/dircomercio/site_backend/auth/redis/`

#### ¿Qué es?
Sistema que limita cuántas peticiones puede hacer un usuario en un tiempo determinado. Previene:
- Ataques de fuerza bruta
- DoS (Denegación de Servicio)
- Scraping de datos

#### Configuración
```
Límite: 10 peticiones
Ventana de tiempo: 60 segundos
Por: Dirección IP + Ruta

Ejemplo: /auth/login máximo 10 intentos cada 60 segundos por IP
```

#### Componentes

**Archivo: `RateLimitService.java`**
```
Responsabilidades:
├── allowRequest(ip, ruta) → Verifica si se permite la petición
│   ├── Si count < 10: permite y incrementa contador
│   └── Si count >= 10: rechaza
├── Redis almacena contador con clave: "rate:IP:ruta"
└── Expiración automática: 60 segundos
```

**Archivo: `RateLimitFilter.java`**
```
Funciona como: Filtro servlet (se ejecuta ANTES de los controllers)
Qué hace:
1. Extrae IP del usuario (considerando proxies)
2. Obtiene ruta de la petición (/auth/login, /expediente, etc)
3. Pregunta a RateLimitService: ¿se permite esta petición?
4. Si NO: responde 429 (Too Many Requests) + esperar 60 segundos
5. Si SÍ: continúa con la petición normal
```

**Archivo: `RedisConfig.java`**
```
Configuración de Redis:
├── LettuceConnectionFactory: conexión a servidor Redis
├── StringRedisTemplate: cliente para operar Redis
└── Dependencia: docker-compose con redis:7-alpine
```

#### Almacenamiento en Redis
```
Estructura de clave: "rate:192.168.1.1:/auth/login"
Valor: número de peticiones en la ventana actual
Expiración: 60 segundos (automática)

Ejemplo temporal:
T=0s:   primera petición (count=1)
T=5s:   segunda petición (count=2)
T=60s:  se borra automáticamente, contador = 0
```

---

### 4. Input Validation - Validación de Datos (OWASP)
**Ubicación:** `src/main/java/com/dircomercio/site_backend/dtos/`

#### ¿Qué es?
Validación de datos de entrada para prevenir:
- SQL Injection
- XSS (Cross-Site Scripting)
- Datos inválidos en base de datos
- Mensajes de error que revelen estructura interna

#### Implementación: Anotaciones Javax.Validation
```java
@NotBlank(message = "El email no puede estar vacío")
private String email;

@Email(message = "El email debe ser válido")
private String email;

@Size(min = 8, message = "La contraseña debe tener mínimo 8 caracteres")
private String password;

@NotNull(message = "El rol no puede ser nulo")
private String rol;
```

#### DTOs Protegidos (Data Transfer Objects)
```
LoginRequest:
├── email (@Email)
├── password (@NotBlank, @Size)

RegisterRequest:
├── email (@Email)
├── password (@NotBlank, @Size)
├── name (@NotBlank)
├── rol (@NotNull)
└── ... (persona datos: documento, telefono, etc)

ExpedienteCreateDTO:
├── descripcion (@NotBlank)
├── tipo (@NotNull)
└── ...

Y todos los demás DTOs con sus respectivas validaciones
```

#### Cómo Funciona
```
1. Frontend envía JSON con datos
2. Controller recibe con @Valid (ej: @Valid @RequestBody ExpedienteCreateDTO)
3. Spring valida automáticamente:
   - Si falla: devuelve 400 (Bad Request) + detalles de error
   - Si pasa: continúa a la lógica del negocio
```

**Ventajas:**
- Previene valores nulos/vacíos
- Valida formatos (email, números, etc)
- Límites de longitud
- Mensajes de error seguros (sin exponer detalles técnicos)

---

### 5. Audit Logging - Registro de Acciones
**Ubicación:** `src/main/java/com/dircomercio/site_backend/`

#### ¿Qué es?
Sistema que registra TODAS las acciones sensibles para:
- Cumplimiento legal/auditoría
- Investigación de incidentes de seguridad
- Análisis de comportamiento de usuarios
- Trazabilidad completa

#### Entidad: `AuditoriaLog.java`
```java
@Entity
public class AuditoriaLog {
    @Id @GeneratedValue
    private Long id;
    
    private String usuario;           // Email del que hizo la acción
    private String accion;            // REGISTER_FAILED, LOGIN_SUCCESS, LOGOUT_SUCCESS, etc
    private String descripcion;       // Detalles de qué pasó
    private String ipCliente;         // De dónde vino la petición
    private String resultado;         // SUCCESS o FAILURE
    private String tipoEntidad;       // Usuario, Expediente, Denuncia, etc
    private Long idEntidad;           // ID del recurso afectado
    private LocalDateTime fechaHora;  // Cuándo sucedió
}
```

#### Acciones Registradas

**En AuthService.java:**
```
REGISTER_FAILED
├── Causa: rol inválido
└── Causa: email ya en uso

REGISTER_SUCCESS
├── Qué: usuario registrado
└── Con: ID del usuario nuevo

LOGIN_FAILED
├── Qué: credenciales inválidas
└── Usuario: intento de login fallido

LOGIN_SUCCESS
├── Qué: usuario entró al sistema
└── Con: ID del usuario

LOGOUT_SUCCESS
├── Qué: usuario cerró sesión
└── Con: ID del usuario
```

**En Controllers:**
```
ExpedienteController:
├── CREATE_EXPEDIENTE_SUCCESS/FAILURE
├── UPDATE_EXPEDIENTE_SUCCESS/FAILURE
└── DELETE_EXPEDIENTE_SUCCESS/FAILURE

UsuarioController:
├── UPDATE_USUARIO_SUCCESS/FAILURE
├── DELETE_USUARIO_SUCCESS/FAILURE
├── UPDATE_NOMBRE_SUCCESS/FAILURE
└── CHANGE_PASSWORD_SUCCESS/FAILURE

RolController:
├── CREATE_ROL_SUCCESS/FAILURE

DenunciaController:
├── CREATE_DENUNCIA_SUCCESS/FAILURE
└── UPDATE_DENUNCIA_STATE_SUCCESS/FAILURE

DocumentoController:
├── DELETE_DOCUMENTO_SUCCESS/FAILURE
└── CREATE_ORDEN_SUCCESS/FAILURE
```

#### Componentes

**Archivo: `AuditoriaService.java`**
```java
public void registrarAccion(
    String usuario,      // Email
    String accion,       // Tipo de acción
    String descripcion,  // Detalles
    String ip,          // IP del cliente
    String resultado,   // SUCCESS/FAILURE
    String tipoEntidad, // Tabla afectada
    Long idEntidad      // ID del registro
)
```

**Archivo: `AuditoriaLogRepository.java`**
- Interfaz para acceder a los logs en base de datos
- Permite búsquedas: por usuario, por acción, por fecha, por resultado

**Archivo: `AuditoriaController.java`**
```
Endpoints:
GET /api/auditoria/logs
├── Requiere: @PreAuthorize("hasRole('ADMIN')")
├── Devuelve: todos los logs
├── Filtro: por usuario, acción, fecha, resultado
└── Paginación: 10 logs por página
```

#### Flujo Completo de Auditoría
```
1. Usuario hace acción (ej: crear expediente)
2. Controller intercepta
3. Intenta ejecutar servicio
4. Si SUCCESS:
   └─→ auditoriaService.registrarAccion("usuario@email.com", "CREATE_EXPEDIENTE_SUCCESS", 
                                        "Expediente #123 creado", "192.168.1.50", 
                                        "SUCCESS", "Expediente", 123L)
5. Si FAILURE:
   └─→ auditoriaService.registrarAccion("usuario@email.com", "CREATE_EXPEDIENTE_FAILURE", 
                                        "Error: descripción vacía", "192.168.1.50", 
                                        "FAILURE", "Expediente", null)
6. Log se guarda en base de datos
7. Accesible solo para ADMINS vía /api/auditoria/logs
```

#### Utilidad IpUtil
```java
public static String obtenerIP(HttpServletRequest request) {
    // Obtiene IP real considerando:
    // - X-Forwarded-For (proxies)
    // - X-Real-IP (nginx)
    // - request.getRemoteAddr() (directo)
    // Importante: previene falsa IP cuando hay proxies inversos
}
```

---

## Flujos de Funcionamiento

### A. Flujo de Registro de Usuario

```
┌─────────────────────────────────────────────────────────────────┐
│ USUARIO ENVÍA: POST /auth/register                               │
│ JSON: {email, password, name, rol, documento, telefono, ...}    │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ RATE LIMITING CHECK (RateLimitFilter)                            │
│ - Obtiene IP: 192.168.1.50                                       │
│ - Clave Redis: "rate:192.168.1.50:/auth/register"               │
│ - Verifica: count <= 10 en últimos 60s                          │
│ ├─ Si NO → Rechaza 429 (Too Many Requests)                      │
│ └─ Si SÍ → Continúa                                              │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ CORS CHECK (SecurityConfig.corsConfigurationSource)              │
│ - Origen: https://sde.gob.ar                                     │
│ - ¿Está en lista blanca? SÍ                                      │
│ - Continúa                                                        │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ INPUT VALIDATION (RegisterRequest @Valid)                        │
│ - @Email: valida email                                           │
│ - @NotBlank: valida password no vacía                           │
│ - @Size: password >= 8 caracteres                               │
│ ├─ Si falla → 400 Bad Request                                    │
│ └─ Si pasa → Continúa                                            │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ BUSINESS LOGIC (AuthService.register)                            │
│                                                                   │
│ 1. Valida rol: valueOf(request.rol().toUpperCase())             │
│    ├─ Si falla → AUDIT: REGISTER_FAILED (rol inválido)         │
│    └─ Si pasa → Continúa                                        │
│                                                                   │
│ 2. Verifica email único: existsByEmail(request.email())        │
│    ├─ Si existe → AUDIT: REGISTER_FAILED (email duplicado)     │
│    └─ Si no existe → Continúa                                   │
│                                                                   │
│ 3. Busca persona existente por documento                         │
│    ├─ Si existe → Crea usuario con persona existente            │
│    └─ Si no existe → Crea persona + usuario nuevos              │
│                                                                   │
│ 4. Codifica contraseña: passwordEncoder.encode(password)        │
│                                                                   │
│ 5. Genera JWT: jwtService.generateToken(usuario)                │
│                                                                   │
│ 6. Genera Refresh Token: jwtService.generateRefreshToken(user)  │
│                                                                   │
│ 7. Almacena token en BD: saveUserToken(usuario, jwt)           │
│                                                                   │
│ 8. AUDIT: REGISTER_SUCCESS                                      │
│    auditoriaService.registrarAccion(                            │
│      usuario@email,                                              │
│      "REGISTER_SUCCESS",                                         │
│      "Usuario registrado: usuario@email",                       │
│      "192.168.1.50",                                            │
│      "SUCCESS",                                                  │
│      "Usuario",                                                  │
│      userId                                                      │
│    )                                                             │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ RESPONSE: 200 OK                                                  │
│ {                                                                 │
│   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",          │
│   "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."   │
│ }                                                                 │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ BASE DE DATOS - REGISTROS CREADOS:                               │
│                                                                   │
│ tabla_usuario:                                                    │
│ ├── id: 1                                                        │
│ ├── email: usuario@email.com                                    │
│ ├── contraseña: $2a$10$encrypted...                             │
│ └── rol: OPERADOR                                                │
│                                                                   │
│ tabla_token:                                                      │
│ ├── token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...              │
│ ├── user_id: 1                                                   │
│ ├── expired: false                                               │
│ └── revoked: false                                               │
│                                                                   │
│ tabla_auditoria_log:                                              │
│ ├── usuario: usuario@email.com                                   │
│ ├── accion: REGISTER_SUCCESS                                    │
│ ├── descripcion: Usuario registrado: usuario@email.com          │
│ ├── ip_cliente: 192.168.1.50                                    │
│ ├── resultado: SUCCESS                                           │
│ ├── tipo_entidad: Usuario                                        │
│ ├── id_entidad: 1                                                │
│ └── fecha_hora: 2026-01-09 14:30:45                             │
│                                                                   │
│ redis:                                                            │
│ └── rate:192.168.1.50:/auth/register → 1 (con expira en 60s)   │
└─────────────────────────────────────────────────────────────────┘
```

---

### B. Flujo de Login

```
┌─────────────────────────────────────────────────────────────────┐
│ USUARIO ENVÍA: POST /auth/login                                  │
│ JSON: {email: "usuario@email.com", password: "myPassword123"}   │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ RATE LIMITING CHECK                                              │
│ Clave: "rate:192.168.1.50:/auth/login"                         │
│ - Si >= 10 intentos en 60s → 429 Too Many Requests             │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ INPUT VALIDATION (LoginRequest)                                  │
│ - @Email on email                                                │
│ - @NotBlank on password                                          │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ AUTHENTICATION (AuthService.login)                               │
│                                                                   │
│ try {                                                             │
│   authenticationManager.authenticate(                            │
│     new UsernamePasswordAuthenticationToken(email, password)    │
│   )                                                              │
│ } catch (Exception e) {                                          │
│   // Credenciales inválidas                                      │
│   AUDIT: LOGIN_FAILED                                            │
│   auditoriaService.registrarAccion(                              │
│     email,                                                       │
│     "LOGIN_FAILED",                                              │
│     "Credenciales invalidas",                                   │
│     "192.168.1.50",                                              │
│     "FAILURE",                                                   │
│     "Usuario",                                                   │
│     null                                                         │
│   )                                                              │
│   throw e → 401 Unauthorized                                     │
│ }                                                                │
│                                                                   │
│ // Credenciales válidas - Continúa                              │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ GENERA TOKENS                                                     │
│ 1. JWT Token (1 hora):                                           │
│    - Claims: email, authorities, iat, exp                       │
│    - Firma: HMAC-SHA256 con JWT_SECRET                          │
│                                                                   │
│ 2. Refresh Token (7 días):                                       │
│    - Para renovar JWT sin hacer login nuevamente                │
│                                                                   │
│ 3. Revoca tokens antiguos:                                       │
│    - Busca tokens activos del usuario                            │
│    - Los marca como expired=true, revoked=true                  │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ ALMACENA TOKEN EN BD                                              │
│ saveUserToken(usuario, jwtToken)                                │
│ ├── Crea Token entity                                            │
│ ├── token_type: BEARER                                           │
│ ├── expired: false                                               │
│ └── revoked: false                                               │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ AUDIT: LOGIN_SUCCESS                                             │
│ auditoriaService.registrarAccion(                                │
│   email,                                                         │
│   "LOGIN_SUCCESS",                                               │
│   "Sesion iniciada: usuario@email.com",                         │
│   "192.168.1.50",                                                │
│   "SUCCESS",                                                     │
│   "Usuario",                                                     │
│   userId                                                         │
│ )                                                                │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ RESPONSE: 200 OK                                                  │
│ {                                                                 │
│   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",          │
│   "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."   │
│ }                                                                 │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ FRONTEND ALMACENA:                                                │
│ - Token en memoria o localStorage                                │
│ - RefreshToken en httpOnly cookie (más seguro)                  │
└─────────────────────────────────────────────────────────────────┘
```

---

### C. Flujo de Petición Autenticada (ej: crear expediente)

```
┌─────────────────────────────────────────────────────────────────┐
│ USUARIO ENVÍA: POST /expediente                                  │
│ Headers: Authorization: Bearer eyJhbGciOiJIUzI1NiIs...          │
│ Body: {descripcion, tipo, ...}                                   │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ RATE LIMITING (RateLimitFilter)                                  │
│ Clave: "rate:192.168.1.50:/expediente"                          │
│ - Verifica <= 10 peticiones en 60s                              │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ JWT VALIDATION (JwtAuthFilter)                                   │
│                                                                   │
│ 1. Extrae token del header: "Bearer eyJ..."                      │
│ 2. Llama: jwtService.extractUsername(token)                      │
│    └─ Obtiene email del token                                    │
│ 3. Busca usuario: usuarioRepository.findByEmail(email)          │
│ 4. Valida: isTokenValid(token, usuario)                         │
│    ├─ Verifica firma HMAC-SHA256                                 │
│    ├─ Verifica no expirado: exp > now                            │
│    ├─ Verifica no revocado en BD: revoked=false                 │
│    └─ Verifica no expirado en BD: expired=false                 │
│ 5. Carga usuario en SecurityContext:                             │
│    SecurityContextHolder.getContext().setAuthentication(...)    │
│                                                                   │
│ Si falla en cualquier punto: 401 Unauthorized                   │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ INPUT VALIDATION (ExpedienteCreateDTO @Valid)                   │
│ - descripcion: @NotBlank                                         │
│ - tipo: @NotNull                                                 │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ AUTHORIZATION (Spring Security)                                  │
│ - Obtiene roles del usuario del token                            │
│ - Verifica @PreAuthorize, @Secured, etc en el controller        │
│ (en este caso no hay restricción, OPERADOR puede crear)         │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ BUSINESS LOGIC (ExpedienteController.crearExpediente)           │
│                                                                   │
│ try {                                                             │
│   Usuario usuarioActual = securityContextHolder...              │
│   Expediente exp = expedienteService.crear(dto);               │
│   // SUCCESS                                                     │
│   AUDIT: CREATE_EXPEDIENTE_SUCCESS                              │
│   auditoriaService.registrarAccion(                              │
│     usuarioActual.getEmail(),                                    │
│     "CREATE_EXPEDIENTE_SUCCESS",                                 │
│     "Expediente creado: " + exp.getId(),                        │
│     IpUtil.obtenerIP(request),                                   │
│     "SUCCESS",                                                   │
│     "Expediente",                                                │
│     exp.getId()                                                  │
│   )                                                              │
│   return ResponseEntity.ok(expediente)                           │
│ } catch (Exception e) {                                          │
│   // FAILURE                                                     │
│   AUDIT: CREATE_EXPEDIENTE_FAILURE                              │
│   auditoriaService.registrarAccion(                              │
│     usuarioActual.getEmail(),                                    │
│     "CREATE_EXPEDIENTE_FAILURE",                                 │
│     "Error: " + e.getMessage(),                                  │
│     IpUtil.obtenerIP(request),                                   │
│     "FAILURE",                                                   │
│     "Expediente",                                                │
│     null                                                         │
│   )                                                              │
│   throw e → 500 Internal Server Error                           │
│ }                                                                │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ RESPONSE: 200 OK                                                  │
│ {                                                                 │
│   "id": 1,                                                       │
│   "descripcion": "...",                                          │
│   "tipo": "...",                                                 │
│   "createdAt": "2026-01-09T14:35:20"                           │
│ }                                                                 │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ BASE DE DATOS - REGISTROS:                                       │
│                                                                   │
│ tabla_expediente:                                                 │
│ ├── id: 1                                                        │
│ ├── descripcion: "..."                                           │
│ └── usuario_id: 5 (ID del usuario que lo creó)                  │
│                                                                   │
│ tabla_auditoria_log:                                              │
│ ├── usuario: usuario@email.com                                   │
│ ├── accion: CREATE_EXPEDIENTE_SUCCESS                           │
│ ├── descripcion: Expediente creado: 1                           │
│ ├── ip_cliente: 192.168.1.50                                    │
│ ├── resultado: SUCCESS                                           │
│ ├── tipo_entidad: Expediente                                     │
│ ├── id_entidad: 1                                                │
│ └── fecha_hora: 2026-01-09 14:35:20                             │
└─────────────────────────────────────────────────────────────────┘
```

---

### D. Flujo de Logout

```
┌─────────────────────────────────────────────────────────────────┐
│ USUARIO ENVÍA: POST /auth/logout                                 │
│ Headers: Authorization: Bearer eyJhbGciOiJIUzI1NiIs...          │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ RATE LIMITING                                                     │
│ Clave: "rate:192.168.1.50:/auth/logout"                        │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ EXTRAE TOKEN                                                      │
│ authHeader = "Bearer eyJ..."                                     │
│ jwt = authHeader.substring(7) → "eyJ..."                       │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ BUSCA TOKEN EN BD                                                 │
│ Token token = tokenRepository.findByToken(jwt)                  │
│                                                                   │
│ ├─ Si no existe: throw IllegalArgumentException                 │
│ │  └─ AUDIT: LOGOUT_FAILED                                     │
│ │                                                                │
│ └─ Si existe: Continúa                                           │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ REVOCA TOKEN                                                      │
│ token.setRevoked(true)    → No se puede usar más               │
│ token.setExpired(true)    → Marca como expirado                │
│ tokenRepository.save(token)                                     │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ AUDIT: LOGOUT_SUCCESS                                            │
│ auditoriaService.registrarAccion(                                │
│   token.getUser().getEmail(),                                    │
│   "LOGOUT_SUCCESS",                                              │
│   "Sesion cerrada",                                              │
│   "192.168.1.50",                                                │
│   "SUCCESS",                                                     │
│   "Usuario",                                                     │
│   token.getUser().getId()                                        │
│ )                                                                │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ RESPONSE: 200 OK                                                  │
│ "Sesión cerrada correctamente"                                  │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ RESULTADO:                                                        │
│ - Token del usuario ahora está revocado                          │
│ - No puede hacer más peticiones con ese token                    │
│ - Si intenta: 401 Unauthorized (token revoked)                  │
│ - Debe hacer login nuevamente para obtener nuevo token           │
└─────────────────────────────────────────────────────────────────┘
```

---

## Arquitectura General

```
┌─────────────────────────────────────────────────────────────────┐
│                          FRONTEND (SPA)                           │
│                    (React/Vue en localhost:5173)                 │
└─────────────────────────────────────────────────────────────────┘
                               ↕
┌─────────────────────────────────────────────────────────────────┐
│                     INTERNET / NETWORK                            │
└─────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│              SPRING BOOT APPLICATION (8080)                      │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    SERVLET FILTERS                          │ │
│  │                   (ejecución en orden)                      │ │
│  │                                                              │ │
│  │  1. RateLimitFilter                                        │ │
│  │     └─ Verifica: 10 req/60s por IP                         │ │
│  │     └─ Rechaza con 429 si excede                           │ │
│  │     └─ Usa: Redis (redis:7-alpine:6379)                  │ │
│  │                                                              │ │
│  │  2. CORS Filter (nativo Spring)                            │ │
│  │     └─ Verifica: origen en whitelist                       │ │
│  │     └─ Rechaza si no autorizado                            │ │
│  │                                                              │ │
│  │  3. JwtAuthFilter                                           │ │
│  │     └─ Extrae token del header Authorization              │ │
│  │     └─ Valida firma y expiración                          │ │
│  │     └─ Carga usuario en SecurityContext                   │ │
│  │     └─ Usa: JwtService, TokenRepository                   │ │
│  │                                                              │ │
│  │  4. Otros filtros estándar de Spring                       │ │
│  │                                                              │ │
│  └────────────────────────────────────────────────────────────┘ │
│                            ↓                                      │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              CONTROLLERS (RestControllers)                 │ │
│  │                                                              │ │
│  │  AuthController:                                           │ │
│  │  ├─ POST /auth/register                                   │ │
│  │  ├─ POST /auth/login                                      │ │
│  │  ├─ POST /auth/logout                                     │ │
│  │  └─ POST /auth/refresh                                    │ │
│  │                                                              │ │
│  │  ExpedienteController:                                     │ │
│  │  ├─ POST /expediente (crear)                              │ │
│  │  ├─ PUT /expediente/{id} (actualizar)                     │ │
│  │  ├─ DELETE /expediente/{id} (eliminar)                    │ │
│  │  └─ GET /expediente/{id} (obtener)                        │ │
│  │                                                              │ │
│  │  UsuarioController:                                        │ │
│  │  ├─ PUT /usuario/{id}                                     │ │
│  │  ├─ DELETE /usuario/{id}                                  │ │
│  │  ├─ PUT /usuario/{id}/nombre                              │ │
│  │  └─ PUT /usuario/{id}/password                            │ │
│  │                                                              │ │
│  │  ... (otros controllers: Rol, Denuncia, Documento, etc)   │ │
│  │                                                              │ │
│  │  AuditoriaController:                                      │ │
│  │  └─ GET /api/auditoria/logs (@PreAuthorize ADMIN)        │ │
│  │                                                              │ │
│  └────────────────────────────────────────────────────────────┘ │
│                            ↓                                      │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │               DTO VALIDATION (@Valid)                      │ │
│  │                                                              │ │
│  │  - LoginRequest: email (@Email), password (@NotBlank)    │ │
│  │  - RegisterRequest: email, password, nombre, documento   │ │
│  │  - ExpedienteCreateDTO: descripcion, tipo                │ │
│  │  - ... (todos los DTOs validados)                         │ │
│  │                                                              │ │
│  │  Si falla validación → 400 Bad Request                    │ │
│  │                                                              │ │
│  └────────────────────────────────────────────────────────────┘ │
│                            ↓                                      │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              AUTHORIZATION (Spring Security)               │ │
│  │                                                              │ │
│  │  - @PreAuthorize("hasRole('ADMIN')")                      │ │
│  │    └─ Solo administradores: ver logs de auditoría         │ │
│  │                                                              │ │
│  │  - Roles: OPERADOR, DENUNCIANTE, ADMIN                    │ │
│  │                                                              │ │
│  └────────────────────────────────────────────────────────────┘ │
│                            ↓                                      │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              SERVICES (Business Logic)                     │ │
│  │                                                              │ │
│  │  AuthService:                                              │ │
│  │  ├─ register(request, servletRequest): TokenResponse      │ │
│  │  ├─ login(request, servletRequest): TokenResponse         │ │
│  │  ├─ logout(authHeader, servletRequest): void              │ │
│  │  └─ refreshToken(authHeader): TokenResponse               │ │
│  │                                                              │ │
│  │  ExpedienteService:                                        │ │
│  │  ├─ crear(dto): Expediente                               │ │
│  │  ├─ actualizar(id, dto): Expediente                       │ │
│  │  ├─ eliminar(id): void                                    │ │
│  │  └─ obtenerPorId(id): Expediente                          │ │
│  │                                                              │ │
│  │  AuditoriaService:                                         │ │
│  │  └─ registrarAccion(usuario, accion, descripcion, ip,    │ │
│  │                     resultado, tipoEntidad, idEntidad)   │ │
│  │                                                              │ │
│  │  JwtService:                                               │ │
│  │  ├─ generateToken(usuario): String                        │ │
│  │  ├─ generateRefreshToken(usuario): String                 │ │
│  │  ├─ extractUsername(token): String                        │ │
│  │  ├─ isTokenValid(token, usuario): boolean                 │ │
│  │  └─ isTokenExpired(token): boolean                        │ │
│  │                                                              │ │
│  │  RateLimitService:                                         │ │
│  │  └─ allowRequest(ip, ruta): boolean                       │ │
│  │                                                              │ │
│  │  ... (otros servicios)                                     │ │
│  │                                                              │ │
│  └────────────────────────────────────────────────────────────┘ │
│                            ↓                                      │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │           REPOSITORIES (Data Access Layer)                 │ │
│  │                                                              │ │
│  │  UsuarioRepository.findByEmail(email): Optional<Usuario>  │ │
│  │  TokenRepository.findByToken(token): Token                │ │
│  │  ExpedienteRepository.findById(id): Optional<Expediente>  │ │
│  │  AuditoriaLogRepository.findAll(), save(), ...            │ │
│  │                                                              │ │
│  │  ... (otros repositories)                                  │ │
│  │                                                              │ │
│  └────────────────────────────────────────────────────────────┘ │
│                            ↓                                      │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    JPA/HIBERNATE                           │ │
│  │         (Object-Relational Mapping to MySQL)             │ │
│  │                                                              │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                               ↓
         ┌───────────────────────────────────────┐
         │     MYSQL DATABASE (localhost:3306)   │
         │                                        │
         │  Tablas:                               │
         │  ├─ usuario                            │
         │  ├─ persona                            │
         │  ├─ token                              │
         │  ├─ auditoria_log ← Todos los logs   │
         │  ├─ expediente                         │
         │  ├─ denuncia                           │
         │  ├─ documento                          │
         │  ├─ rol                                │
         │  ├─ pase                               │
         │  └─ ... (otras tablas)                 │
         │                                        │
         └───────────────────────────────────────┘
                               ↓
         ┌───────────────────────────────────────┐
         │       REDIS (localhost:6379)          │
         │      (Cache para Rate Limiting)      │
         │                                        │
         │  Claves:                               │
         │  └─ rate:IP:ruta → contador (60s)    │
         │                                        │
         │  Ejemplo:                              │
         │  └─ rate:192.168.1.50:/auth/login→2  │
         │                                        │
         └───────────────────────────────────────┘
```

---

## Ejemplos de Uso

### Ejemplo 1: Flujo Completo con cURL

**1. Registro:**
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "SecurePass123",
    "name": "Juan",
    "apellido": "Perez",
    "rol": "OPERADOR",
    "documento": "12345678",
    "telefono": "1234567890",
    "cp": "1425",
    "localidad": "CABA",
    "domicilio": "Calle 123"
  }'

Respuesta:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqdWFuQGV4YW1wbGUuY29tIiwiaWF0IjoxNjczMzA0OTQyLCJleHAiOjE2NzMzMDg1NDJ9.SIGNATURE...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**2. Login (si ya existe usuario):**
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "SecurePass123"
  }'

Respuesta:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**3. Usar token para crear expediente:**
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X POST http://localhost:8080/expediente \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "descripcion": "Expediente de prueba",
    "tipo": "civil"
  }'

Respuesta:
{
  "id": 1,
  "descripcion": "Expediente de prueba",
  "tipo": "civil",
  "createdAt": "2026-01-09T14:35:20"
}

Base de datos (auditoria_log):
- usuario: juan@example.com
- accion: CREATE_EXPEDIENTE_SUCCESS
- descripcion: Expediente creado: 1
- ip_cliente: 127.0.0.1
- resultado: SUCCESS
- tipo_entidad: Expediente
- id_entidad: 1
```

**4. Logout:**
```bash
curl -X POST http://localhost:8080/auth/logout \
  -H "Authorization: Bearer $TOKEN"

Respuesta:
"Sesión cerrada correctamente"

Base de datos (auditoria_log):
- usuario: juan@example.com
- accion: LOGOUT_SUCCESS
- descripcion: Sesion cerrada
- resultado: SUCCESS
```

**5. Intentar usar token después de logout:**
```bash
curl -X POST http://localhost:8080/expediente \
  -H "Authorization: Bearer $TOKEN"

Respuesta: 401 Unauthorized
(porque el token fue marcado como revoked)
```

**6. Ver logs de auditoría (solo ADMIN):**
```bash
TOKEN_ADMIN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X GET "http://localhost:8080/api/auditoria/logs?page=0&size=10" \
  -H "Authorization: Bearer $TOKEN_ADMIN"

Respuesta (si es ADMIN):
{
  "content": [
    {
      "id": 1,
      "usuario": "juan@example.com",
      "accion": "REGISTER_SUCCESS",
      "descripcion": "Usuario registrado: juan@example.com",
      "ipCliente": "127.0.0.1",
      "resultado": "SUCCESS",
      "tipoEntidad": "Usuario",
      "idEntidad": 1,
      "fechaHora": "2026-01-09T14:30:45"
    },
    ...
  ],
  "totalElements": 10,
  "totalPages": 1,
  "currentPage": 0
}

Respuesta (si NO es ADMIN):
403 Forbidden
```

---

### Ejemplo 2: Rate Limiting en Acción

**Sin Rate Limiting:**
```bash
# Hago 20 peticiones rapidísimo
for i in {1..20}; do
  curl -s -X POST http://localhost:8080/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email": "test@test.com", "password": "wrongpass"}'
done

# Las 20 pasan sin problema
```

**Con Rate Limiting (10 por 60s):**
```bash
# Petición 1-10: 200/401 (depende de credenciales)
curl -X POST http://localhost:8080/auth/login ...
# Petición 11+: 429 Too Many Requests

{
  "timestamp": "2026-01-09T14:36:42.123Z",
  "status": 429,
  "error": "Too Many Requests",
  "message": "Rate limit exceeded. Please wait 60 seconds."
}

# Redis internamente tiene:
rate:192.168.1.50:/auth/login → 10 (expira en 60s)

# Después de 60s: contador se resetea, puede hacer 10 más
```

---

### Ejemplo 3: Validación de Input (OWASP)

**Input Válido:**
```bash
curl -X POST http://localhost:8080/auth/register \
  -d '{
    "email": "juan@example.com",
    "password": "SecurePassword123",
    "name": "Juan"
  }'

Respuesta: 200 OK (procesa)
```

**Input Inválido - Email:**
```bash
curl -X POST http://localhost:8080/auth/register \
  -d '{
    "email": "INVALID_EMAIL",
    "password": "SecurePassword123",
    "name": "Juan"
  }'

Respuesta: 400 Bad Request
{
  "error": "Validation failed",
  "details": {
    "email": "El email debe ser válido"
  }
}
```

**Input Inválido - Contraseña corta:**
```bash
curl -X POST http://localhost:8080/auth/register \
  -d '{
    "email": "juan@example.com",
    "password": "short",
    "name": "Juan"
  }'

Respuesta: 400 Bad Request
{
  "error": "Validation failed",
  "details": {
    "password": "La contraseña debe tener mínimo 8 caracteres"
  }
}
```

**Input Inválido - SQL Injection Attempt:**
```bash
curl -X POST http://localhost:8080/auth/login \
  -d '{
    "email": "admin' OR '1'='1",
    "password": "anything"
  }'

¿Qué pasa?
1. ValidationFilter rechaza (email inválido)
2. Aunque pasara, JPA usa prepared statements (inmune a SQL injection)
3. Además, el email se busca en BD: findByEmail(email) → no coincide
4. Resultado: 401 Unauthorized (credenciales inválidas)
```

---

## Configuración en Producción

### Variables de Entorno Requeridas

```bash
# JWT
export JWT_SECRET="una-clave-super-larga-y-segura-de-al-menos-64-caracteres-numerosletras"
export JWT_EXPIRATION="3600000"           # 1 hora en ms
export JWT_REFRESH_EXPIRATION="604800000" # 7 días en ms

# Database MySQL
export DB_HOST="mysql.example.com"
export DB_PORT="3306"
export DB_NAME="site_backend_db"
export DB_USER="backend_user"
export DB_PASSWORD="secure_db_password"

# Redis
export REDIS_HOST="redis.example.com"
export REDIS_PORT="6379"

# Spring profiles
export SPRING_PROFILES_ACTIVE="prod"

# CORS (ya está en código, pero verificar)
# Desarrollo: localhost:5173, localhost:5174
# Producción: https://sde.gob.ar
```

### Docker Compose para Desarrollo

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: site_backend_db
      MYSQL_USER: backend_user
      MYSQL_PASSWORD: backend_password
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    restart: always

  backend:
    build: .
    environment:
      SPRING_PROFILES_ACTIVE: dev
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/site_backend_db
      SPRING_DATASOURCE_USERNAME: backend_user
      SPRING_DATASOURCE_PASSWORD: backend_password
      SPRING_REDIS_HOST: redis
      JWT_SECRET: ${JWT_SECRET}
      JWT_EXPIRATION: 3600000
      JWT_REFRESH_EXPIRATION: 604800000
    ports:
      - "8080:8080"
    depends_on:
      - mysql
      - redis

volumes:
  mysql_data:
```

### Checklist de Seguridad Antes de Producción

- [ ] `JWT_SECRET` es larga (64+ caracteres) y segura
- [ ] CORS solo permite dominios de producción (sde.gob.ar)
- [ ] Base de datos MySQL en servidor separado (no localhost)
- [ ] Redis en servidor separado con contraseña (no sin autenticación)
- [ ] SSL/TLS habilitado (HTTPS)
- [ ] Rate Limiting configurado apropiadamente
- [ ] Logs de auditoría se guardan en base de datos externa
- [ ] Backups de base de datos programados
- [ ] Firewall restringe acceso solo a puertos necesarios
- [ ] Secrets (contraseñas) están en variables de entorno, NO en código
- [ ] Usuarios ADMIN creados solo manualmente
- [ ] Spring Security headers configurados (X-Frame-Options, etc)

---

## Conclusión

Este sistema implementa **5 capas de seguridad** que trabajan en conjunto:

1. **Rate Limiting** (Redis) → Previene ataques de fuerza bruta
2. **CORS** → Previene acceso desde dominios no autorizados
3. **JWT** → Autenticación segura sin estado
4. **Input Validation** → Previene inyecciones y datos inválidos
5. **Audit Logging** → Trazabilidad completa para investigación

Cada capa es independiente pero complementaria, proporcionando **defensa en profundidad** contra los ataques más comunes.

