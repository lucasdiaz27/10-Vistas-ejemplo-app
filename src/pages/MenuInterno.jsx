import React from "react";

const MenuInterno = () => {
  return (
    <div className="container mt-4">
      {/*Buscador*/}
      <div className="mb-4">
        <h2>Buscar solicitud</h2>
        <p>Ingresa número de solicitud para buscar formulario</p>
        <input
          type="text"
          className="form-control d-inline-block me-2"
          style={{ width: "200px" }}
        />
        <input
          type="text"
          className="form-control d-inline-block"
          style={{ width: "200px" }}
        />
      </div>

      {/*Tabla*/}
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>Nro Formulario</th>
              <th>Solicitante</th>
              <th>DNI</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Rea Gabriel Alejandro</td>
              <td>45853860</td>
              <td>05-11-2024</td>
              <td>PENDIENTE</td>
              <td>
                <button className="btn btn-secondary btn-sm me-2">Detalles</button>
                <button className="btn btn-success btn-sm me-1">✔</button>
                <button className="btn btn-danger btn-sm">✖</button>
              </td>
            </tr>
            <tr>
              <td>2</td>
              <td>Sosa Matias</td>
              <td>987654321</td>
              <td>05-11-2024</td>
              <td>APROBADO</td>
              <td>
                <button className="btn btn-secondary btn-sm me-2">Detalles</button>
                <button className="btn btn-success btn-sm me-1">✔</button>
                <button className="btn btn-danger btn-sm">✖</button>
              </td>
            </tr>
            <tr>
              <td>1</td>
              <td>Coro Maxi</td>
              <td>123456789</td>
              <td>05-11-2024</td>
              <td>RECHAZADO</td>
              <td>
                <button className="btn btn-secondary btn-sm me-2">Detalles</button>
                <button className="btn btn-success btn-sm me-1">✔</button>
                <button className="btn btn-danger btn-sm">✖</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MenuInterno;

  