import { useEffect, useState } from "react";

import {
  agregarOrden,
  eliminarOrden,
  traerOrdenesPorExpediente,
  actualizarOrden,
  descargarZipOrdenes 
} from "../apis/ordenesApi";
import { traerArchivoPDF } from "../apis/apiDocumento";
import { eliminarPase } from "../apis/pasesApi";
import Swal from "sweetalert2"; 

export const useOrdenes = (id, setMensaje) => {
  const [ordenes, setOrdenes] = useState([]);

  const fetchOrdenes = async () => {
    const token = localStorage.getItem("token");
    try {
      const data = await traerOrdenesPorExpediente(id, token);

      const dataLimpia = data.map(orden => {
        if (orden.nombreVisible &&
          orden.nombreVisible.startsWith('"') &&
          orden.nombreVisible.endsWith('"')) {
          return {
            ...orden,
            nombreVisible: orden.nombreVisible.substring(1, orden.nombreVisible.length - 1)
          };
        }
        return orden;
      });

      setOrdenes(dataLimpia); 
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
      Swal.fire('¡Éxito!', 'Orden agregada correctamente.', 'success'); 
      await fetchOrdenes(); // Recargamos
    } catch {
      Swal.fire('Error', 'Error al agregar la orden.', 'error'); 
    }
  };

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
      Swal.fire('Error', 'No se pudo descargar el documento.', 'error'); 
    }
  };

  // NUEVA FUNCIÓN: DESCARGAR ZIP COMPLETO
  const descargarTodoZip = async () => {
    try {
      const token = localStorage.getItem("token");
      
      // Feedback visual de carga
      Swal.fire({
        title: 'Generando ZIP...',
        text: 'Comprimiendo documentos, por favor espere.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // 1. Llamamos a la API (esperamos el Blob)
      const blob = await descargarZipOrdenes(id, token);
      
      // 2. Creamos un link temporal para forzar la descarga
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Expediente_${id}_Documentos.zip`); // Nombre del archivo
      document.body.appendChild(link);
      link.click();
      
      // 3. Limpieza
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      // Cerramos el loading
      Swal.close();
      
      // Mensaje opcional de éxito (a veces la descarga es suficiente feedback)
      // Swal.fire('Descarga iniciada', 'El archivo ZIP se está descargando.', 'success');

    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'No se pudo descargar el ZIP. Verifique que existan documentos.', 'error');
    }
  };

  const borrarOrden = async (orden) => {
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
      if (orden.referencia == "Pase") {
        eliminarPase(orden.id_pase);
      } else if (orden.referencia == "Usuario Externo") {
        Swal.fire('Acción denegada', 'No se puede eliminar un documento de usuario externo.', 'error'); 
        return; 
      }
      const token = localStorage.getItem("token");
      await eliminarOrden(orden.id, token);
      Swal.fire('¡Eliminado!', 'La orden ha sido eliminada.', 'success'); 
      await fetchOrdenes(); // Recargamos
    } catch (err) {
      Swal.fire('Error', 'No se pudo eliminar el documento.', 'error'); 
    }
  }

  return {
    ordenes,
    descargarOrden,
    subirOrden,
    borrarOrden,
    setOrdenes,
    fetchOrdenes,
    actualizarOrden: handleActualizarOrden,
    descargarTodoZip 
  };
};