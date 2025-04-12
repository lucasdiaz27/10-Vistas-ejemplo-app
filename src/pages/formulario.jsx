import { useState } from "react";
import { FormPersona } from "../components/FormPersona";
import { FormObjeto } from "../components/FormObjeto";

export const Formulario = () => {
  const [formularioEnviado, setFormularioEnviado] = useState(false);

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container ">
        <h2 className="text-center mb-4">Formulario de Expedientes</h2>
        {formularioEnviado && (
          <div className="alert alert-success text-center" role="alert">
            Formulario enviado
          </div>
        )}
        <p className="text-center">
          Completar Formulario con los siguientes datos:
        </p>
        <div className="row">
          <div className="col-6">
            <FormPersona tipoPersona={"Denunciante"} />
          </div>
          <div className={"col-6"}>
            <FormPersona tipoPersona={"Denunciado"} />
          </div>
        </div>

        <div className="row">
          <div className={"col-6"}>
            <FormPersona tipoPersona={"Técnico"} />
          </div>
          <div className={"col-6"}>
            <FormObjeto />
          </div>
        </div>

        <div className="text-center ">
          <button
            type="button"
            className="btn btn-success"
            onClick={() => setFormularioEnviado(true)}
          >
            Enviar formulario
          </button>
        </div>
      </div>
    </div>
  );
};
