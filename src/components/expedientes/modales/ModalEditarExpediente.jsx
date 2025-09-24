import React, { useEffect, useState } from 'react';
import { editarExpediente, traerExpedientePorId} from "../../../apis/expedientesApi";
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';
import { useUsuarios } from '../../../hooks/useUsuarios';
// Componente reutilizable para seleccionar usuario
function UsuarioSelect({ label, name, value, onChange, usuariosDisponibles }) {
  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <select
        className="form-select"
        name={name}
        value={value ?? ''}
        onChange={onChange}
      >
        <option value="">Seleccionar...</option>
        {usuariosDisponibles.map(usuario => (
          <option key={usuario.id} value={usuario.id}>
            {usuario.nombreUsuario} - {usuario.rol}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function ModalEditarExpediente({ onClose, expediente, actualizarExpediente }) {
  const [form, setForm] = useState({ ...expediente });
  const {usuarios, fetchUsuarios} = useUsuarios()

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // name será usuario0, usuario1, usuario2, usuario3
    if (name.startsWith("usuario")) {
      const idSeleccionado = parseInt(value);
      const index = parseInt(name.replace("usuario", ""));
      const nuevosUsuarios = [...(form.usuarios ?? [])];
      nuevosUsuarios[index] = idSeleccionado;
      setForm((prev) => ({ ...prev, usuarios: nuevosUsuarios }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      const expedienteUpdateDTO = {
        nroExp: form.nro_exp,
        cant_folios: form.cant_folios,
        fecha_inicio: form.fecha_inicio,
        fecha_finalizacion: form.fecha_finalizacion,
        hipervulnerable: form.hipervulnerable,
        delegacion: 'DGC',
        usuarios: form.usuarios ?? [],
      };

      await editarExpediente(expediente.id, expedienteUpdateDTO, token);
        
      const data = await traerExpedientePorId(expediente.id, token);
      actualizarExpediente(data);
      Swal.fire({
        icon: 'success',
        title: 'Editar expediente',
        text: 'Expediente actualizado',
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
    } catch (error) {
      console.error('Error al actualizar expediente:', error);
      alert('Ocurrió un error al actualizar el expediente');
    }
    onClose();
  };

  const usuarioPrincipal = usuarios.find(u => u.id === form.usuarios?.[0]);

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

              {/* <div className="mb-3"> ... nro_exp ... </div> */}

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

              {/* <div className="mb-3"> ... fecha_inicio ... </div> */}

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
                  value={form.hipervulnerable === true ? "Sí" : form.hipervulnerable === false ? "No" : (form.hipervulnerable ?? "")}
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
                  value={'DGC'}
                  disabled
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <strong>Usuario: </strong>{usuarioPrincipal?.nombreUsuario ?? 'No seleccionado'}
              </div>

              {(form.usuarios ?? []).map((usuarioId, index) => (
  <div key={index} className="d-flex align-items-center mb-2">
    <UsuarioSelect
      label={`Usuario ${index + 1}`}
      name={`usuario${index}`}
      value={usuarioId}
      onChange={handleChange}
      usuariosDisponibles={usuarios}
    />
    <button
      type="button"
      className="btn btn-danger ms-2"
      onClick={() => {
        const nuevosUsuarios = [...form.usuarios];
        nuevosUsuarios.splice(index, 1); // elimina ese select
        setForm((prev) => ({ ...prev, usuarios: nuevosUsuarios }));
      }}
    >
      -
    </button>
  </div>
))}

<button
  type="button"
  className="btn btn-success"
  onClick={() =>
    setForm((prev) => ({
      ...prev,
      usuarios: [...(prev.usuarios ?? []), ""], // agrega un nuevo select vacío
    }))
  }
>
  + Añadir Usuario
</button>


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
