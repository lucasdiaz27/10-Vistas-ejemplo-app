// src/components/audiencias/TablaAudiencias.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAudiencias,
  crearAudienciaThunk,
  editarAudienciaThunk,
  eliminarAudienciaThunk,
  selectAudiencias,
} from "../../features/audiencias/audienciaSlice";
import ModalAudiencia from "./ModalAudiencia";

export default function TablaAudiencias({ expedienteId, token, personasInvolucradas }) {
  const dispatch = useDispatch();
  const audiencias = useSelector(selectAudiencias);
  const loading = useSelector((state) => state.audiencias.loading);
  const error = useSelector((state) => state.audiencias.error);

  const [showModal, setShowModal] = useState(false);
  const [modo, setModo] = useState("crear");
  const [audienciaSeleccionada, setAudienciaSeleccionada] = useState(null);

  useEffect(() => {
    if (expedienteId && token) {
      dispatch(fetchAudiencias({ expedienteId, token }));
    }
  }, [dispatch, expedienteId, token]);

  const handleNueva = () => {
    setModo("crear");
    setAudienciaSeleccionada(null);
    setShowModal(true);
  };

  const handleEditar = (audiencia) => {
    setModo("editar");
    setAudienciaSeleccionada(audiencia);
    setShowModal(true);
  };

  const handleEliminar = (id) => {
    if (window.confirm("¿Seguro que querés eliminar esta audiencia?")) {
      dispatch(eliminarAudienciaThunk({ id, token }));
    }
  };

  const handleGuardar = (data) => {
    if (modo === "crear") {
      dispatch(crearAudienciaThunk({ audiencia: data, token }));
    } else if (modo === "editar" && audienciaSeleccionada) {
      dispatch(editarAudienciaThunk({ id: audienciaSeleccionada.id, audiencia: data, token }));
    }
    setShowModal(false);
  };

  if (loading) return <p>Cargando audiencias...</p>;
  if (error) return <p className="text-danger">Error: {error}</p>;

  return (
    <div style={{ paddingBottom: "2rem" }}>
      <div className="d-flex justify-content-end mb-2">
        <button className="btn btn-primary btn-sm" onClick={handleNueva}>
          <i className="bi bi-plus-lg me-1"></i> Nueva Audiencia
        </button>
      </div>

      {audiencias && audiencias.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-sm table-bordered mb-0 align-middle" style={{ borderRadius: "0.5rem", overflow: "hidden" }}>
            <thead className="table-light">
              <tr>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Lugar</th>
                <th>Personas llamadas</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {audiencias.map((a) => (
                <tr key={a.id}>
                  <td>{a.fecha ? new Date(a.fecha).toLocaleDateString("es-AR") : "-"}</td>
                  <td>{a.hora || "-"}</td>
                  <td>{a.lugar || "-"}</td>
                  <td>
                    {Array.isArray(a.nombresPersonas) && a.nombresPersonas.length > 0 ? (
                      <ul className="mb-0 ps-3" style={{ listStyle: "disc" }}>
                        {a.nombresPersonas.map((nombre, i) => (
                          <li key={i}>{nombre}</li>
                        ))}
                      </ul>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="d-flex gap-2">
                    <button className="btn btn-outline-secondary btn-sm" onClick={() => handleEditar(a)}>
                      <i className="bi bi-pencil"></i> Editar
                    </button>
                    <button className="btn btn-outline-danger btn-sm" onClick={() => handleEliminar(a.id)}>
                      <i className="bi bi-trash"></i> Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-muted">No hay audiencias registradas para este expediente.</div>
      )}

      {showModal && (
        <ModalAudiencia
          show={showModal}
          modo={modo}
          audiencia={audienciaSeleccionada}
          onGuardar={handleGuardar}
          onClose={() => setShowModal(false)}
          expedienteId={expedienteId}
          personasInvolucradas={personasInvolucradas}
        />
      )}
    </div>
  );
}
