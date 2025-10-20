import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPasesByExpId, deleteExistingPase } from "../../features/pases/pasesThunks";
import Swal from 'sweetalert2';

const estadoConfig = {

  "ADMITIDO": { label: "ADMITIDO", color: "success" },

  "RECHAZADO": { label: "RECHAZADO", color: "danger" },

  "AS. LEGAL": { label: "ASESORÍA LEGAL", color: "info" },

  "EN PROCESO": { label: "EN PROCESO", color: "info" },

  "EN INSPECCIÓN": { label: "EN INSPECCIÓN", color: "warning" },

  "EN SUBDIR": { label: "EN SUBDIRECCIÓN", color: "primary" },

  "EN DIR": { label: "EN DIRECCIÓN", color: "primary" },

  "FINALIZADO": { label: "FINALIZADO", color: "success" },

  // Estados en minúsculas para compatibilidad con datos existentes

  "admitido": { label: "ADMITIDO", color: "success" },

  "rechazado": { label: "RECHAZADO", color: "danger" },

  "as. legal": { label: "ASESORÍA LEGAL", color: "info" },

  "en proceso": { label: "EN PROCESO", color: "info" },

  "en inspección": { label: "EN INSPECCIÓN", color: "warning" },

  "en subdir": { label: "EN SUBDIRECCIÓN", color: "primary" },

  "en dir": { label: "EN DIRECCIÓN", color: "primary" },

  "finalizado": { label: "FINALIZADO", color: "success" },

  // Estados anteriores para compatibilidad

  "pendiente": { label: "PENDIENTE", color: "warning" },

  "aprobada": { label: "APROBADA", color: "success" },

  "no admitido": { label: "NO ADMITIDO", color: "secondary" },

  "rechazada": { label: "RECHAZADA", color: "danger" },

  "completado": { label: "COMPLETADO", color: "success" },

};

// 1. AHORA RECIBE EL ID DEL EXPEDIENTE Y EL MANEJADOR DE MENSAJES
export default function ListaDePases({ expedienteId, abrirModal, setMensaje }) {
    const dispatch = useDispatch();

    // 2. LEEMOS EL ESTADO DIRECTAMENTE DESDE EL STORE DE REDUX
    const { pases, status, error } = useSelector((state) => state.pases);

    // 3. EFECTO PARA CARGAR LOS PASES CUANDO EL COMPONENTE SE MONTA O EL ID CAMBIA
    useEffect(() => {
        if (expedienteId) {
            dispatch(fetchPasesByExpId(expedienteId));
        }
    }, [expedienteId, dispatch]);

    // 4. FUNCIÓN PARA MANEJAR LA ELIMINACIÓN
    const handleDelete = (paseId) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esta acción.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteExistingPase(paseId))
                    .unwrap() // .unwrap() nos permite usar .then() y .catch()
                    .then(() => {
                        Swal.fire(
                            '¡Eliminado!',
                            'El pase ha sido eliminado.',
                            'success'
                        );
                        // Opcional: si necesitas que el componente padre se actualice, usa setMensaje
                        // setMensaje("Pase eliminado correctamente");
                    })
                    .catch((err) => {
                        Swal.fire(
                            'Error',
                            'No se pudo eliminar el pase.',
                            'error'
                        );
                    });
            }
        });
    };

    // 5. RENDERIZADO CONDICIONAL BASADO EN EL ESTADO DE CARGA
    if (status === 'loading') {
        return <p>Cargando pases...</p>;
    }

    if (status === 'failed') {
        return <p>Error al cargar los pases: {error}</p>;
    }

    return (
        <div className="card">
            <div className="card-body p-0">
                <table className="table table-hover mb-0">
                    <thead className="table-primary">
                        <tr>
                            <th>Fecha</th>
                            <th>Asunto</th>
                            <th>Origen</th>
                            <th>Destino</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* 6. MAPEAMOS LOS DATOS REALES DE LOS PASES */}
                        {pases.length > 0 ? (
                            pases.map((pase) => (
                                <tr key={pase.id}>
                                    <td>{new Date(pase.fecha).toLocaleDateString()}</td>
                                    <td>{pase.asunto}</td>
                                    <td>{pase.origen}</td>
                                    <td>{pase.destino}</td>
                                    <td>
                                        <span className={`badge bg-${estadoConfig[pase.estado]?.color || 'secondary'}`}>
                                            {estadoConfig[pase.estado]?.label || pase.estado}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="btn-group btn-group-sm">
                                            {/* Pasamos el objeto 'pase' completo al modal */}
                                            <button className="btn btn-outline-primary" onClick={() => abrirModal('ver', pase)}>
                                                <i className="bi bi-eye"></i>
                                            </button>
                                            <button className="btn btn-outline-primary" onClick={() => abrirModal('editar', pase)}>
                                                <i className="bi bi-pencil"></i>
                                            </button>
                                            <button className="btn btn-outline-danger" onClick={() => handleDelete(pase.id)}>
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">No hay pases para este expediente.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}