import { useState } from "react";
import { FormPersona } from "../components/formulario-denuncia/FormPersona";
import { FormObjeto } from "../components/formulario-denuncia/FormObjeto";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { data } from "react-router-dom";
import { denunciaSchema } from "../validations/denunciaSchma";

export const Formulario = () => {
  const [formularioEnviado, setFormularioEnviado] = useState(false);

  /* formState errors trae los errores (si es que hay), de cada fieldValue o input por así decirlo,  */
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(denunciaSchema), // Aquí le pasas el schema del cual se va a basar para resolver los errores (o eso entendí yo). Si pones el clic sobre resolver y denunciaSchema vas a ver
  });
  console.log(errors); // Esto es para ver los errores en consola. Si hay errores, se va a mostrar en consola los errores, si no hay, no aparece.

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container ">
        <div>
          {
             /* A esto borralo cuando quieras, es para que se vean todos los campos nomas. */
          }
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
            const roles = ["denunciante", "denunciado", "técnico"];
            const personas = roles.map((rol) => {
              const p = data[rol.charAt(0).toUpperCase() + rol.slice(1)];
              return {
                persona: {
                  nombre: p?.nombre || "",
                  apellido: p?.apellido || "",
                  email: p?.email || "",
                  telefono: p?.telefono || "",
                  cp: p?.cp || "",
                  localidad: p?.localidad || "",
                  documento: p?.dni || "",
                  tipoDocumento: "DNI",
                  domicilio: p?.domicilio || "",
                  wpp: null,
                  fax: p?.fax || "",
                },
                rol,
                nombre_delegado: p?.nombre_delegado || "",
                apellido_delegado: p?.apellido_delegado || "",
                dni_delegado: p?.dni_delegado || "",
              };
            });

            const jsonFinal = {
              descripcion: data.descripcion,
              objeto: data.objeto || [],
              motivo: data.motivo || [],
              personas,
            };

            console.log("JSON a enviar:", jsonFinal);
            // Aquí puedes hacer el fetch/axios para enviar el jsonFinal
          })}
        >
          <div className="row">
            <div className="col-6">
              <FormPersona
                register={register}
                errors={errors}
                tipoPersona={"Denunciante"}
              />{" "}
              {/* Pasa el valor errors para el FormPersona así pilla de ahí los errores */}
            </div>
            <div className={"col-6"}>
              <FormPersona
                register={register}
                errors={errors}
                tipoPersona={"Denunciado"}
              />
            </div>
          </div>

          <div className="row">
            <div className={"col-6"}>
              <FormPersona
                register={register}
                errors={errors}
                tipoPersona={"Técnico"}
              />
            </div>
            <div className={"col-6"}>
              <FormObjeto errors={errors} register={register} />

              <label className="form-label" htmlFor="">
                Descripción
              </label>
              <textarea
                className="form-control col-6"
                {...register("descripcion")}
                rows={5}
                placeholder="Descripción de la denuncia"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <label className="form-label">Multiple files input example</label>
              <input
                className="form-control"
                type="file"
                id="formFileMultiple"
                multiple
              />
            </div>
            <div className="text-center col-6">
              <button type="submit" className="btn btn-success mt-4">
                Enviar formulario
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    
  );
};
