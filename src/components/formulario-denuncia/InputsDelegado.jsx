import React from "react";

export const InputsDelegado = ({register, index, errors}) => {
  return (
    <>
      <div className="mb-3">
        <label htmlFor="nombreDelegado" className="form-label">
          Nombre del delegado (opcional)
        </label>
        <input
          type="text"
          className="form-control"
          id="nombreDelegado"
          placeholder="Ingrese el nombre del delegado"
          {...register(`personas.${index}.nombreDelegado`)}
        />
        {errors?.personas?.[index]?.nombreDelegado?.message && (
          <p className="text-danger">
            {errors.personas[index].nombreDelegado.message}
          </p>
        )}
      </div>
      <div className="mb-3">
        <label htmlFor="apellidoDelegado" className="form-label">
          Apellido del delegado (opcional)
        </label>
        <input
          type="text"
          className="form-control"
          id="apellidoDelegado"
          placeholder="Ingrese el apellido del delegado"
          {...register(`personas.${index}.apellidoDelegado`)}
        />
        {errors?.personas?.[index]?.apellidoDelegado?.message && (
          <p className="text-danger">
            {errors.personas[index].apellidoDelegado.message}
          </p>
        )}
      </div>
      <div className="mb-3">
        <label htmlFor="dniDelegado" className="form-label">
          DNI del delegado (opcional)
        </label>
        <input
          type="text"
          className="form-control"
          id="dniDelegado"
          placeholder="Ingrese el DNI del delegado"
          {...register(`personas.${index}.dniDelegado`)}
        />
        {errors?.personas?.[index]?.dniDelegado?.message && (
          <p className="text-danger">
            {errors.personas[index].dniDelegado.message}
          </p>
        )}
      </div>
    </>
  );
};
