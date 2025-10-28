import Swal from 'sweetalert2';
import { parseJwt } from './auth';

export const showAlert = ({ title, text, icon = 'info', confirmButtonText = 'Confirmar' }) => {
  return Swal.fire({
        title,
        text,
        icon,
        confirmButtonText,
        customClass: {
            title: 'swal2-title-modern',
            popup: 'swal2-popup-modern',
        },
        buttonsStyling: false,
  })
}

export function showAccessDenied(message = 'No tienes permiso para acceder a esta sección.') {
    showAlert({
        icon: 'warning',
        title: 'Acceso Denegado',
        text: message
    })
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

export function showSuccessAlert(message) {
    Swal.fire({
        icon: 'success',
        title: message,
        showConfirmButton: false,
        timer: 2000,
        position: 'top',
        background: '#fff',
        customClass: {
            popup: 'animated fadeInDown'
        }
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