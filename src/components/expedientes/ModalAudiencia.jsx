import React, { useState, useEffect } from "react";

export default function ModalAudiencia({ show, modo, audiencia, onGuardar, onClose, expedienteId, personasInvolucradas }) {
  const [form, setForm] = useState({
    fecha: "",
    hora: "",
    lugar: "",
    personasIds: []
  });

  useEffect(() => {
    if (modo === "editar" && audiencia) {
      setForm({
        fecha: audiencia.fecha || "",
        hora: audiencia.hora || "",
        lugar: audiencia.lugar || "",
        personasIds: audiencia.personasIds || []
      });
    } else if (modo === "crear") {
      setForm({
        fecha: "",
        hora: "",
        lugar: "",
        personasIds: []
      });
    }
  }, [show, modo, audiencia]);

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "personasIds") {
      const id = Number(value); // Siempre id numérico
      setForm(f => ({
        ...f,
        personasIds: checked
          ? [...f.personasIds, id]
          : f.personasIds.filter(pid => pid !== id)
      }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let fechaLocalDateTime = form.fecha;
    if (form.fecha && form.hora) {
      fechaLocalDateTime = form.fecha + 'T' + form.hora;
    }
    const data = {
      fecha: fechaLocalDateTime,
      hora: form.hora,
      lugar: form.lugar,
      expedienteId: expedienteId, // id real del expediente
      personasIds: form.personasIds
    };
    onGuardar(data);
  };

  return (
    <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.2)" }}>
      <div className="modal-dialog">
        <form className="modal-content" onSubmit={handleSubmit}>
          <div className="modal-header">
            <h5 className="modal-title">
              {modo === "crear" ? "Nueva Audiencia" : "Editar Audiencia"}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-2">
              <label className="form-label">Fecha</label>
              <input type="date" className="form-control" name="fecha" value={form.fecha} onChange={handleChange} required />
            </div>
            <div className="mb-2">
              <label className="form-label">Hora</label>
              <input type="time" className="form-control" name="hora" value={form.hora} onChange={handleChange} required />
            </div>
            <div className="mb-2">
              <label className="form-label">Lugar</label>
              <input type="text" className="form-control" name="lugar" value={form.lugar} onChange={handleChange} required />
            </div>
            <div className="mb-2">
              <label className="form-label">Personas Involucradas</label>
              <div>
                {personasInvolucradas && personasInvolucradas.map((p) => (
                  <div key={p.id} className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="personasIds"
                      value={p.id}
                      id={`persona-${p.id}`}
                      checked={form.personasIds.includes(p.id)}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor={`persona-${p.id}`}>
                      {p.nombre} {p.apellido} (DNI: {p.documento})
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
