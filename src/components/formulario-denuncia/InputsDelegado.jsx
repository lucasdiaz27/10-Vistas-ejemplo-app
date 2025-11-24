import React from "react";

export const InputsDelegado = ({register, index, errors}) => {
  return (
    <>
      <div className="mb-3">
        <label htmlFor="nombreDelegado" className="form-label">
          Nombre del representante o persona autorizada (opcional)
        </label>
        <input
          type="text"
          className="form-control"
          id="nombreDelegado"
          placeholder="Ingrese el nombre del representante o persona autorizada"
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
          Apellido del representante o persona autorizada (opcional)
        </label>
        <input
          type="text"
          className="form-control"
          id="apellidoDelegado"
          placeholder="Ingrese el apellido del representante o persona autorizada"
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
          DNI del representante o persona autorizada (opcional)
        </label>
        <input
          type="text"
          className="form-control"
          id="dniDelegado"
          placeholder="Ingrese el DNI del representante o persona autorizada"
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
