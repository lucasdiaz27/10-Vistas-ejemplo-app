import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function ModalUsuario({ tipo, usuario, onClose, onGuardar, roles = [] }) {
  const [form, setForm] = useState({
    nombre: '', // Nombre de Usuario
    email: '',
    password: '',
    rol: roles[0]?.nombre || roles[0] || '',
    persona: {
      nombre: '', // Nombre personal
      apellido: '',
      telefono: '',
      domicilio: '', // Este campo guardará el valor del "Sector"
    },
  });

  useEffect(() => {
    if (tipo === 'editar' && usuario) {
      let rolValue = usuario.rol;
      if (rolValue && typeof rolValue === 'object' && rolValue.nombre) {
        rolValue = rolValue.nombre;
      }
      setForm({
        nombre: usuario.nombre || usuario.nombreUsuario || '',
        email: usuario.email || '',
        password: '',
        rol: rolValue || roles[0]?.nombre || roles[0] || '',
        persona: {
          nombre: usuario.persona?.nombre || '',
          apellido: usuario.persona?.apellido || '',
          telefono: usuario.persona?.telefono || '',
          domicilio: usuario.persona?.domicilio || '',
        },
      });
    } else if (tipo === 'nuevo') {
      setForm({
        nombre: '',
        email: '',
        password: '',
        rol: roles[0]?.nombre || roles[0] || '',
        persona: {
          nombre: '',
          apellido: '',
          telefono: '',
          domicilio: '',
        },
      });
    }
  }, [tipo, usuario, roles]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in form.persona) {
      setForm((prev) => ({
        ...prev,
        persona: { ...prev.persona, [name]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuardar(form);
    onClose();
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{tipo === 'nuevo' ? 'Nuevo Usuario' : 'Editar Usuario'}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Nombre de Usuario</label>
                <input type="text" name="nombre" value={form.nombre} onChange={handleChange} className="form-control" required />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} className="form-control" required />
              </div>
              <div className="mb-3">
                <label className="form-label">Contraseña</label>
                <input type="password" name="password" value={form.password} onChange={handleChange} className="form-control" required={tipo === 'nuevo'} />
              </div>
              <div className="mb-3">
                <label className="form-label">Rol</label>
                <select name="rol" value={form.rol} onChange={handleChange} className="form-select" required>
                  {roles.map((rol) => (
                    <option key={rol.id || rol} value={rol.nombre || rol}>{rol.nombre || rol}</option>
                  ))}
                </select>
              </div>
              <hr />
              <h5 className="mb-3">Datos Personales</h5>
              <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input type="text" name="nombre" value={form.persona.nombre} onChange={handleChange} className="form-control" required />
              </div>
              <div className="mb-3">
                <label className="form-label">Apellido</label>
                <input type="text" name="apellido" value={form.persona.apellido} onChange={handleChange} className="form-control" required />
              </div>
              <div className="mb-3">
                <label className="form-label">Teléfono</label>
                <input type="text" name="telefono" value={form.persona.telefono} onChange={handleChange} className="form-control" />
              </div>
              <div className="mb-3">
                {/* --- ¡AQUÍ ESTÁ LA CORRECCIÓN! --- */}
                <label className="form-label">Sector</label>
                <input
                  type="text"
                  name="domicilio" // El 'name' se mantiene para no romper el estado
                  value={form.persona.domicilio}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Ingrese el sector"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn btn-primary">{tipo === 'nuevo' ? 'Crear' : 'Guardar cambios'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

ModalUsuario.propTypes = {
  tipo: PropTypes.oneOf(['nuevo', 'editar']).isRequired,
  usuario: PropTypes.shape({
    nombre: PropTypes.string,
    nombreUsuario: PropTypes.string,
    email: PropTypes.string,
    rol: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({ nombre: PropTypes.string })
    ]),
    persona: PropTypes.shape({
      nombre: PropTypes.string,
      apellido: PropTypes.string,
      telefono: PropTypes.string,
      domicilio: PropTypes.string,
    })
  }),
  onClose: PropTypes.func.isRequired,
  onGuardar: PropTypes.func.isRequired,
  roles: PropTypes.array
};

export default ModalUsuario;

