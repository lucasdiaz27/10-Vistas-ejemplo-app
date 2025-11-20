import React, { useEffect, useState } from "react";

export default function FormDenunciado({ labels = {}, defaultValues = {}, onChange, onSubmit }) {
  const [form, setForm] = useState({
    razonSocial: defaultValues.razonSocial || "",
    propietario: defaultValues.propietario || "",
    documento: defaultValues.documento || "",
    telefono: defaultValues.telefono || "",
    email: defaultValues.email || "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (onChange) onChange(form);
  }, [form, onChange]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const errs = {};
    if (!form.razonSocial || form.razonSocial.trim() === "") {
      errs.razonSocial = labels.requiredMessage || "Razón social o nombre de fantasía es obligatorio";
    }
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      onSubmit && onSubmit(form);
    }
  };

  return (
    <form className="form-denunciado" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="razonSocial">{labels.razonSocial || "Razón social o nombre de fantasía"} <span style={{color: 'red'}}>*</span></label>
        <input
          id="razonSocial"
          name="razonSocial"
          value={form.razonSocial}
          onChange={handleChange}
          required
        />
        {errors.razonSocial && <div className="error" style={{color: 'red'}}>{errors.razonSocial}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="propietario">{labels.propietario || "Propietario del establecimiento"}</label>
        <input
          id="propietario"
          name="propietario"
          value={form.propietario}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="documento">{labels.documento || "DNI/CUIT"}</label>
        <input
          id="documento"
          name="documento"
          value={form.documento}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="telefono">{labels.telefono || "Teléfono"}</label>
        <input
          id="telefono"
          name="telefono"
          value={form.telefono}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">{labels.email || "Email"}</label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
        />
      </div>

      <div className="form-actions">
        <button type="submit">Guardar</button>
      </div>
    </form>
  );
}
