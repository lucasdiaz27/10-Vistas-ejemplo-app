import React from "react";

export const FormPersona = ({tipoPersona, register, errors}) => { // Agregamos la propiedad errors
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
            {
                errors?.[tipoPersona]?.nombre?.message && <p className="text-danger">{errors[tipoPersona].nombre.message}</p> // Aquí pregunta si hay un error sobre cada tipo de persona y en cada atributo. Esto lo debes poner en todos
            }
          </div>
          <div className="mb-3">
            <label htmlFor="dni" className="form-label">
              DNI/CUIT
            </label>
            <input
              type="number"
              className="form-control"
              id="dni"
              min={0}
              placeholder="Ingrese DNI o CUIT"
              {...register(`${tipoPersona}.dni`)}
              onKeyDown={(e) => {
                if(e.key === '-' || e.key === 'e') {
                  e.preventDefault();
                }
              }}
            />
            {
                errors?.[tipoPersona]?.dni?.message && <p className="text-danger">{errors[tipoPersona].dni.message}</p> // Ves, aquí va lo mismo pero con dni
            }
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
            {
                errors?.[tipoPersona]?.domicilio?.message && <p className="text-danger">{errors[tipoPersona].domicilio.message}</p> 
            }
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
            {
                errors?.[tipoPersona]?.localidad?.message && <p className="text-danger">{errors[tipoPersona].localidad.message}</p> 
            }
          </div>
          <div className="mb-3">
            <label htmlFor="cp" className="form-label">
              Código postal
            </label>
            <input
              type="text"
              className="form-control"
              id="cp"
              min={0}
              placeholder="Ingrese el código postal"
              {...register(`${tipoPersona}.cp`)}
            />
            {
                errors?.[tipoPersona]?.cp?.message && <p className="text-danger">{errors[tipoPersona].cp.message}</p> 
            }
          </div>
          <div className="mb-3">
            <label htmlFor="telefono" className="form-label">
              Teléfono
            </label>
            <input
              type="number"
              className="form-control"
              id="telefono"
              min={0}
              placeholder="Ingrese el teléfono"
              {...register(`${tipoPersona}.telefono`)}
            />
            {
                errors?.[tipoPersona]?.telefono?.message && <p className="text-danger">{errors[tipoPersona].telefono.message}</p> 
            }
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
            {
                errors?.[tipoPersona]?.email?.message && <p className="text-danger">{errors[tipoPersona].email.message}</p> 
            }
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
              min={0}
              {...register(`${tipoPersona}.fax`)}
            />
            {
                errors?.[tipoPersona]?.fax?.message && <p className="text-danger">{errors[tipoPersona].fax.message}</p> 
            }
          </div>
        </div>
      </div>
    </>
  );
};
