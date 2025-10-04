// VistaUsuarios.jsx

import { useEffect, useState, useMemo } from 'react';
import TablaUsuarios from './TablaUsuarios';
import ModalUsuario from './modales/ModalUsuario';
// --- CAMBIO 1: Quitamos la vieja función 'crearUsuario' de aquí ---
import { traerUsuarios, eliminarUsuario } from '../../apis/apiUsuarios'; 
// --- CAMBIO 2: ¡Importamos la función correcta desde tu apiAuth.js! ---
import { registerUsuario } from '../../apis/apiAuth'; 
import { traerRoles } from '../../apis/apiRoles';

export default function VistaUsuarios2() {
  const [usuarios, setUsuarios] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [rolFiltro, setRolFiltro] = useState('');
  const [modal, setModal] = useState(null);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [roles, setRoles] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [elementosPorPagina, setElementosPorPagina] = useState(10);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const token = localStorage.getItem('token');
        const data = await traerUsuarios(token);
        setUsuarios(data.map(u => ({
          ...u,
          id: u.id,
          nombre: u.name || u.nombreUsuario || u.nombre,
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

  const handleGuardarUsuario = (usuarioEditado) => {
    // TODO: Implementar la llamada a la API para actualizar (PUT) el usuario.
    console.log("Guardando usuario editado:", usuarioEditado);
    setUsuarios((prev) =>
      prev.map((u) => (u.id === usuarioEditado.id ? { ...u, ...usuarioEditado, nombre: usuarioEditado.name } : u))
    );
    cerrarModal();
  };
  
  const handleCrearUsuario = async (nuevoUsuario) => {
    try {
      // 'nuevoUsuario' ya tiene el formato plano correcto desde el modal.
      // Lo pasamos COMPLETO a nuestra nueva función de registro.
      const usuarioCreado = await registerUsuario(nuevoUsuario);

      // Actualizamos la tabla con la respuesta del backend
      setUsuarios((prev) => [
        ...prev,
        {
          ...usuarioCreado.data,
          id: usuarioCreado.data.id || prev.length + 1,
          nombre: usuarioCreado.data.name || nuevoUsuario.name,
          rol: usuarioCreado.data.rol?.nombre || nuevoUsuario.rol,
        },
      ]);
      cerrarModal();
    } catch (error) {
      alert('Error al crear usuario: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEliminarUsuario = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este usuario?')) {
      try {
        const token = localStorage.getItem('token');
        await eliminarUsuario(id, token);
        setUsuarios(usuarios.filter((u) => u.id !== id));
      } catch (error) {
        alert('Error al eliminar usuario: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter(u => {
      const uRol = (typeof u.rol === 'object' && u.rol !== null) ? u.rol.nombre : u.rol;
      const coincideTexto = u.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
                            u.email.toLowerCase().includes(filtro.toLowerCase()) ||
                            (uRol && uRol.toLowerCase().includes(filtro.toLowerCase()));
      const coincideRol = rolFiltro === '' || uRol === rolFiltro;
      return coincideTexto && coincideRol;
    });
  }, [usuarios, filtro, rolFiltro]);
  
  const totalPaginas = Math.ceil(usuariosFiltrados.length / elementosPorPagina);
  const indiceInicio = (paginaActual - 1) * elementosPorPagina;
  const indiceFin = indiceInicio + elementosPorPagina;
  const usuariosPaginados = usuariosFiltrados.slice(indiceInicio, indiceFin);

  const irAPagina = (pagina) => setPaginaActual(Math.max(1, Math.min(pagina, totalPaginas)));
  const cambiarElementosPorPagina = (cantidad) => {
    setElementosPorPagina(cantidad);
    setPaginaActual(1);
  };

  const generarNumerosPagina = () => {
    const numeros = [];
    const rango = 2;
    let inicio = Math.max(1, paginaActual - rango);
    let fin = Math.min(totalPaginas, paginaActual + rango);
    if (paginaActual <= rango) fin = Math.min(totalPaginas, 2 * rango + 1);
    if (paginaActual > totalPaginas - rango) inicio = Math.max(1, totalPaginas - 2 * rango);
    for (let i = inicio; i <= fin; i++) numeros.push(i);
    return numeros;
  };

  return (
    <div className="p-4 bg-white rounded shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Usuarios</h2>
        <button className="btn btn-primary d-flex align-items-center px-3 py-2" style={{ fontSize: '1em', borderRadius: '0.5rem', minHeight: '40px' }} onClick={() => abrirModal('nuevo')}>
          <i className="bi bi-plus-lg me-2"></i> Nuevo Usuario
        </button>
      </div>
      <div className="bg-light border p-3 mb-0" style={{ borderTopLeftRadius: '0.5rem', borderTopRightRadius: '0.5rem', borderBottom: 0 }}>
        <div className="row g-2 align-items-center">
          <div className="col-md-6 col-12 mb-2 mb-md-0">
            <div className="position-relative">
              <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
              <input type="text" className="form-control ps-5" placeholder="Buscar por nombre, correo o rol" value={filtro} onChange={(e) => setFiltro(e.target.value)} />
            </div>
          </div>
          <div className="col-md-3 col-12 mb-2 mb-md-0">
            <select className="form-select" value={rolFiltro} onChange={(e) => setRolFiltro(e.target.value)}>
              <option value="">Todos los roles</option>
              {roles.map((rol) => ( <option key={rol.id || rol} value={rol.nombre || rol}>{rol.nombre || rol}</option> ))}
            </select>
          </div>
          <div className="col-md-3 col-12">
            <select className="form-select" value={elementosPorPagina} onChange={e => cambiarElementosPorPagina(Number(e.target.value))}>
              <option value={10}>10 por página</option>
              <option value={25}>25 por página</option>
              <option value={50}>50 por página</option>
            </select>
          </div>
        </div>
      </div>
      <div style={{ overflow: 'hidden', borderBottomLeftRadius: '0.5rem', borderBottomRightRadius: '0.5rem' }}>
        <TablaUsuarios usuarios={usuariosPaginados} onEditar={(u) => abrirModal('editar', u)} onEliminar={handleEliminarUsuario} />
        {usuariosFiltrados.length > 0 && (
          <div className="bg-light border-top p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div className="text-muted">Mostrando {indiceInicio + 1} a {Math.min(indiceFin, usuariosFiltrados.length)} de {usuariosFiltrados.length} usuarios</div>
              {totalPaginas > 1 && (
                <nav>
                  <ul className="pagination pagination-sm mb-0">
                    <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}><button className="page-link" onClick={() => irAPagina(1)} disabled={paginaActual === 1}><i className="bi bi-chevron-double-left"></i></button></li>
                    <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}><button className="page-link" onClick={() => irAPagina(paginaActual - 1)} disabled={paginaActual === 1}><i className="bi bi-chevron-left"></i></button></li>
                    {generarNumerosPagina().map(numero => (<li key={numero} className={`page-item ${numero === paginaActual ? 'active' : ''}`}><button className="page-link" onClick={() => irAPagina(numero)}>{numero}</button></li>))}
                    <li className={`page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`}><button className="page-link" onClick={() => irAPagina(paginaActual + 1)} disabled={paginaActual === totalPaginas}><i className="bi bi-chevron-right"></i></button></li>
                    <li className={`page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`}><button className="page-link" onClick={() => irAPagina(totalPaginas)} disabled={paginaActual === totalPaginas}><i className="bi bi-chevron-double-right"></i></button></li>
                  </ul>
                </nav>
              )}
            </div>
          </div>
        )}
      </div>
      {modal && (
        <ModalUsuario tipo={modal} usuario={usuarioSeleccionado} onClose={cerrarModal} onGuardar={modal === 'editar' ? handleGuardarUsuario : handleCrearUsuario} roles={roles} />
      )}
    </div>
  );
}

