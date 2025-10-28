// src/components/usuarios/VistaUsuarios2.jsx

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Swal from 'sweetalert2'; // Importamos SweetAlert
import TablaUsuarios from './TablaUsuarios';
import ModalUsuario from './modales/ModalUsuario';
import { traerUsuarios, eliminarUsuario, traerUsuarioPorId, actualizarUsuario } from '../../apis/apiUsuarios';
import { registerUsuario } from '../../apis/apiAuth';
import { traerRoles } from '../../apis/apiRoles';

export default function VistaUsuarios2() {
  // Estados para manejar los datos, la UI y la lógica del componente
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [rolFiltro, setRolFiltro] = useState('');
  const [modal, setModal] = useState(null);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [roles, setRoles] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [elementosPorPagina, setElementosPorPagina] = useState(10);

  // Función reutilizable para cargar todos los datos necesarios desde la API
  const fetchDatos = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("No se encontró el token de autenticación.");
      
      const [usuariosData, rolesData] = await Promise.all([
        traerUsuarios(token),
        traerRoles(token)
      ]);

      // Normalizamos los datos de los usuarios para una estructura consistente en la tabla
      setUsuarios(usuariosData.map(u => ({
        ...u,
        nombre: u.name || u.nombreUsuario || u.nombre,
        rol: (u.rol && typeof u.rol === 'object' && u.rol.nombre) ? u.rol.nombre : (typeof u.rol === 'string' ? u.rol : ''),
      })));
      setRoles(rolesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }, []);

  // useEffect que se ejecuta solo una vez al montar el componente para la carga inicial
  useEffect(() => {
    fetchDatos();
  }, [fetchDatos]);

  // Función para abrir el modal, ya sea para crear o editar un usuario
  const abrirModal = async (tipo, usuario = null) => {
    if (tipo === 'editar' && usuario && usuario.id) {
        try {
            const token = localStorage.getItem('token');
            const datosCompletosUsuario = await traerUsuarioPorId(usuario.id, token);
            // Añadimos el ID que se pierde en el PerfilDTO del backend
            // CÓDIGO CORREGIDO
              setUsuarioSeleccionado({
              ...datosCompletosUsuario, 
              id: usuario.id,           
              rol: usuario.rol          
              });
            setModal('editar');
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error al cargar datos',
                text: error.response?.data || error.message,
            });
        }
    } else if (tipo === 'nuevo') {
        setUsuarioSeleccionado(null);
        setModal('nuevo');
    }
  };

  // Función para cerrar el modal
  const cerrarModal = () => {
    setModal(null);
    setUsuarioSeleccionado(null);
  };
  
  // Función para manejar la creación de un nuevo usuario con SweetAlert
  const handleCrearUsuario = async (nuevoUsuario) => {
    try {
      await registerUsuario(nuevoUsuario);
      cerrarModal();
      await fetchDatos(); 
      Swal.fire({
        icon: 'success',
        title: '¡Usuario Creado!',
        text: 'El nuevo usuario ha sido registrado exitosamente.',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al Crear',
        text: error.response?.data?.message || error.message,
      });
    }
  };

  // Función para manejar el guardado de cambios de un usuario editado con SweetAlert
  const handleGuardarUsuario = async (usuarioEditado) => {
    try {
      const token = localStorage.getItem('token');
      const idUsuario = usuarioSeleccionado.id;
      const { email, password, rol, ...datosParaActualizar } = usuarioEditado;
      await actualizarUsuario(idUsuario, datosParaActualizar, token);
      
      cerrarModal();
      await fetchDatos(); // Refrescamos los datos para ver los cambios
      
      Swal.fire({
        icon: 'success',
        title: '¡Cambios Guardados!',
        text: 'Los datos del usuario han sido actualizados.',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al Guardar',
        text: error.response?.data?.message || error.message,
      });
    }
  };

  // Función para manejar la eliminación de un usuario con SweetAlert
  const handleEliminarUsuario = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, ¡bórralo!',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('token');
          await eliminarUsuario(id, token);
          setUsuarios(prevUsuarios => prevUsuarios.filter((u) => u.id !== id));
          Swal.fire(
            '¡Borrado!',
            'El usuario ha sido eliminado.',
            'success'
          );
        } catch (error) {
          Swal.fire(
            'Error',
            'No se pudo eliminar el usuario: ' + (error.response?.data?.message || error.message),
            'error'
          );
        }
      }
    });
  };

  // Lógica de filtrado con useMemo para optimizar el rendimiento
  const usuariosFiltrados = useMemo(() => {
    if (!Array.isArray(usuarios)) return [];
    return usuarios.filter(u => {
      if (!u) return false;
      const nombreUsuario = (u.nombre || '').toLowerCase();
      const emailUsuario = (u.email || '').toLowerCase();
      const rolUsuario = u.rol || '';
      const filtroLower = filtro.toLowerCase();
      const coincideTexto = nombreUsuario.includes(filtroLower) || emailUsuario.includes(filtroLower);
      const coincideRol = rolFiltro === '' || rolUsuario === rolFiltro;
      return coincideTexto && coincideRol;
    });
  }, [usuarios, filtro, rolFiltro]);

  // Lógica de paginación
  const totalPaginas = Math.ceil((usuariosFiltrados?.length || 0) / elementosPorPagina);
  const indiceInicio = (paginaActual - 1) * elementosPorPagina;
  const indiceFin = indiceInicio + elementosPorPagina;
  const usuariosPaginados = usuariosFiltrados?.slice(indiceInicio, indiceFin) || [];
  const irAPagina = (pagina) => setPaginaActual(Math.max(1, Math.min(pagina, totalPaginas)));

  // Función para generar los números de página a mostrar
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

  // Renderizado condicional
  if (cargando) return <div className="p-4">Cargando...</div>;
  if (error) return <div className="p-4 alert alert-danger">Error: {error}</div>;

  // Renderizado principal del componente
  return (
    <div className="p-4 bg-white rounded shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Usuarios</h2>
        <button className="btn btn-primary d-flex align-items-center" onClick={() => abrirModal('nuevo')}>
          <i className="bi bi-plus-lg me-2"></i> Nuevo Usuario
        </button>
      </div>

      <div className="bg-light border p-3 mb-0">
        <div className="row g-2 align-items-center">
          <div className="col-md-9 col-12 mb-2 mb-md-0">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por nombre o correo"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
          </div>
          <div className="col-md-3 col-12">
            <select
              className="form-select"
              value={rolFiltro}
              onChange={(e) => setRolFiltro(e.target.value)}
            >
              <option value="">Todos los roles</option>
              {roles.map((rol) => (
                <option key={rol.id || rol} value={rol.nombre || rol}>
                  {rol.nombre || rol}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div>
        <TablaUsuarios
          usuarios={usuariosPaginados}
          onEditar={(usuario) => abrirModal('editar', usuario)}
          onEliminar={handleEliminarUsuario}
        />
        {usuariosFiltrados.length > 0 && (
          <div className="bg-light border-top p-3 d-flex justify-content-between align-items-center">
            <div className="text-muted">
              Mostrando {indiceInicio + 1} a {Math.min(indiceFin, usuariosFiltrados.length)} de {usuariosFiltrados.length}
            </div>
            
            {totalPaginas > 1 && (
              <nav>
                <ul className="pagination pagination-sm mb-0">
                  <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => irAPagina(paginaActual - 1)}>&laquo;</button>
                  </li>
                  {generarNumerosPagina().map(numero => (
                    <li key={numero} className={`page-item ${numero === paginaActual ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => irAPagina(numero)}>{numero}</button>
                    </li>
                  ))}
                  <li className={`page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => irAPagina(paginaActual + 1)}>&raquo;</button>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        )}
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

