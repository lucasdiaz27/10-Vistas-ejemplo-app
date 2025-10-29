import { useEffect, useState } from "react";
// 1. IMPORTAMOS LA NUEVA FUNCIÓN
import { 
  agregarOrden, 
  eliminarOrden, 
  traerOrdenesPorExpediente,
  actualizarOrden 
} from "../apis/ordenesApi";
import { traerArchivoPDF } from "../apis/apiDocumento";
import { eliminarPase } from "../apis/pasesApi";
import Swal from "sweetalert2"; // Importamos Swal para alertas más bonitas

export const useOrdenes = (id, setMensaje) => {
  const [ordenes, setOrdenes] = useState([]);

  const fetchOrdenes = async () => {
    const token = localStorage.getItem("token");
    try {
      const data = await traerOrdenesPorExpediente(id, token);
      setOrdenes(data);
    } catch {
      setOrdenes([]);
    }
  };
  useEffect(() => {
    fetchOrdenes();
  }, [id]);

  const subirOrden = async (ordenData) => {
    const token = localStorage.getItem("token");
    try {
      await agregarOrden(ordenData, token);
      setMensaje("Orden agregada correctamente");
      Swal.fire('¡Éxito!', 'Orden agregada correctamente.', 'success'); // Usamos Swal
      await fetchOrdenes(); // Recargamos
    } catch {
      Swal.fire('Error', 'Error al agregar la orden.', 'error'); // Usamos Swal
    }
  };

  // --- 2. NUEVA FUNCIÓN PARA MANEJAR LA ACTUALIZACIÓN ---
  const handleActualizarOrden = async (ordenId, data) => {
    const token = localStorage.getItem("token");
    try {
      await actualizarOrden(ordenId, data, token);
      Swal.fire('¡Actualizado!', 'La orden ha sido modificada.', 'success');
      await fetchOrdenes(); // Recargamos la lista
    } catch (error) {
      Swal.fire('Error', 'No se pudo actualizar la orden.', 'error');
    }
  };
  // --- FIN DE LA MODIFICACIÓN ---

  const descargarOrden = async (orden) => {
    try {
      const token = localStorage.getItem("token");
      const blob = await traerArchivoPDF(orden.id, token);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = orden.nroDocumento || `documento_${orden.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      Swal.fire('Error', 'No se pudo descargar el documento.', 'error'); // Usamos Swal
    }
  };

  const borrarOrden = async (orden) => {
    // 3. MEJORA: Usamos Swal para confirmar
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar la orden "${orden.nombreVisible || orden.id}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, ¡eliminar!',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) {
      return; // Si el usuario cancela, no hacemos nada
    }

    try {
      // TODO: implementar eliminarOrden en ordenesApi.js
      if (orden.referencia == "Pase" ) {
        eliminarPase(orden.id_pase);
      } else if (orden.referencia == "Usuario Externo") {
        Swal.fire('Acción denegada', 'No se puede eliminar un documento de usuario externo.', 'error'); // Usamos Swal
        return; // Detenemos la ejecución
      }
      const token = localStorage.getItem("token");
      await eliminarOrden(orden.id, token);
      Swal.fire('¡Eliminado!', 'La orden ha sido eliminada.', 'success'); // Usamos Swal
      await fetchOrdenes(); // Recargamos
    } catch (err) {
      Swal.fire('Error', 'No se pudo eliminar el documento.', 'error'); // Usamos Swal
    }
  }

  // 4. EXPORTAMOS LA NUEVA FUNCIÓN
  return { 
    ordenes, 
    descargarOrden, 
    subirOrden, 
    borrarOrden, 
    setOrdenes, 
    fetchOrdenes,
    actualizarOrden: handleActualizarOrden // La nueva función
  };
};

