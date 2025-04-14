import React from "react";

export const FormPersona = ({tipoPersona, register}) => {
  return (
    <>
      <div className="mb-4">
        <div className="bg-white p-4 rounded shadow">
          <h5>Datos de la {tipoPersona}:</h5>

          <div className="mb-3">
            <label htmlFor="nombre" className="form-label">
              Nombre o razón social
            </label>
            <input
              type="text"
              className="form-control"
              id="nombre"
              placeholder="Ingrese el nombre o razón social"
              {...register(`${tipoPersona}.nombre`)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="dni" className="form-label">
              DNI/CUIT
            </label>
            <input
              type="number"
              className="form-control"
              id="dni"
              placeholder="Ingrese DNI o CUIT"
              {...register(`${tipoPersona}.dni`)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="domicilio" className="form-label">
              Domicilio
            </label>
            <input
              type="text"
              className="form-control"
              id="domicilio"
              placeholder="Ingrese el domicilio"
              {...register(`${tipoPersona}.domicilio`)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="localidad" className="form-label">
              Localidad
            </label>
            <input
              type="text"
              className="form-control"
              id="localidad"
              placeholder="Ingrese la localidad"
              {...register(`${tipoPersona}.localidad`)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="cp" className="form-label">
              Código postal
            </label>
            <input
              type="number"
              className="form-control"
              id="cp"
              placeholder="Ingrese el código postal"
              {...register(`${tipoPersona}.cp`)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="telefono" className="form-label">
              Teléfono
            </label>
            <input
              type="number"
              className="form-control"
              id="telefono"
              placeholder="Ingrese el teléfono"
              {...register(`${tipoPersona}.telefono`)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Ingrese el email"
              {...register(`${tipoPersona}.email`)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="fax" className="form-label">
              Fax
            </label>
            <input
              type="number"
              className="form-control"
              id="fax"
              placeholder="Ingrese el fax"
              {...register(`${tipoPersona}.fax`)}
            />
          </div>
        </div>
      </div>
    </>
  );
};
