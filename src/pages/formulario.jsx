import { useState } from "react";
import { FormPersona } from "../components/formulario-denuncia/FormPersona";
import { FormObjeto } from "../components/formulario-denuncia/FormObjeto";
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
              
              <label className="form-label" htmlFor="">Descripción</label>
              <textarea
                className="form-control"
                {...register("descripcion")}
                rows={5}
                placeholder="Descripción de la denuncia"
                />
                <label for="formFileMultiple" className="form-label">Multiple files input example</label>
                <input className="form-control" type="file" id="formFileMultiple" multiple/>
            </div>
          </div>
          <div className="row">
            <div className="col-6">
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