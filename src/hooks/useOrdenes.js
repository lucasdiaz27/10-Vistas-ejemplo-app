import { useEffect, useState } from "react";
import { agregarOrden, eliminarOrden, traerOrdenesPorExpediente } from "../apis/ordenesApi";
import { traerArchivoPDF } from "../apis/apiDocumento";
import { eliminarPase } from "../apis/pasesApi";

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
      //Recargar órdenes
      const nuevasOrdenes = await traerOrdenesPorExpediente(
        id,
        token
      );
      setOrdenes(nuevasOrdenes);
    } catch {
      alert("Error al agregar la orden");
    }
  };

  const descargarOrden = async (orden) => {
    try {
      const token = localStorage.getItem("token");
      const blob = await traerArchivoPDF(orden.id, token); // Ajusta el método si es necesario
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = orden.nroDocumento || `documento_${orden.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert("No se pudo descargar el documento");
    }
  };

  const borrarOrden = async (orden) => {
    try {
      // TODO: implementar eliminarOrden en ordenesApi.js
      if (orden.referencia == "Pase" ) {
        eliminarPase(orden.id_pase);
      } else if (orden.referencia == "Usuario Externo") {
        alert("No se puede eliminar un documento de usuario externo");
      }
      const token = localStorage.getItem("token");
      await eliminarOrden(orden.id, token);
      //Recargar órdenes
      const nuevasOrdenes = await traerOrdenesPorExpediente(
        id,
        token
      );
      setOrdenes(nuevasOrdenes);
    } catch (err) {
      alert("No se pudo eliminar el documento");
    }
  }

  return { ordenes, descargarOrden, subirOrden, borrarOrden, setOrdenes, fetchOrdenes };
};
