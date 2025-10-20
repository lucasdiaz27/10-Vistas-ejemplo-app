// src/components/expedientes/TablaPases.jsx

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPasesByExpId, deleteExistingPase } from "../../features/pases/pasesThunks";
import Swal from 'sweetalert2';

export default function TablaPases({ expedienteId, onNuevo, onEditar, onVer }) {
    const dispatch = useDispatch();
    const { pases, status, error } = useSelector((state) => state.pases);

    useEffect(() => {
        if (expedienteId) {
            dispatch(fetchPasesByExpId(expedienteId));
        }
    }, [expedienteId, dispatch]);

    const handleDelete = (paseId) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esta acción.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteExistingPase(paseId))
                    .unwrap()
                    .then(() => Swal.fire('¡Eliminado!', 'El pase ha sido eliminado.', 'success'))
                    .catch(() => Swal.fire('Error', 'No se pudo eliminar el pase.', 'error'));
            }
        });
    };

    if (status === 'loading') return <div className="text-center p-4">Cargando pases...</div>;
    if (status === 'failed') return <div className="alert alert-danger">Error al cargar pases: {error}</div>;

    return (
        <div className="table-responsive" style={{ paddingBottom: '2rem' }}>
            <div className="d-flex justify-content-end mb-2">
                <button className="btn btn-primary" onClick={onNuevo}>
                    <i className="bi bi-plus-circle me-1"></i> Nuevo Pase
                </button>
            </div>
            <table className="table table-sm table-bordered mb-0 align-middle">
                <thead className="table-light">
                    <tr>
                        <th>Asunto</th>
                        <th>Área Origen</th>
                        <th>Área Destino</th>
                        <th>Fecha Acción</th>
                        <th>Usuario</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {pases.length === 0 ? (
                        <tr>
                            <td colSpan={8} className="text-center text-muted">No hay pases registrados.</td>
                        </tr>
                    ) : (
                        pases.map((pase) => (
                            <tr key={pase.id}>
                                <td>{pase.asunto || '-'}</td>
                                <td>{pase.areaOrigen || '-'}</td>
                                <td>{pase.areaDestino || '-'}</td>
                                <td>{pase.fechaAccion ? new Date(pase.fechaAccion).toLocaleDateString() : '-'}</td>
                                <td>{pase.nombreUsuario || '-'}</td>
                                <td>
                                    <div className="btn-group btn-group-sm">
                                        <button className="btn btn-sm btn-outline-primary" onClick={() => onVer(pase)}>
                                            <i className="bi bi-eye"></i>
                                        </button>
                                        <button 
                                            className="btn btn-sm btn-outline-primary" 
                                            onClick={() => onEditar(pase)}
                                        >
                                            <i className="bi bi-pencil"></i>
                                        </button>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(pase.id)}>
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

