import { useNavigate } from "react-router-dom";

export const Inicio = () => {
  const navigate = useNavigate();

  return (
    <div className="container-fluid px-0">
      
      <div
        className="text-white d-flex align-items-center justify-content-center"
        style={{
          backgroundImage: "url('/imagen para inicio.avif')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "300px",
        }}
      >
        <div className="text-center">
          <h1 className="fw-bold">Bienvenido a SITE</h1>
          <p>Sistema Interno de Traspasos y Expedientes</p>
          <button
            onClick={() => navigate("/formulario")}
            className="btn btn-primary mt-3"
          >
            Iniciar Formulario
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container my-5">
        <h2 className="text-center fw-bold mb-4">CONSULTA TU EXPEDIENTE</h2>

        <div className="row justify-content-center">
          {/* Columna izquierda: búsqueda */}
          <div className="col-md-5 mb-4">
            <div className="d-flex mb-3">
              <input
                type="text"
                className="form-control me-2"
                placeholder="Número de expediente"
              />
              <button className="btn btn-dark">BUSCAR</button>
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

          {/* Columna derecha: acordeón */}
          <div className="col-md-5">
            <div
              className="accordion p-3 border rounded"
              id="accordionExample"
              style={{ backgroundColor: "#d9a6a0" }}
            >
              {/* Ítem 1 */}
              <div className="accordion-item mb-2">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseOne"
                  >
                    TITLE??? QUE PORONGA ES ESTO
                  </button>
                </h2>
                <div
                  id="collapseOne"
                  className="accordion-collapse collapse"
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body">
                    HORRIBLE
                  </div>
                </div>
              </div>

              {/* Ítem 2 */}
              <div className="accordion-item mb-2">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseTwo"
                  >
                    GILES
                  </button>
                </h2>
                <div
                  id="collapseTwo"
                  className="accordion-collapse collapse"
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body">
                    QUE VA AQUI NO SE
                  </div>
                </div>
              </div>

              {/* Ítem 3 */}
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseThree"
                  >
                    AL PEDO ESTA SECCION
                  </button>
                </h2>
                <div
                  id="collapseThree"
                  className="accordion-collapse collapse"
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body">
                    KJJJJJ
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Inicio;
