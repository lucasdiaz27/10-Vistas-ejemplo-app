import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function ModalUsuario({ tipo, usuario, onClose, onGuardar, roles = [] }) {
  // --- CAMBIO 1: Estado inicial plano, reflejando el JSON final de Ale ---
  const [form, setForm] = useState({
    // Campos de la cuenta
    name: '', // Nombre de Usuario
    email: '',
    password: '',
    rol: roles[0]?.nombre || roles[0] || '',
    // Campos de la persona
    nombre: '', // Nombre de pila
    apellido: '',
    documento: '',
    domicilio: '',
    localidad: '',
    cp: '',
    telefono: '',
  });

  useEffect(() => {
    if (tipo === 'editar' && usuario) {
      let rolValue = usuario.rol;
      if (rolValue && typeof rolValue === 'object' && rolValue.nombre) {
        rolValue = rolValue.nombre;
      }
      // Poblamos el formulario con todos los datos (los de usuario y los de persona)
      setForm({
        name: usuario.name || usuario.nombreUsuario || '',
        email: usuario.email || '',
        password: '', // La contraseña no se precarga por seguridad
        rol: rolValue || roles[0]?.nombre || roles[0] || '',
        nombre: usuario.persona?.nombre || usuario.nombre || '',
        apellido: usuario.persona?.apellido || usuario.apellido || '',
        documento: usuario.persona?.documento || usuario.documento || '',
        domicilio: usuario.persona?.domicilio || usuario.domicilio || '',
        localidad: usuario.persona?.localidad || usuario.localidad || '',
        cp: usuario.persona?.cp || usuario.cp || '',
        telefono: usuario.persona?.telefono || usuario.telefono || '',
      });
    } else if (tipo === 'nuevo') {
      // Reseteamos el formulario completo
      setForm({
        name: '', email: '', password: '', rol: roles[0]?.nombre || roles[0] || '',
        nombre: '', apellido: '', documento: '', domicilio: '', localidad: '', cp: '', telefono: '',
      });
    }
  }, [tipo, usuario, roles]);

  // --- CAMBIO 2: Handler simplificado para un estado plano ---
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
    <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg" role="document"> {/* Hacemos el modal más grande */}
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{tipo === 'nuevo' ? 'Nuevo Usuario' : 'Editar Usuario'}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              {/* --- CAMBIO 3: Usamos un layout de columnas para organizar los campos --- */}
              <div className="row">
                <div className="col-md-6">
                  <h5>Datos de la Cuenta</h5>
                  <div className="mb-3">
                    <label className="form-label">Nombre de Usuario</label>
                    <input type="text" name="name" value={form.name} onChange={handleChange} className="form-control" required />
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
                </div>
                <div className="col-md-6">
                  <h5>Datos Personales</h5>
                  <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input type="text" name="nombre" value={form.nombre} onChange={handleChange} className="form-control" required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Apellido</label>
                    <input type="text" name="apellido" value={form.apellido} onChange={handleChange} className="form-control" required />
                  </div>
                   <div className="mb-3">
                    <label className="form-label">Documento</label>
                    <input type="number" name="documento" value={form.documento} onChange={handleChange} className="form-control" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Teléfono</label>
                    <input type="number" name="telefono" value={form.telefono} onChange={handleChange} className="form-control" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Domicilio</label>
                    <input type="text" name="domicilio" value={form.domicilio} onChange={handleChange} className="form-control" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Localidad</label>
                    <input type="text" name="localidad" value={form.localidad} onChange={handleChange} className="form-control" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Código Postal</label>
                    <input type="number" name="cp" value={form.cp} onChange={handleChange} className="form-control" />
                  </div>
                </div>
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

// Actualizamos los propTypes para que coincidan con la nueva estructura
ModalUsuario.propTypes = {
  tipo: PropTypes.oneOf(['nuevo', 'editar']).isRequired,
  usuario: PropTypes.shape({
    name: PropTypes.string,
    nombreUsuario: PropTypes.string, // Mantenemos por retrocompatibilidad
    email: PropTypes.string,
    rol: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({ nombre: PropTypes.string })]),
    persona: PropTypes.shape({ // Mantenemos por si el GET de la lista devuelve anidado
      nombre: PropTypes.string,
      apellido: PropTypes.string,
      telefono: PropTypes.string,
      domicilio: PropTypes.string,
      localidad: PropTypes.string,
      cp: PropTypes.string,
      documento: PropTypes.string,
    }),
    // Permitimos también los campos a nivel raíz
    nombre: PropTypes.string,
    apellido: PropTypes.string,
    telefono: PropTypes.string,
    domicilio: PropTypes.string,
    localidad: PropTypes.string,
    cp: PropTypes.string,
    documento: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
  onGuardar: PropTypes.func.isRequired,
  roles: PropTypes.array
};

export default ModalUsuario;

