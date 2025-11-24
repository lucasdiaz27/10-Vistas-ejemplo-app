import React from 'react'
import { InputsDelegado } from "./InputsDelegado";

export const FormDenunciante = ({ tipoPersona, register, errors, index, optional = false }) => {
  return (
    <>
        <>
          <div className="mb-4">
            <div className="bg-white p-4 rounded shadow">
              <h5>Datos del Denunciante</h5>
    
              <div className="mb-3">
                    <label htmlFor={`personas[${index}].persona.nombre`} className="form-label">
                      Nombre {!optional && <span style={{color:'red', marginLeft:'4px'}}>*</span>}
                    </label>
                <input
                  type="text"
                  className="form-control"
                  id={`personas[${index}].persona.nombre`}
                  placeholder="Ingrese el nombre o razón social"
                  {...register(`personas.${index}.persona.nombre`)}
                />
                {errors?.personas?.[index]?.persona?.nombre?.message && (
                  <p className="text-danger">
                    {errors.personas[index].persona.nombre.message}
                  </p>
                )}
              </div>
              <div className="mb-3">
                    <label htmlFor={`personas[${index}].persona.apellido`} className="form-label">
                      Apellido{!optional && <span style={{color:'red', marginLeft:'4px'}}>*</span>}
                    </label>
                <input
                  type="text"
                  className="form-control"
                  id={`personas[${index}].persona.apellido`}
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
                    <label htmlFor={`personas[${index}].persona.documento`} className="form-label">
                      DNI{!optional && <span style={{color:'red', marginLeft:'4px'}}>*</span>}
                    </label>
                <input
                  type="number"
                  className="form-control"
                  id={`personas[${index}].persona.documento`}
                  min={0}
                  placeholder="Ingrese DNI o CUIT"
                  {...register(`personas.${index}.persona.documento`)}
                  onKeyDown={(e) => {
                    if (e.key === "-" || e.key === "e") {
                      e.preventDefault();
                    }
                  }}
                />
                {errors?.personas?.[index]?.persona?.documento?.message && (
                  <p className="text-danger">
                    {errors.personas[index].persona.documento.message}
                  </p>
                )}
              </div>
              <div className="mb-3">
                    <label htmlFor={`personas[${index}].persona.domicilio`} className="form-label">
                      Domicilio{!optional && <span style={{color:'red', marginLeft:'4px'}}>*</span>}
                    </label>
                <input
                  type="text"
                  className="form-control"
                  id={`personas[${index}].persona.domicilio`}
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
                    <label htmlFor={`personas[${index}].persona.localidad`} className="form-label">
                      Localidad{!optional && <span style={{color:'red', marginLeft:'4px'}}>*</span>}
                    </label>
                <input
                  type="text"
                  className="form-control"
                  id={`personas[${index}].persona.localidad`}
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
                    <label htmlFor={`personas[${index}].persona.cp`} className="form-label">
                      Código postal{!optional && <span style={{color:'red', marginLeft:'4px'}}>*</span>}
                    </label>
                <input
                  type="text"
                  className="form-control"
                  id={`personas[${index}].persona.cp`}
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
                    <label htmlFor={`personas[${index}].persona.telefono`} className="form-label">
                      Teléfono{!optional && <span style={{color:'red', marginLeft:'4px'}}>*</span>}
                    </label>
                <input
                  type="number"
                  className="form-control"
                  id={`personas[${index}].persona.telefono`}
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
                <label htmlFor={`personas[${index}].persona.email`} className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id={`personas[${index}].persona.email`}
                  placeholder="Ingrese el email"
                  {...register(`personas.${index}.persona.email`)}
                />
                {errors?.personas?.[index]?.persona?.email?.message && (
                  <p className="text-danger">
                    {errors.personas[index].persona.email.message}
                  </p>
                )}
              </div>
    
              {/* Delegado */}
              {tipoPersona === "Denunciante" ? <InputsDelegado register={register} index={index} errors={errors} /> : null}
              <input
                type="hidden"
                value={tipoPersona
                  .toLowerCase()
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")}
                {...register(`personas.${index}.rol`)}
              />
            </div>
          </div>
        </>
    </>
  )
}
