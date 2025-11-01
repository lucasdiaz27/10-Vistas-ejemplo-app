import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPasesByExpId,
  deleteExistingPase
} from '../../store/actions/pasesThunks'; 

import Swal from 'sweetalert2';
export default function TablaPases({ expedienteId, onEditar, onNuevo }) {
  
  const dispatch = useDispatch();
  const { pases, status, error } = useSelector(state => state.pases);

  //  --- Leer (Read) ---
  // Despachamos el thunk para traer los pases cuando el componente
  // se carga o cuando el expedienteId cambia.
  useEffect(() => {
    if (expedienteId) {
      dispatch(fetchPasesByExpId(expedienteId));
    }
  }, [expedienteId, dispatch]);

  //  --- Borrar (Delete) ---
  // Lógica interna para manejar la eliminación
  const handleEliminar = async (paseId) => {
    // Usamos Swal para confirmar, replicando la lógica de tu 'usePases.js'
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, ¡eliminar!',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        // Despachamos el Thunk de borrado
        await dispatch(deleteExistingPase(paseId)).unwrap();
        Swal.fire('¡Eliminado!', 'El pase ha sido eliminado.', 'success');

        // RE-FETCH: Si se borra, refrescamos la lista
        dispatch(fetchPasesByExpId(expedienteId));
        
        // (Opcional) Refrescar órdenes si es necesario
        // dispatch(fetchOrdenesByExpId(expedienteId));

      } catch (err) {
        Swal.fire('Error', err.message || 'No se pudo eliminar el pase.', 'error');
      }
    }
  };

  //  --- Manejo de Estados de Carga y Error ---
  if (status === 'loading') {
    return (
      <div className="text-center my-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando pases...</span>
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="alert alert-danger">
        <strong>Error:</strong> {error || 'No se pudieron cargar los pases.'}
      </div>
    );
  }

  //  --- Renderizado de la Tabla (JSX) ---
  return (
    <div className="table-responsive" style={{ paddingBottom: '2rem' }}>
      <div className="d-flex justify-content-end mb-2">
        {/* El botón 'Nuevo Pase' sigue llamando a la prop del padre */}
        <button className="btn btn-primary" onClick={onNuevo}>
          <i className="bi bi-plus-circle me-1"></i> Nuevo Pase
        </button>
      </div>
      <table className="table table-sm table-bordered mb-0 align-middle" style={{ borderRadius: '0.5rem', overflow: 'hidden' }}>
        <thead className="table-light">
          <tr>
            <th>Asunto</th>
            <th>Cant. Folios</th>
            <th>Área Origen</th>
            <th>Área Destino</th>
            <th>Descripción</th>
            <th>Fecha Acción</th>
            <th>Usuario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {/* Ahora 'pases' viene del 'useSelector' */}
          {pases.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center text-muted">No hay pases registrados para este expediente.</td>
            </tr>
          ) : (
            pases.map((pase, idx) => (
              <tr key={pase.id || idx}>
                <td>{pase.asunto || '-'}</td>
                <td>{pase.cantFolios || '-'}</td>
                <td>{pase.areaOrigen || '-'}</td>
                <td>{pase.areaDestino || '-'}</td>
                <td>{pase.descripcion || '-'}</td>
                <td>{pase.fechaAccion || '-'}</td>
                <td>{pase.nombreUsuario || '-'}</td>
                <td>
                  {/* El botón 'Editar' sigue llamando a la prop del padre */}
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => onEditar(pase)}>
                    <i className="bi bi-pencil"></i>
                  </button>
                  {/* El botón 'Eliminar' AHORA usa el handler interno */}
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleEliminar(pase.id)}>
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}