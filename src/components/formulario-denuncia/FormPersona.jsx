import React from "react";
import { InputsDelegado } from "./InputsDelegado";

export const FormPersona = ({ tipoPersona, register, errors, index }) => {
  // Agregamos la propiedad errors
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
              {...register(`personas.${index}.persona.nombre`)}
            />
            {
              errors?.personas?.[index]?.persona?.nombre?.message && (
                <p className="text-danger">
                  {errors.personas[index].persona.nombre.message}
                </p>
              ) // Aquí pregunta si hay un error sobre cada tipo de persona y en cada atributo. Esto lo debes poner en todos
            }
          </div>
          <div className="mb-3">
            <label htmlFor="apellido" className="form-label">
              Apellido
            </label>
            <input
              type="text"
              className="form-control"
              id="apellido"
              placeholder="Ingrese el apellido"
              {...register(`personas.${index}.persona.apellido`)}
            />
            {errors?.personas?.[index]?.persona?.apellido?.message && (
              <p className="text-danger">
                {errors.personas[index].persona.apellido.message}
              </p>
            )}
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
              {...register(`personas.${index}.persona.documento`)}
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e") {
                  e.preventDefault();
                }
              }}
            />
            {
              errors?.personas?.[index]?.persona?.documento?.message && (
                <p className="text-danger">
                  {errors.personas[index].persona.documento.message}
                </p>
              ) // Ves, aquí va lo mismo pero con dni
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
              {...register(`personas.${index}.persona.domicilio`)}
            />
            {errors?.personas?.[index]?.persona?.domicilio?.message && (
              <p className="text-danger">
                {errors.personas[index].persona.domicilio.message}
              </p>
            )}
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
              {...register(`personas.${index}.persona.localidad`)}
            />
            {errors?.personas?.[index]?.persona?.localidad?.message && (
              <p className="text-danger">
                {errors.personas[index].persona.localidad.message}
              </p>
            )}
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
              {...register(`personas.${index}.persona.cp`)}
            />
            {errors?.personas?.[index]?.persona?.cp?.message && (
              <p className="text-danger">
                {errors.personas[index].persona.cp.message}
              </p>
            )}
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
              {...register(`personas.${index}.persona.telefono`)}
            />
            {errors?.personas?.[index]?.persona?.telefono?.message && (
              <p className="text-danger">
                {errors.personas[index].persona.telefono.message}
              </p>
            )}
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
              {...register(`personas.${index}.persona.email`)}
            />
            {errors?.personas?.[index]?.persona?.email?.message && (
              <p className="text-danger">
                {errors.personas[index].persona.email.message}
              </p>
            )}
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
              {...register(`personas.${index}.persona.fax`)}
            />
            {errors?.personas?.[index]?.persona?.fax?.message && (
              <p className="text-danger">
                {errors.personas[index].persona.fax.message}
              </p>
            )}
          </div>
          {/* Delegado */}
          {tipoPersona == "Denunciante" ? <InputsDelegado register={register} index={index} errors={errors} /> : null}
          <input
            type="hidden"
            disabled
            value={tipoPersona
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")}
            {...register(`personas.${index}.rol`)}
          />
        </div>
      </div>
    </>
  );
};
