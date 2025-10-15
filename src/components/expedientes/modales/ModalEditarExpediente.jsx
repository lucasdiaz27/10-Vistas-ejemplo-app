import React, { useEffect, useState } from 'react';
import { editarExpediente, traerExpedientePorId } from "../../../apis/expedientesApi";
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';
import { useUsuarios } from '../../../hooks/useUsuarios';
import { parseJwt } from '../../../utils/auth';
import { showAccessDenied, verificarAcceso } from '../../../utils/accessDenied';

// Componente reutilizable para seleccionar usuario
function UsuarioSelect({
  label,
  name,
  value,
  onChange,
  usuariosDisponibles = [],
  usuariosSeleccionados = []
}) {
  // normalizar ids seleccionados a números (sin valores vacíos)
  const selectedIds = (usuariosSeleccionados || [])
    .filter(Boolean)
    .map(id => Number(id));

  const valNum = value === "" || value === null || value === undefined
    ? null
    : Number(value);

  const opciones = (usuariosDisponibles || []).filter(u => {
    const uId = Number(u.id);
    // permitir si no está seleccionado en otro select, o si es el valor actual del select
    return !selectedIds.includes(uId) || uId === valNum;
  });

  return (
    <div className="mb-3" style={{ minWidth: 240 }}>
      <label className="form-label">{label}</label>
      <select
        className="form-select"
        name={name}
        value={value ?? ''}
        onChange={onChange}
      >
        <option value="">Seleccionar...</option>
        {opciones.map(usuario => (
          <option key={usuario.id} value={usuario.id}>
            {usuario.nombreUsuario} {usuario.rol ? `- ${usuario.rol}` : ''}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function ModalEditarExpediente({ onClose, expediente, actualizarExpediente }) {
  // aseguramos que form siempre exista y que usuarios sea array
  const [form, setForm] = useState(() => ({ ...(expediente || {}), usuarios: (expediente?.usuarios ?? []).slice() }));
  const { usuarios = [], fetchUsuarios } = useUsuarios() || {};

  // cuando llega un nuevo expediente por props, actualizar el form
  useEffect(() => {
    setForm({ ...(expediente || {}), usuarios: (expediente?.usuarios ?? []).slice() });
  }, [expediente]);

  // traer usuarios (si tu hook lo requiere)
  useEffect(() => {
    if (fetchUsuarios) fetchUsuarios();
  }, [fetchUsuarios]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name && name.startsWith("usuario")) {
      // si value === '' -> dejamos string vacío (no seleccionado) en ese índice
      const idSeleccionado = value === "" ? "" : parseInt(value, 10);
      const index = parseInt(name.replace("usuario", ""), 10);
      const nuevosUsuarios = [...(form.usuarios ?? [])];

      // si el índice no existía, aseguramos longitud
      for (let i = nuevosUsuarios.length; i <= index; i++) nuevosUsuarios[i] = "";

      nuevosUsuarios[index] = idSeleccionado;
      setForm(prev => ({ ...prev, usuarios: nuevosUsuarios }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const token = localStorage.getItem('token');
      // Verificar permisos
      verificarAcceso("DIRECCION")

      // filtrar valores vacíos y convertir a números si corresponde
      const usuariosAEnviar = (form.usuarios ?? [])
        .filter(u => u !== "" && u !== null && u !== undefined)
        .map(u => Number(u));

      const expedienteUpdateDTO = {
        nroExp: form.nro_exp,
        cant_folios: form.cant_folios,
        fecha_inicio: form.fecha_inicio,
        fecha_finalizacion: form.fecha_finalizacion,
        hipervulnerable: form.hipervulnerable,
        delegacion: form.delegacion ?? 'DGC',
        usuarios: usuariosAEnviar,
      };

      await editarExpediente(expediente.id, expedienteUpdateDTO, token);

      const data = await traerExpedientePorId(expediente.id, token);
      if (actualizarExpediente) actualizarExpediente(data);

      Swal.fire({
        icon: 'success',
        title: 'Editar expediente',
        text: 'Expediente actualizado',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#00bcd4',
        background: '#f8fafc',
      });

      onClose?.();
    } catch (error) {
      console.error('Error al actualizar expediente:', error);
      alert('Ocurrió un error al actualizar el expediente');
    }
  };

  // Helper: nombres de usuarios seleccionados para la cabecera
  const usuariosNombres = (form.usuarios ?? [])
    .filter(u => u !== "" && u !== null && u !== undefined)
    .map(id => usuarios.find(u => Number(u.id) === Number(id))?.nombreUsuario)
    .filter(Boolean);

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
                <label className="form-label">Cantidad de Folios</label>
                <input
                  type="number"
                  className="form-control"
                  name="cant_folios"
                  value={form.cant_folios ?? ''}
                  onChange={handleChange}
                />
              </div>

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
                  value={form.delegacion ?? 'DGC'}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <strong>Usuarios: </strong>
                {usuariosNombres.length > 0 ? usuariosNombres.join(', ') : 'No seleccionados'}
              </div>

              {/* renderizar selects dinámicos */}
              {(form.usuarios ?? []).map((usuarioId, index) => (
                <div key={index} className="d-flex align-items-center mb-2">
                  <UsuarioSelect
                    label={`Usuario ${index + 1}`}
                    name={`usuario${index}`}
                    value={usuarioId}
                    onChange={handleChange}
                    usuariosDisponibles={usuarios}
                    usuariosSeleccionados={form.usuarios ?? []}
                  />
                  <button
                    type="button"
                    className="btn btn-danger ms-2"
                    onClick={() => {
                      const nuevosUsuarios = [...(form.usuarios ?? [])];
                      nuevosUsuarios.splice(index, 1);
                      setForm(prev => ({ ...prev, usuarios: nuevosUsuarios }));
                    }}
                  >
                    -
                  </button>
                </div>
              ))}

              <button
                type="button"
                className="btn btn-success"
                onClick={() => setForm(prev => ({ ...prev, usuarios: [...(prev.usuarios ?? []), ""] }))}
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
  actualizarExpediente: PropTypes.func
};
