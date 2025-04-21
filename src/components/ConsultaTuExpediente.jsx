export const ConsultaTuExpediente = () => {
  return (
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

        {/* Columna derecha: acordeón // Esto puede ser un componente a futuro*/}
        <div className="col-md-5">
          <div
            className="accordion p-3 border rounded"
            id="accordionExample"
            style={{ backgroundColor: "" }}
          >
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th className="text-center">Fecha</th>
                  <th className="text-center">Estado</th>
                  <th className="text-center">Descripción</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-center">01/01/2023</td>
                  <td className="text-center">En Espera</td>
                  <td className="text-center">
                    Tu denuncia está en espera de ser revisada.
                  </td>
                </tr>
                <tr>
                  <td className="text-center">15/01/2023</td>
                  <td className="text-center">En Proceso</td>
                  <td className="text-center">
                    Tu denuncia ha sido aprobada.
                  </td>
                </tr>
                <tr>
                  <td className="text-center">18/01/2023</td>
                  <td className="text-center">En Proceso</td>
                  <td className="text-center">
                    Tu denuncia está en Abogados
                  </td>
                </tr>
                <tr>
                  <td className="text-center">20/01/2023</td>
                  <td className="text-center">Finalizado</td>
                  <td className="text-center">
                    Tu expediente ha sido finalizado.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
