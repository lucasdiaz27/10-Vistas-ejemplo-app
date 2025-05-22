import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import React from "react";
import { traerDenuncias } from "../apis/apiDenuncia";

export const Prueba = () => {
  const location = useLocation();
  const [vista, setVista] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [denuncias, setDenuncias] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const vistaParam = params.get("vista");
    setVista(vistaParam);

    // Traer denuncias del backend
    traerDenuncias()
      .then(data => setDenuncias(data))
      .catch(err => console.error(err));
  }, [location]);

  // Filtro de búsqueda
  const texto = busqueda.toLowerCase();
  const denunciasFiltradas = denuncias.filter((den) => {
    // Ajusta los campos según la estructura real de tu backend
    return (
      den.descripcion?.toLowerCase().includes(texto) ||
      den.personas?.[0]?.persona?.nombre?.toLowerCase().includes(texto) ||
      den.personas?.[0]?.persona?.apellido?.toLowerCase().includes(texto)
    );
  });

  return (
    <div className="container mt-4">
      <h2>Panel Interno</h2>

      { (
        <>
          <div className="mb-4">
            <h4>Buscar denuncias</h4>
            <input
              type="text"
              placeholder="Buscar..."
              className="form-control"
              style={{ width: "300px" }}
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          {/* Tabla de denuncias */}
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Descripción</th>
                <th>Denunciante</th>
                <th>Denunciado</th>
                <th>Motivo</th>
                <th>Objeto</th>
              </tr>
            </thead>
            <tbody>
              {denunciasFiltradas.map((den, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{den.descripcion}</td>
                  <td>
                    {den.personas?.find(p => p.rol === "denunciante")?.persona?.nombre}{" "}
                    {den.personas?.find(p => p.rol === "denunciante")?.persona?.apellido}
                  </td>
                  <td>
                    {den.personas?.find(p => p.rol === "denunciado")?.persona?.nombre}{" "}
                    {den.personas?.find(p => p.rol === "denunciado")?.persona?.apellido}
                  </td>
                  <td>{den.motivo?.join(", ")}</td>
                  <td>{den.objeto?.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* ...resto de tus vistas... */}
    </div>
  );
};