import { useState, useEffect, useCallback } from 'react';
import { traerUsuarios, traerUsuarioPorId, actualizarUsuario, eliminarUsuario } from '../apis/apiUsuarios';
import { registerUsuario } from '../apis/apiAuth'; // Asegúrate que la ruta sea correcta
import { traerRoles } from '../apis/apiRoles'; // Asegúrate que la ruta sea correcta

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState({ tipo: null, usuario: null });
  const [roles, setRoles] = useState([]);

  const fetchUsuarios = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);
      const token = localStorage.getItem('token');
      const data = await traerUsuarios(token);
      setUsuarios(data.map(u => ({
        ...u,
        nombre: u.name || u.nombreUsuario || u.nombre,
        rol: (u.rol && typeof u.rol === 'object' && u.rol.nombre) ? u.rol.nombre : (typeof u.rol === 'string' ? u.rol : ''),
      })));
    } catch (err) {
      setError("Error al cargar usuarios");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    fetchUsuarios();
    const fetchRoles = async () => {
      try {
        const token = localStorage.getItem('token');
        const data = await traerRoles(token);
        setRoles(data);
      } catch (error) {
        console.error('Error al traer roles:', error);
      }
    };
    fetchRoles();
  }, [fetchUsuarios]);

  const abrirModal = async (tipo, usuario = null) => {
    if (tipo === 'editar' && usuario && usuario.id) {
      try {
        const token = localStorage.getItem('token');
        const datosCompletosUsuario = await traerUsuarioPorId(usuario.id, token);
        setModal({ tipo: 'editar', usuario: datosCompletosUsuario });
      } catch (err) {
        alert("Error al cargar los datos del usuario para editar.");
      }
    } else {
      setModal({ tipo: 'nuevo', usuario: null });
    }
  };

  const cerrarModal = () => setModal({ tipo: null, usuario: null });

  const handleCrearUsuario = async (nuevoUsuario) => {
    try {
      const usuarioCreadoResponse = await registerUsuario(nuevoUsuario);
      // Actualización instantánea con la respuesta de la API
      setUsuarios(prev => [...prev, usuarioCreadoResponse.data]);
      cerrarModal();
    } catch (err) {
      alert('Error al crear usuario: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleActualizarUsuario = async (usuarioEditado) => {
    try {
      const token = localStorage.getItem('token');
      const idUsuario = modal.usuario.id;
      await actualizarUsuario(idUsuario, usuarioEditado, token);
      await fetchUsuarios(); // Recargamos la lista para ver los cambios
      cerrarModal();
    } catch (err) {
      alert("Error al guardar los cambios: " + (err.response?.data?.message || err.message));
    }
  };

  const handleEliminarUsuario = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este usuario?')) {
      try {
        const token = localStorage.getItem('token');
        await eliminarUsuario(id, token);
        // Actualización instantánea en el frontend
        setUsuarios(prev => prev.filter(u => u.id !== id));
      } catch (err) {
        alert('Error al eliminar usuario: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  return {
    usuarios,
    cargando,
    error,
    modal,
    roles,
    abrirModal,
    cerrarModal,
    handleCrearUsuario,
    handleActualizarUsuario,
    handleEliminarUsuario,
  };
};