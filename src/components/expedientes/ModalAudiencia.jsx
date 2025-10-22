import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function ModalAudiencia({ show, modo, audiencia, onGuardar, onClose, expedienteId, personasInvolucradas }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      fecha: "",
      hora: "",
      lugar: "",
      personasIds: [],
      expedienteId: expedienteId ?? null,
    }
  });

  useEffect(() => {
    if (modo === "editar" && audiencia) {
      reset({
        fecha: audiencia.fecha ? audiencia.fecha.split("T")[0] : "",
        hora: audiencia.hora || "",
        lugar: audiencia.lugar || "",
        // convertir a strings para que los checkboxes con value={p.id} coincidan
        personasIds: (audiencia.personasIds || []).map(id => String(id)),
        expedienteId: audiencia.expedienteId ?? expedienteId ?? null,
      });
    } else {
      reset({
        fecha: "",
        hora: "",
        lugar: "",
        personasIds: [],
        expedienteId: expedienteId ?? null,
      });
    }
  }, [show, modo, audiencia, expedienteId, reset]);

  if (!show) return null;

  const onSubmit = (data) => {
    // normalizar fecha+hora al formato que espera el backend
    const fechaISO = data.fecha && data.hora ? `${data.fecha}T${data.hora}` : data.fecha;
    const payload = {
      fecha: fechaISO,
      hora: data.hora,
      lugar: data.lugar,
      expedienteId: Number(data.expedienteId) || Number(expedienteId),
      personasIds: Array.isArray(data.personasIds) ? data.personasIds.map(Number) : [],
    };
    onGuardar(payload);
  };

  return (
    <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.2)" }}>
      <div className="modal-dialog">
        <form className="modal-content" onSubmit={handleSubmit(onSubmit)}>
          <div className="modal-header">
            <h5 className="modal-title">{modo === "crear" ? "Nueva Audiencia" : "Editar Audiencia"}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-2">
              <label className="form-label">Fecha</label>
              <input type="date" className="form-control" {...register("fecha", { required: "La fecha es obligatoria" })} />
              {errors.fecha && <p className="text-danger small mt-1">{errors.fecha.message}</p>}
            </div>
            <div className="mb-2">
              <label className="form-label">Hora</label>
              <input type="time" className="form-control" {...register("hora", { required: "La hora es obligatoria" })} />
              {errors.hora && <p className="text-danger small mt-1">{errors.hora.message}</p>}
            </div>
            <div className="mb-2">
              <label className="form-label">Lugar</label>
              <input type="text" className="form-control" {...register("lugar", { required: "El lugar es obligatorio" })} />
              {errors.lugar && <p className="text-danger small mt-1">{errors.lugar.message}</p>}
            </div>
            <div className="mb-2">
              <label className="form-label">Personas Involucradas</label>
              <div>
                {personasInvolucradas && personasInvolucradas.map(p => (
                  <div key={p.id} className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={String(p.id)}
                      {...register("personasIds", { validate: v => (v && v.length > 0) || "Seleccioná al menos una persona" })}
                      id={`persona-${p.id}`}
                    />
                    <label className="form-check-label" htmlFor={`persona-${p.id}`}>
                      {p.nombre} {p.apellido || ""}
                    </label>
                  </div>
                ))}
                {errors.personasIds && <p className="text-danger small mt-1">{errors.personasIds.message}</p>}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}