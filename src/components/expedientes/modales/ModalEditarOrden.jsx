import React, { useState, useEffect } from 'react';

// Modal para EDITAR una orden
function ModalEditarOrden({ show, onClose, onGuardar, orden }) {

  const [formData, setFormData] = useState({
    tipoDocumento: '',
    nombreVisible: '',
    referencia: '',
  });

  useEffect(() => {
    if (orden) {
      setFormData({
        tipoDocumento: orden.tipoDocumento || '',
        nombreVisible: orden.nombreVisible || '', 
        referencia: orden.referencia || '',
      });
    } else {
      // Reseteamos por si acaso
      setFormData({
        tipoDocumento: '',
        nombreVisible: '',
        referencia: '',
      });
    }
  }, [orden]); // Este efecto depende de la 'orden'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuardar(orden.id, formData.nombreVisible);
  };

  if (!show) {
    return null;
  }

  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Editar Orden</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">

        
              <div className="mb-3">
                <label htmlFor="nombreVisible" className="form-label">Nombre Documento</label>
                <input
                  type="text"
                  className="form-control"
                  id="nombreVisible"
                  name="nombreVisible"
                  value={formData.nombreVisible}
                  onChange={handleChange}
                  placeholder="Escribe para cambiar el nombre de documento"
                  required
                />
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