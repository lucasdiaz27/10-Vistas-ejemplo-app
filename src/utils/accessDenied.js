import Swal from 'sweetalert2';
import { parseJwt } from './auth';

export function showAccessDenied(message = 'No tienes permiso para acceder a esta sección.') {
    Swal.fire({
        icon: 'warning',
        title: 'Acceso Denegado',
        text: message,
        customClass: {
            title: 'swal2-title-modern',
            popup: 'swal2-popup-modern',
        },
        confirmButtonText: 'Aceptar',
    });
}

export function showAccessDeniedToast(message = 'Sin permiso para realizar esta acción.') {
    Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'warning',
        title: message,
        showConfirmButton: false,
        timer: 2500,
    });
}

export const verificarAcceso = (nombreRol) => {
    const token = localStorage.getItem('token');
    const payload = parseJwt(token);
    const rol = payload?.rol;
    const tienePermiso = rol === nombreRol;
    if (!tienePermiso) {
        showAccessDenied('No tienes permiso para editar expedientes.');
        return;
    }
}