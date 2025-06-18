import React, { useState } from 'react';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';

export default function ModalEditarExpediente({ onClose, expediente }) {
  const [form, setForm] = useState({ ...expediente });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Swal.fire({
      icon: 'info',
      title: 'Funcionalidad pendiente',
      text: 'Expediente actualizado (funcionalidad pendiente)',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#00bcd4',
      background: '#f8fafc',
      customClass: {
        title: 'swal2-title-modern',
        popup: 'swal2-popup-modern',
      },
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    });
    onClose();
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Editar Expediente</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">DNI</label>
                <input
                  type="text"
                  className="form-control"
                  name="dni"
                  value={form.dni}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Tipo</label>
                <select
                  className="form-select"
                  name="tipo"
                  value={form.tipo}
                  onChange={handleChange}
                >
                  <option>Reclamo</option>
                  <option>Denuncia</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Estado</label>
                <select
                  className="form-select"
                  name="estado"
                  value={form.estado}
                  onChange={handleChange}
                >
                  <option>Pendiente</option>
                  <option>En proceso</option>
                  <option>Finalizado</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

ModalEditarExpediente.propTypes = {
  onClose: PropTypes.func.isRequired,
  expediente: PropTypes.object.isRequired,
};
