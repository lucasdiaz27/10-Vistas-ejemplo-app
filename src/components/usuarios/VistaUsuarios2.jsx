// VistaUsuarios.jsx

import { useEffect, useState } from 'react';
import TablaUsuarios from './TablaUsuarios';
import ModalUsuario from './modales/ModalUsuario';
import { crearUsuario, traerUsuarios, eliminarUsuario } from '../../apis/apiUsuarios';
import { traerRoles } from '../../apis/apiRoles';

export default function VistaUsuarios2() {
  const [usuarios, setUsuarios] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [rolFiltro, setRolFiltro] = useState('');
  const [modal, setModal] = useState(null); // 'nuevo' | 'editar'
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const token = localStorage.getItem('token');
        const data = await traerUsuarios(token);
        setUsuarios(data.map(u => ({
          id: u.id,
          nombre: u.nombreUsuario || u.nombre,
          email: u.email,
          rol: (u.rol && typeof u.rol === 'object' && u.rol.nombre) ? u.rol.nombre : (typeof u.rol === 'string' ? u.rol : ''),
        })));
      } catch (error) {
        alert('Error al traer usuarios: ' + error.message);
      }
    };
    const fetchRoles = async () => {
      try {
        const token = localStorage.getItem('token');
        const data = await traerRoles(token);
        setRoles(data);
      } catch (error) {
        alert('Error al traer roles: ' + error.message);
      }
    };
    fetchUsuarios();
    fetchRoles();
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
  const handleCrearUsuario = async (nuevoUsuario) => {
    try {
      const token = localStorage.getItem('token');
      const usuarioCreado = await crearUsuario({
        email: nuevoUsuario.email,
        password: nuevoUsuario.password,
        nombre: nuevoUsuario.nombre,
        rol: nuevoUsuario.rol,
      }, token);
      setUsuarios((prev) => [
        ...prev,
        {
          id: usuarioCreado.id || prev.length + 1,
          nombre: usuarioCreado.nombre || usuarioCreado.name || nuevoUsuario.nombre || '',
          email: usuarioCreado.email || nuevoUsuario.email || '',
          rol: usuarioCreado.rol || (usuarioCreado.rol && usuarioCreado.rol.nombre) || nuevoUsuario.rol || ''
        },
      ]);
      cerrarModal();
    } catch (error) {
      alert('Error al crear usuario: ' + error.message);
    }
  };

  // Elimina un usuario
  const handleEliminarUsuario = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este usuario?')) {
      try {
        const token = localStorage.getItem('token');
        console.log('Token para eliminar usuario:', token);
        await eliminarUsuario(id, token);
        setUsuarios(usuarios.filter((u) => u.id !== id));
      } catch (error) {
        if (error.response && error.response.status === 403) {
          alert('No tienes permisos para eliminar usuarios. Inicia sesión como ADMIN.');
        } else if (error.response && error.response.status === 401) {
          alert('Sesión expirada o no autorizada. Por favor, vuelve a iniciar sesión.');
        } else {
          alert('Error al eliminar usuario: ' + (error.response?.data?.message || error.message));
        }
      }
    }
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
              {roles && roles.length > 0 && roles.map((rol) => (
                <option key={rol.id || rol.nombre || rol} value={rol.nombre || rol}>
                  {rol.nombre || rol}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, borderBottomLeftRadius: '0.5rem', borderBottomRightRadius: '0.5rem', overflow: 'hidden' }}>
        <TablaUsuarios usuarios={usuariosFiltrados} onEditar={(u) => abrirModal('editar', u)} onEliminar={handleEliminarUsuario} />
      </div>
      {modal && (
        <ModalUsuario
          tipo={modal}
          usuario={usuarioSeleccionado}
          onClose={cerrarModal}
          onGuardar={modal === 'editar' ? handleGuardarUsuario : handleCrearUsuario}
          roles={roles}
        />
      )}
    </div>
  );
}
