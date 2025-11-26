import React from "react";

export default function FormDenunciado({ labels = {}, register, errors, index = 1, tipoPersona = "Denunciado", optional = false }) {


  const name = (field) => `personas.${index}.persona.${field}`;

  return (
    <div className="mb-4">
      <div className="bg-white p-4 rounded shadow">
        <h5>Datos del Denunciado</h5>

        <div className="mb-3">
          <label htmlFor={name("razonSocial")} className="form-label">
            {labels.razonSocial || "Razón social o nombre de fantasía"} {!optional && <span style={{color:'red', marginLeft:'4px'}}>*</span>}
          </label>
          <input
            type="text"
            className="form-control"
            id={name("razonSocial")}
            placeholder={labels.razonSocialPlaceholder || "Ingrese razón social o nombre de fantasía"}
            {...register(name("razonSocial"))}
          />
          {errors?.personas?.[index]?.persona?.razonSocial?.message && (
            <p className="text-danger">{errors.personas[index].persona.razonSocial.message}</p>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor={name("propietario")} className="form-label">{labels.propietario || "Propietario del establecimiento"}</label>
          <input
            type="text"
            className="form-control"
            id={name("propietario")}
            placeholder={labels.propietarioPlaceholder || "Ingrese el propietario"}
            {...register(name("propietario"))}
          />
          {errors?.personas?.[index]?.persona?.propietario?.message && (
            <p className="text-danger">{errors.personas[index].persona.propietario.message}</p>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor={name("documento")} className="form-label">{labels.documento || "DNI/CUIT"}</label>
          <input
            type="text"
            className="form-control"
            id={name("documento")}
            placeholder={labels.documentoPlaceholder || "Ingrese DNI o CUIT"}
            {...register(name("documento"))}
          />
          {errors?.personas?.[index]?.persona?.documento?.message && (
            <p className="text-danger">{errors.personas[index].persona.documento.message}</p>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor={name("telefono")} className="form-label">{labels.telefono || "Teléfono"}</label>
          <input
            type="text"
            className="form-control"
            id={name("telefono")}
            placeholder={labels.telefonoPlaceholder || "Ingrese el teléfono"}
            {...register(name("telefono"))}
          />
          {errors?.personas?.[index]?.persona?.telefono?.message && (
            <p className="text-danger">{errors.personas[index].persona.telefono.message}</p>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor={name("email")} className="form-label">{labels.email || "Email"}</label>
          <input
            type="email"
            className="form-control"
            id={name("email")}
            placeholder={labels.emailPlaceholder || "Ingrese el email"}
            {...register(name("email"))}
          />
          {errors?.personas?.[index]?.persona?.email?.message && (
            <p className="text-danger">{errors.personas[index].persona.email.message}</p>
          )}
        </div>

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
  );
}
