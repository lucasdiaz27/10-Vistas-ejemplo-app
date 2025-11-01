import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';


function ModalEditarOrden({ show, onClose, onGuardar, orden }) {

  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  useEffect(() => {
    if (show && orden) {
      reset({
        nombreVisible: orden.nombreVisible || ''
      });
    }
  }, [orden, show, reset]); 
  const onSubmit = (data) => {
    // 'data' es un objeto: { nombreVisible: "nuevo nombre" }
    onGuardar(orden.id, data.nombreVisible);
  };

  if (!show) {
    return null;
  }

  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-header">
              <h5 className="modal-title">Editar Orden</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="nombreVisible" className="form-label">Nombre Documento</label>
                
               
                <input
                  type="text"
                  className={`form-control ${errors.nombreVisible ? 'is-invalid' : ''}`} // Styling de error
                  placeholder="Escribe para cambiar el nombre de documento"
                  
                
                  {...register("nombreVisible", { required: "El nombre del documento es obligatorio" })}
                />
                
                
                {errors.nombreVisible && (
                  <div className="invalid-feedback">
                    {errors.nombreVisible.message}
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn btn-primary">Guardar Cambios</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ModalEditarOrden;