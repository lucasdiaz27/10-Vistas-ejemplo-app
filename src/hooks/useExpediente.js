import { useState, useEffect } from "react";
import { traerExpedientePorId } from "../apis/expedientesApi";

export const useExpediente = (id) => {
  const [expediente, setExpediente] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Esta función trae el expediente
  const fetchExpediente = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = await traerExpedientePorId(id, token);
      setExpediente(data);
    } catch {
      setError("Error al cargar el expediente");
    } finally {
      setCargando(false);
    }
  };
  useEffect(() => {
    fetchExpediente();
  }, [id]);

  return { expediente, cargando, error, setExpediente };
}
