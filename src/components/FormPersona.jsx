import React from "react";

export const FormPersona = ({tipoPersona}) => {
  return (
    <>
      <div className="mb-4">
        <div className="bg-white p-4 rounded shadow">
          <h5>Datos de la {tipoPersona}:</h5>

          <div className="mb-3">
            <label htmlFor="nombreEmpresa" className="form-label">
              Nombre o razón social
            </label>
            <input
              type="text"
              className="form-control"
              id="nombreEmpresa"
              placeholder="Ingrese el nombre o razón social"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="dniEmpresa" className="form-label">
              DNI/CUIT
            </label>
            <input
              type="number"
              className="form-control"
              id="dniEmpresa"
              placeholder="Ingrese DNI o CUIT"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="domicilioEmpresa" className="form-label">
              Domicilio
            </label>
            <input
              type="text"
              className="form-control"
              id="domicilioEmpresa"
              placeholder="Ingrese el domicilio"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="localidadEmpresa" className="form-label">
              Localidad
            </label>
            <input
              type="text"
              className="form-control"
              id="localidadEmpresa"
              placeholder="Ingrese la localidad"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="postalEmpresa" className="form-label">
              Código postal
            </label>
            <input
              type="number"
              className="form-control"
              id="postalEmpresa"
              placeholder="Ingrese el código postal"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="telefonoEmpresa" className="form-label">
              Teléfono
            </label>
            <input
              type="number"
              className="form-control"
              id="telefonoEmpresa"
              placeholder="Ingrese el teléfono"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="emailEmpresa" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="emailEmpresa"
              placeholder="Ingrese el email"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="faxEmpresa" className="form-label">
              Fax
            </label>
            <input
              type="number"
              className="form-control"
              id="faxEmpresa"
              placeholder="Ingrese el fax"
            />
          </div>
        </div>
      </div>
    </>
  );
};
