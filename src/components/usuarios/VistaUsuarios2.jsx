// VistaUsuarios.jsx

import { useEffect, useState } from 'react';
import TablaUsuarios from './TablaUsuarios';
import ModalUsuario from './modales/ModalUsuario';

export default function VistaUsuarios2() {
  const [usuarios, setUsuarios] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [rolFiltro, setRolFiltro] = useState('');
  const [modal, setModal] = useState(null); // 'nuevo' | 'editar'
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  useEffect(() => {
    // Simular carga de datos inicial
    setUsuarios([
      { id: 1, nombre: 'Ana Martínez', email: 'ana.martinez@empresa.com', rol: 'Administrador', activo: true },
      { id: 2, nombre: 'Carlos López', email: 'carlos.lopez@empresa.com', rol: 'Empleado', activo: true },
      { id: 3, nombre: 'María González', email: 'maria.gonzalez@empresa.com', rol: 'Inspector', activo: true },
      { id: 4, nombre: 'Juan Rodríguez', email: 'juan.rodriguez@empresa.com', rol: 'Empleado', activo: false },
    ]);
  }, []);

  const abrirModal = (tipo, usuario = null) => {
    setModal(tipo);
    setUsuarioSeleccionado(usuario);
  };

  const cerrarModal = () => {
    setModal(null);
    setUsuarioSeleccionado(null);
  };

  // Actualiza el usuario en la lista después de editar
  const handleGuardarUsuario = (usuarioEditado) => {
    setUsuarios((prev) =>
      prev.map((u) => (u.id === usuarioEditado.id ? usuarioEditado : u))
    );
    cerrarModal();
  };

  // Agrega un nuevo usuario
  const handleCrearUsuario = (nuevoUsuario) => {
    setUsuarios((prev) => [
      ...prev,
      { ...nuevoUsuario, id: prev.length ? Math.max(...prev.map(u => u.id)) + 1 : 1 }
    ]);
    cerrarModal();
  };

  const usuariosFiltrados = usuarios.filter(u => {
    const coincideTexto = u.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
                          u.email.toLowerCase().includes(filtro.toLowerCase()) ||
                          u.rol.toLowerCase().includes(filtro.toLowerCase());
    const coincideRol = rolFiltro === '' || u.rol === rolFiltro;
    return coincideTexto && coincideRol;
  });

  return (
    <div className="p-4 bg-white rounded shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Usuarios</h2>
        <button className="btn btn-primary d-flex align-items-center px-3 py-2" style={{ fontSize: '1em', borderRadius: '0.5rem', minHeight: '40px', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }} onClick={() => abrirModal('nuevo')}>
          <i className="bi bi-plus-lg me-2"></i> Nuevo Usuario
        </button>
      </div>
      <div className="bg-light border p-3 mb-0" style={{ borderTopLeftRadius: '0.5rem', borderTopRightRadius: '0.5rem', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
        <div className="row g-2 align-items-center">
          <div className="col-md-9 col-12 mb-2 mb-md-0">
            <div className="position-relative">
              <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
              <input
                type="text"
                className="form-control ps-5"
                placeholder="Buscar por nombre, correo o rol"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-3 col-12 mb-2 mb-md-0">
            <select
              className="form-select"
              value={rolFiltro}
              onChange={(e) => setRolFiltro(e.target.value)}
            >
              <option value="">Todos los roles</option>
              <option value="Administrador">Administrador</option>
              <option value="Empleado">Empleado</option>
              <option value="Inspector">Inspector</option>
            </select>
          </div>
        </div>
      </div>
      <div style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, borderBottomLeftRadius: '0.5rem', borderBottomRightRadius: '0.5rem', overflow: 'hidden' }}>
        <TablaUsuarios usuarios={usuariosFiltrados} onEditar={(u) => abrirModal('editar', u)} />
      </div>
      {modal && (
        <ModalUsuario
          tipo={modal}
          usuario={usuarioSeleccionado}
          onClose={cerrarModal}
          onGuardar={modal === 'editar' ? handleGuardarUsuario : handleCrearUsuario}
        />
      )}
    </div>
  );
}
