import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function FormDenunciado({ labels = {}, defaultValues = {}, onChange, onSubmit }) {
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm({
    defaultValues: {
      razonSocial: defaultValues.razonSocial || "",
      propietario: defaultValues.propietario || "",
      documento: defaultValues.documento || "",
      telefono: defaultValues.telefono || "",
      email: defaultValues.email || "",
    },
  });

  // cuando cambian los defaultValues desde el padre, resetea el form
  useEffect(() => {
    reset({
      razonSocial: defaultValues.razonSocial || "",
      propietario: defaultValues.propietario || "",
      documento: defaultValues.documento || "",
      telefono: defaultValues.telefono || "",
      email: defaultValues.email || "",
    });
  }, [defaultValues, reset]);

  // suscribirse a cambios y propagar onChange si se provee
  useEffect(() => {
    const subscription = watch((value) => {
      onChange && onChange(value);
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  const onSubmitForm = (data) => {
    onSubmit && onSubmit(data);
  };

  return (
    <form className="form-denunciado" onSubmit={handleSubmit(onSubmitForm)} noValidate>
      <div className="form-group">
        <label htmlFor="razonSocial">{labels.razonSocial || "Razón social o nombre de fantasía"} <span style={{color: 'red'}}>*</span></label>
        <input
          id="razonSocial"
          {...register("razonSocial", { required: labels.requiredMessage || "Razón social o nombre de fantasía es obligatorio" })}
        />
        {errors.razonSocial && <div className="error" style={{color: 'red'}}>{errors.razonSocial.message}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="propietario">{labels.propietario || "Propietario del establecimiento"}</label>
        <input id="propietario" {...register("propietario")} />
      </div>

      <div className="form-group">
        <label htmlFor="documento">{labels.documento || "DNI/CUIT"}</label>
        <input id="documento" {...register("documento")} />
      </div>

      <div className="form-group">
        <label htmlFor="telefono">{labels.telefono || "Teléfono"}</label>
        <input id="telefono" {...register("telefono")} />
      </div>

      <div className="form-group">
        <label htmlFor="email">{labels.email || "Email"}</label>
        <input id="email" type="email" {...register("email", {
          validate: (v) => {
            if (!v) return true; // opcional
            // simple check de formato
            return /\S+@\S+\.\S+/.test(v) || "El email debe ser válido";
          },
        })} />
        {errors.email && <div className="error" style={{color: 'red'}}>{errors.email.message}</div>}
      </div>

      <div className="form-actions">
        <button type="submit">Guardar</button>
      </div>
    </form>
  );
}
