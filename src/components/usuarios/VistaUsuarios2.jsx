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
    <div className="container mx-auto p-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-4 mb-6">
        <input
          type="text"
          className="form-control w-100 w-md-50 mb-2 mb-md-0"
          placeholder="Buscar por nombre, correo o rol"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
        <select
          className="form-select w-100 w-md-25 mb-2 mb-md-0"
          value={rolFiltro}
          onChange={(e) => setRolFiltro(e.target.value)}
        >
          <option value="">Todos los roles</option>
          <option value="Administrador">Administrador</option>
          <option value="Empleado">Empleado</option>
          <option value="Inspector">Inspector</option>
        </select>
        <button
          className="btn btn-primary align-self-md-end"
          style={{ minWidth: 160 }}
          onClick={() => abrirModal('nuevo')}
        >
          Nuevo Usuario
        </button>
      </div>

      <TablaUsuarios usuarios={usuariosFiltrados} onEditar={(u) => abrirModal('editar', u)} />

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
