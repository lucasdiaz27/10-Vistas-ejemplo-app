import { useState } from "react";
import { TablaEstados } from "./denuncia-estado/TablaEstados";

export const ConsultaTuExpediente = () => {

  const [nroExp, setNroExp] = useState("");
  const [expedienteBuscado, setExpedienteBuscado] = useState("");

  const handleBuscarExp = () => {
    setExpedienteBuscado(nroExp); // Solo busca cuando se hace clic
  };

  return (
    <div className="container my-5">
      <h2 className="text-center fw-bold mb-4">CONSULTA TU EXPEDIENTE</h2>

      <div className="row justify-content-center">
        {/* Columna izquierda: búsqueda */}
        <div className="col-12 col-md-6 mb-4">
          <div className="d-flex mb-3">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Número de expediente"
              value={nroExp}
              onChange={e => setNroExp(e.target.value)}
            />
            <button className="btn btn-dark" onClick={handleBuscarExp}>BUSCAR</button>
          </div>
          <p className="fw-bold">
            <span className="me-2">✔</span>
            Ingresa el numero de expediente
          </p>
          <p className="fw-bold">
            <span className="me-2">✔</span>
            Se mostrara el historial del expediente
          </p>
        </div>

        {/* Columna derecha: acordeón // Esto puede ser un componente a futuro*/}
        <div className="col-12 col-md-6">
          <div
            className="accordion p-3 border rounded"
            id="accordionExample"
            style={{ backgroundColor: "" }}
          >
          <TablaEstados nroExp={expedienteBuscado} />
          </div>
        </div>
      </div>
    </div>
  );
};
