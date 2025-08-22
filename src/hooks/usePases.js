import { useEffect, useState } from "react";
import { crearPase, editarPase, eliminarPase, traerPasesPorExp } from "../apis/pasesApi";

export const usePases = (id, setMensaje, fetchOrdenes) => {
    const [pases, setPases] = useState([]);

    // Trae los pases (después se llama para el detalle del expediente y se actualiza)
    const fetchPases = async () => {
        const token = localStorage.getItem("token");
        try {
            const data = await traerPasesPorExp(id, token);
            setPases(data);
        } catch {
            setPases([]);
        }
    };

    useEffect(() => {
        fetchPases();
    }, [id]);

    const borrarPase = async (id) => {
        try {
        const token = localStorage.getItem("token");
          await eliminarPase(id, token);
          await fetchPases();
          setMensaje("Pase eliminado correctamente");
          // ACTUALIZA ORDENES DESPUÉS DE GUARDAR EL PASE
          await fetchOrdenes();
        } catch (err) {
          alert("Error al eliminar el pase");
        }
    }

    const guardarPase = async (paseData, modalPase) => {
        const token = localStorage.getItem("token");
        try {
          if (modalPase.modo === "crear") {
            await crearPase(paseData, token);
            setMensaje("Pase creado correctamente");
          } else {
            await editarPase(modalPase.pase.id, paseData, token);
            setMensaje("Pase editado correctamente");
          }
          await fetchPases();
          // ACTUALIZA ORDENES DESPUÉS DE GUARDAR EL PASE
          await fetchOrdenes();
        } catch (err) {
          alert("Error al guardar el pase");
        }
    }
    return { pases, guardarPase, borrarPase };
};
