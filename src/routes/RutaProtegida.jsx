import React from "react";
import { Navigate, Outlet, useLocation, useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function ProtectedRoute() {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const token = localStorage.getItem("token");
    const vista = searchParams.get("vista");

    // Si no hay token entonces se redirige al login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    try {
        const decoded = jwtDecode(token);
        const userRole =
            decoded?.rol || decoded?.role || decoded?.authorities?.[0] || null;

        // console.log("ROL DETECTADO:", userRole);

        // se define las rutas permitidas para cada rol
        const permisosPorRol = {
            // ✅ AGREGADO "/auditoria" y soporte para ADMIN
            DIRECCION: ["/menu-interno", "/mesa-entrada", "/expedientes", "/usuarios", "/ajustes", "/denuncia", "/auditoria"],
            ADMIN: ["/menu-interno", "/mesa-entrada", "/expedientes", "/usuarios", "/ajustes", "/denuncia", "/auditoria"],

            MESA_DE_ENTRADA: ["/menu-interno", "/mesa-entrada", "/ajustes", "/denuncia"],
            ABOGADOS: ["/menu-interno", "/mesa-entrada", "/expedientes", "/ajustes", "/denuncia"],
            ASESORIA_LEGAL: ["/menu-interno", "/mesa-entrada", "/expedientes", "/ajustes", "/denuncia"],
        };

        // sub vistas dentro del menu interno
        const vistasPorRol = {
            DIRECCION: ["mesa-entrada", "expedientes", "usuarios", "ajustes"],
            ADMIN: ["mesa-entrada", "expedientes", "usuarios", "ajustes"], // ✅ ADMIN también ve todo
            MESA_DE_ENTRADA: ["mesa-entrada", "ajustes"],
            ABOGADOS: ["mesa-entrada", "expedientes", "ajustes"],
            ASESORIA_LEGAL: ["mesa-entrada", "expedientes", "ajustes"],
        };

        // Si el rol no esta definido o no existe
        if (!userRole || !permisosPorRol[userRole]) {
            console.warn("Rol desconocido o sin permisos:", userRole);
            return <Navigate to="/menu-interno?vista=mesa-entrada" replace />;
        }

        // se verificar si la ruta actual esta permitida
        const rutaActual = location.pathname;
        const rutasPermitidas = permisosPorRol[userRole];
        const tienePermiso = rutasPermitidas.some((ruta) =>
            rutaActual.startsWith(ruta)
        );

        if (!tienePermiso) {
            console.warn(
                `Acceso denegado a ${rutaActual} para rol ${userRole}. Redirigiendo...`
            );

            // se redirigir a la ruta anterior o al menú interno si no hay historial
            const rutaAnterior =
                location.state?.from?.pathname || "/menu-interno?vista=mesa-entrada";

            return <Navigate to={rutaAnterior} replace />;
        }

        // Si está en /menu-interno, verificar también la vista, pero permitir modales y subrutas
        if (rutaActual.startsWith("/menu-interno")) {
            const vistasPermitidas = vistasPorRol[userRole] || [];
            if (vista && !vistasPermitidas.includes(vista)) {
                console.warn(`Vista ${vista} no permitida para ${userRole}, pero se permite si es modal o detalle.`);
                // solo redirige si NO hay un modal o detalle
                const esModalODetalle =
                    location.pathname.includes("/denuncia/") ||
                    location.pathname.includes("/expedientes/");
                if (!esModalODetalle) {
                    return <Navigate to="/menu-interno?vista=mesa-entrada" replace />;
                }
            }
        }

        // Si todo esta bien entonces se muestra el contenido protegido
        return <Outlet />;
    } catch (error) {
        console.error("Error al decodificar token:", error);
        return <Navigate to="/login" replace />;
    }
}