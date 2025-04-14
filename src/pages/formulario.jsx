import { useState } from "react";
import { FormPersona } from "../components/FormPersona";
import { FormObjeto } from "../components/FormObjeto";
import { useForm } from "react-hook-form";
import { data } from "react-router-dom";

export const Formulario = () => {
  const [formularioEnviado, setFormularioEnviado] = useState(false);
  const { register, handleSubmit } = useForm();

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
        <form
          onSubmit={handleSubmit((data) => {
            console.log("Esta es la data:", data);
          })}
        >
          <div className="row">
            <div className="col-6">
              <FormPersona register={register} tipoPersona={"Denunciante"} />
            </div>
            <div className={"col-6"}>
              <FormPersona register={register} tipoPersona={"Denunciado"} />
            </div>
          </div>

          <div className="row">
            <div className={"col-6"}>
              <FormPersona register={register} tipoPersona={"Técnico"} />
            </div>
            <div className={"col-6"}>
              <FormObjeto register={register} />
            </div>
          </div>

          <div className="text-center ">
            <button
              type="submit"
              className="btn btn-success"
            >
              Enviar formulario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
