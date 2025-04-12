import React, { useState } from 'react';

export const FormularioReclamo = () => {
  // Estados de los campos
  const [formData, setFormData] = useState({
    nombre: '',
    dniCuit: '',
    domicilio: '',
    localidad: '',
    codigoPostal: '',
    telefono: '',
    email: '',
    fax: '',
  });

  // Estados de errores
  const [errores, setErrores] = useState({});

  // Expresiones regulares para validación
  const regex = {
    dniCuit: /^\d+$/,
    codigoPostal: /^\d{4,5}$/,
    telefono: /^[\d\s()+-]+$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  };

  // Manejar cambios en los campos
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // Validar en tiempo real
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'nombre':
      case 'domicilio':
      case 'localidad':
        if (value.trim() === '') error = 'Este campo es obligatorio';
        break;
      case 'dniCuit':
        if (!regex.dniCuit.test(value)) error = 'Solo se permiten números';
        break;
      case 'codigoPostal':
        if (!regex.codigoPostal.test(value)) error = 'Debe tener 4 o 5 dígitos';
        break;
      case 'telefono':
        if (!regex.telefono.test(value)) error = 'Número inválido';
        break;
      case 'email':
        if (!regex.email.test(value)) error = 'Formato de email incorrecto';
        break;
      case 'fax':
        if (value && !regex.telefono.test(value)) error = 'Número inválido';
        break;
      default:
        break;
    }

    setErrores((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar todos los campos antes de enviar
    let valid = true;
    Object.entries(formData).forEach(([key, value]) => {
      validateField(key, value);
      if (errores[key]) valid = false;
    });

    if (valid) {
      alert('Formulario enviado correctamente');
      // es para enviar datos creo
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      {[
        { label: 'Nombre o razón social', name: 'nombre' },
        { label: 'DNI/CUIT', name: 'dniCuit' },
        { label: 'Domicilio', name: 'domicilio' },
        { label: 'Localidad', name: 'localidad' },
        { label: 'Código postal', name: 'codigoPostal' },
        { label: 'Teléfono', name: 'telefono' },
        { label: 'Email', name: 'email' },
        { label: 'Fax', name: 'fax' },
      ].map(({ label, name }) => (
        <div className="mb-3" key={name}>
          <label htmlFor={name} className="form-label">
            {label}
          </label>
          <input
            type="text"
            className={`form-control ${errores[name] ? 'is-invalid' : ''}`}
            id={name}
            name={name}
            value={formData[name]}
            onChange={handleChange}
          />
          {errores[name] && (
            <div className="text-danger small">{errores[name]}</div>
          )}
        </div>
      ))}

      <button type="submit" className="btn btn-primary">
        Enviar
      </button>
    </form>
  );
};

export default FormularioReclamo;
