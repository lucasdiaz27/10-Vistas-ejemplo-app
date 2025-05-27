import React, { useEffect, useState } from "react";
import { traerDenuncias, eliminarDenuncia } from "../apis/apiDenuncia";

const ListaDenuncias = () => {
  const [denuncias, setDenuncias] = useState([]);

  const cargarDenuncias = async () => {
    try {
      const data = await traerDenuncias();
      setDenuncias(data);
    } catch (error) {
      console.error("Error al cargar denuncias:", error);
    }
  };

  useEffect(() => {
    cargarDenuncias();
  }, []);

  const handleEliminar = async (id) => {
    try {
      await eliminarDenuncia(id);
      setDenuncias(denuncias.filter((denuncia) => denuncia.id !== id));
    } catch (error) {
      console.error("Error al eliminar denuncia:", error);
    }
  };

  return (
    <div>
      <h2>Lista de Denuncias</h2>
      <ul>
        {denuncias.map((denuncia) => (
          <li key={denuncia.id}>
            {denuncia.nombre} - {denuncia.descripcion}
            <button onClick={() => handleEliminar(denuncia.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListaDenuncias;
