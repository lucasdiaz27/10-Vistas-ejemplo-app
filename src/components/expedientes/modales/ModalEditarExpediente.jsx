import { useState } from 'react';
import { editarExpediente } from "../../../apis/expedientesApi";

export default function ModalEditarExpediente({ onClose, expediente }) {
  const [form, setForm] = useState({ ...expediente });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "usuarios") {
      const arrayDeIds = value.split(",").map(id => Number(id.trim()));
      setForm((prev) => ({ ...prev, usuarios: arrayDeIds }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      // Convertimos lo que hay en form al formato que espera el backend
      const expedienteUpdateDTO = {
        nroExp: form.nro_exp,
        cant_folios: form.cant_folios,
        fecha_inicio: form.fecha_inicio,
        fecha_finalizacion: form.fecha_finalizacion,
        hipervulnerable: form.hipervulnerable,
        delegacion: form.delegacion,
        usuarios: form.usuarios ?? [],
      };

      await editarExpediente(expediente.id, expedienteUpdateDTO, token);
      alert('Expediente actualizado');
      onClose();
    } catch (error) {
      console.error('Error al actualizar expediente:', error);
      alert('Ocurrió un error al actualizar el expediente');
    }
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
              {/*<div className="mb-3">
                <label className="form-label">Número de Expediente</label>
                <input
                  type="text"
                  className="form-control"
                  name="nro_exp"
                  value={form.nro_exp ?? ''}
                  onChange={handleChange}
                />
              </div>*/}
              <div className="mb-3">
                <label className="form-label">Cantidad de Folios</label>
                <input
                  type="number"
                  className="form-control"
                  name="cant_folios"
                  value={form.cant_folios ?? ''}
                  onChange={handleChange}
                />
              </div>
              {/*<div className="mb-3">
                <label className="form-label">Fecha de Inicio</label>
                <input
                  type="date"
                  className="form-control"
                  name="fecha_inicio"
                  value={form.fecha_inicio ?? ''}
                  onChange={handleChange}
                />
              </div>*/}
              <div className="mb-3">
                <label className="form-label">Fecha de Finalización</label>
                <input
                  type="date"
                  className="form-control"
                  name="fecha_finalizacion"
                  value={form.fecha_finalizacion ?? ''}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">HV</label>
                <select
                  className="form-select"
                  name="hipervulnerable"
                  value={form.hipervulnerable ?? ''}
                  onChange={handleChange}
                >
                  <option value="">Seleccionar...</option>
                  <option value="sí">Sí</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Delegación</label>
                <input
                  type="text"
                  className="form-control"
                  name="delegacion"
                  value={form.delegacion ?? ''}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Usuarios (IDs separados por coma)</label>
                <input
                  type="text"
                  className="form-control"
                  name="usuarios"
                  value={Array.isArray(form.usuarios) ? form.usuarios.join(", ") : ""}
                  onChange={handleChange}
                />
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