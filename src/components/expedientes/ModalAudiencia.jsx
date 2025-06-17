import React, { useState, useEffect } from "react";

export default function ModalAudiencia({ show, modo, audiencia, onGuardar, onClose }) {
  const [form, setForm] = useState({
    fecha: "",
    hora: "",
    lugar: "",
    persona_llamada: { nombre: "", dni: "" },
    empresa_llamada: { nombre: "" }
  });

  useEffect(() => {
    if (modo === "editar" && audiencia) {
      setForm({
        fecha: audiencia.fecha || "",
        hora: audiencia.hora || "",
        lugar: audiencia.lugar || "",
        persona_llamada: audiencia.persona_llamada || { nombre: "", dni: "" },
        empresa_llamada: audiencia.empresa_llamada || { nombre: "" }
      });
    } else if (modo === "crear") {
      setForm({
        fecha: "",
        hora: "",
        lugar: "",
        persona_llamada: { nombre: "", dni: "" },
        empresa_llamada: { nombre: "" }
      });
    }
  }, [show, modo, audiencia]);

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("persona_")) {
      setForm(f => ({
        ...f,
        persona_llamada: { ...f.persona_llamada, [name.replace("persona_", "")]: value }
      }));
    } else if (name.startsWith("empresa_")) {
      setForm(f => ({
        ...f,
        empresa_llamada: { ...f.empresa_llamada, [name.replace("empresa_", "")]: value }
      }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuardar({ ...audiencia, ...form });
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
              <label className="form-label">Persona llamada</label>
              <div className="row g-2">
                <div className="col">
                  <input type="text" className="form-control" placeholder="Nombre" name="persona_nombre" value={form.persona_llamada.nombre} onChange={handleChange} required />
                </div>
                <div className="col">
                  <input type="text" className="form-control" placeholder="DNI" name="persona_dni" value={form.persona_llamada.dni} onChange={handleChange} required />
                </div>
              </div>
            </div>
            <div className="mb-2">
              <label className="form-label">Empresa llamada</label>
              <input type="text" className="form-control" placeholder="Nombre empresa" name="empresa_nombre" value={form.empresa_llamada.nombre} onChange={handleChange} required />
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
