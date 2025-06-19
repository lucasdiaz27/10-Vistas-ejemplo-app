import { useState, useEffect } from 'react';

function ModalUsuario({ tipo, usuario, onClose, onGuardar, roles = [] }) {
  const [form, setForm] = useState({ nombre: '', email: '', password: '', rol: roles[0]?.nombre || roles[0] || '' });

  useEffect(() => {
    if (tipo === 'editar' && usuario) {
      // Si el rol viene como objeto, usar su nombre. Si es string, usarlo directo.
      let rolValue = usuario.rol;
      if (rolValue && typeof rolValue === 'object' && rolValue.nombre) {
        rolValue = rolValue.nombre;
      }
      setForm({
        nombre: usuario.nombre || usuario.nombreUsuario || '',
        email: usuario.email || '',
        password: '',
        rol: rolValue || roles[0]?.nombre || roles[0] || ''
      });
    } else if (tipo === 'nuevo') {
      setForm({ nombre: '', email: '', password: '', rol: roles[0]?.nombre || roles[0] || '' });
    }
  }, [tipo, usuario, roles]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuardar(form);
    onClose();
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">
                {tipo === 'nuevo' ? 'Nuevo Usuario' : 'Editar Usuario'}
              </h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Contraseña</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Rol</label>
                <select
                  name="rol"
                  value={form.rol}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  {roles.map((rol) => (
                    <option key={rol.id || rol} value={rol.nombre || rol}>{rol.nombre || rol}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                {tipo === 'nuevo' ? 'Crear' : 'Guardar cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ModalUsuario;
