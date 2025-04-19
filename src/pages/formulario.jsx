import { useState } from "react";
import { FormPersona } from "../components/FormPersona";
import { FormObjeto } from "../components/FormObjeto";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { data } from "react-router-dom";
import { denunciaSchema } from "../validations/denunciaSchma";

export const Formulario = () => {
  const [formularioEnviado, setFormularioEnviado] = useState(false);

  /* formState errors trae los errores (si es que hay), de cada fieldValue o input por así decirlo,  */
  const { register, handleSubmit, formState: {errors}, watch } = useForm({ 
    resolver: zodResolver(denunciaSchema) // Aquí le pasas el schema del cual se va a basar para resolver los errores (o eso entendí yo). Si pones el clic sobre resolver y denunciaSchema vas a ver
  });
  console.log(errors) // Esto es para ver los errores en consola. Si hay errores, se va a mostrar en consola los errores, si no hay, no aparece.

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container ">
            <div>
              {JSON.stringify(watch(), null, 2) /* A esto borralo cuando quieras, es para que se vean todos los campos nomas. */ }
            </div>
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
              <FormPersona register={register} errors={errors} tipoPersona={"Denunciante"} /> {/* Pasa el valor errors para el FormPersona así pilla de ahí los errores */}
            </div>
            <div className={"col-6"}>
              <FormPersona register={register} errors={errors} tipoPersona={"Denunciado"} />
            </div>
          </div>

          <div className="row">
            <div className={"col-6"}>
              <FormPersona register={register} errors={errors} tipoPersona={"Técnico"} />
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