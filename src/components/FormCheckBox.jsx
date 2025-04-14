import React from "react";

export const FormCheckBox = ({ register }) => {
  const objeto = [
    "Cambio de producto",
    "Bonificación",
    "Reparación",
    "Devolución de dinero",
    "Anulación de Contrato",
  ];
  const motivo = [
    "Problemas con el servicio",
    "Publicidad engañosa",
    "Producto defectuoso",
    "Problemas con la garantia",
    "Problemas con la facturacion",
    "Falta de documentación",
    "Intereses abusivos",
    "Incumplimiento de contrato",
    "Trato indigno",
    "Diferencia de precios",
    "Otros",
  ];

  return (
    <>
      <div className="bg-white rounded shadow p-2 mb-4">
        <h5>Objeto del reclamo</h5>
        {objeto.map((element, index) => (
          <div className="form-check" key={index}>
            <input
              className="form-check-input"
              type="checkbox"
              id={element}
              {...register("objeto")}
              value={element}
            />
            <label className="form-check-label" htmlFor={element}>
              {element}
            </label>
          </div>
        ))}
      </div>

      <div className="bg-white rounded shadow p-2">
        <h5>Motivo del reclamo</h5>
        {motivo.map((element, index) => (
          <div className="form-check" key={index}>
            <input
              className="form-check-input"
              type="checkbox"
              id={element}
              {...register("motivo")}
              value={element}
            />
            <label className="form-check-label" htmlFor={element}>
              {element}
            </label>
          </div>
        ))}
      </div>

    </>
  );
};
