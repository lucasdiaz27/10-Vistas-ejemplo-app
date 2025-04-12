import React from "react";

export const FormObjeto = () => {
  return (
    <>
      <div className=" mb-4">
        <div className="bg-white p-4 rounded shadow">
          <h5>Objeto de reclamo</h5>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="cambioProducto"
            />
            <label className="form-check-label" htmlFor="cambioProducto">
              Cambio de producto
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="bonificacion"
            />
            <label className="form-check-label" htmlFor="bonificacion">
              Bonificacion
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="reparacion"
            />
            <label className="form-check-label" htmlFor="reparacion">
              Reparacion
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="devolucion"
            />
            <label className="form-check-label" htmlFor="devolucion">
              Devolucion de dinero
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="anulacion"
            />
            <label className="form-check-label" htmlFor="anulacion">
              Anulacion de contrato
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="otroObjeto"
            />
            <label className="form-check-label" htmlFor="otroObjeto">
              Otro
            </label>
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow mt-3">
          <h5>Motivo del reclamo</h5>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="problemaServicio"
            />
            <label className="form-check-label" htmlFor="problemaServicio">
              Problemas con el servicio
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="publicidad"
            />
            <label className="form-check-label" htmlFor="publicidad">
              Publicidad engañosa
            </label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" id="producto" />
            <label className="form-check-label" htmlFor="producto">
              Producto defectuoso
            </label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" id="garantia" />
            <label className="form-check-label" htmlFor="garantia">
              Problemas con la garantia
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="facturacion"
            />
            <label className="form-check-label" htmlFor="facturacion">
              Problemas con la facturacion
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="documentacion"
            />
            <label className="form-check-label" htmlFor="documentacion">
              Falta de documentacion
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="intereses"
            />
            <label className="form-check-label" htmlFor="intereses">
              Intereses abusivos
            </label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" id="contrato" />
            <label className="form-check-label" htmlFor="contrato">
              Incumplimiento de contrato
            </label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" id="trato" />
            <label className="form-check-label" htmlFor="trato">
              Trato indigno
            </label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" id="precios" />
            <label className="form-check-label" htmlFor="precios">
              Diferencia de precios
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="otroObjetos"
            />
            <label className="form-check-label" htmlFor="otroObjetos">
              otro
            </label>
          </div>
        </div>
      </div>
    </>
  );
};
