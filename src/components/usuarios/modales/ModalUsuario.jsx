import { useState, useEffect } from 'react';

function ModalUsuario({ tipo, usuario, onClose, onGuardar }) {
  const [form, setForm] = useState({ nombre: '', email: '', rol: 'Empleado', activo: true });

  useEffect(() => {
    if (tipo === 'editar' && usuario) {
      setForm(usuario);
    } else if (tipo === 'nuevo') {
      setForm({ nombre: '', email: '', rol: 'Empleado', activo: true });
    }
  }, [tipo, usuario]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
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
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Rol</label>
                <select
                  name="rol"
                  value={form.rol}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="Administrador">Administrador</option>
                  <option value="Empleado">Empleado</option>
                  <option value="Inspector">Inspector</option>
                </select>
              </div>
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  name="activo"
                  checked={form.activo}
                  onChange={handleChange}
                  id="activoCheck"
                />
                <label className="form-check-label" htmlFor="activoCheck">
                  Usuario activo
                </label>
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
