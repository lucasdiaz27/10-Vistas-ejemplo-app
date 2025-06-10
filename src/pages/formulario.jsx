import { useRef, useState } from "react";
import { FormPersona } from "../components/formulario-denuncia/FormPersona";
import { FormObjeto } from "../components/formulario-denuncia/FormObjeto";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { data } from "react-router-dom";
import { denunciaSchema } from "../validations/denunciaSchma";
import { enviarDenuncia } from "../apis/apiDenuncia";

export const Formulario = () => {
  const [formularioEnviado, setFormularioEnviado] = useState(false);
  const [toast, setToast] = useState({ show: false, success: true, message: "" });
  const fileInputRef = useRef();

  /* formState errors trae los errores (si es que hay), de cada fieldValue o input por así decirlo,  */
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm(/*{
    resolver: zodResolver(denunciaSchema), // Aquí le pasas el schema del cual se va a basar para resolver los errores (o eso entendí yo). Si pones el clic sobre resolver y denunciaSchema vas a ver
  }*/);
  console.log(errors); // Esto es para ver los errores en consola. Si hay errores, se va a mostrar en consola los errores, si no hay, no aparece.
  
  const onSubmit = (data) => {
    try {
      const files = fileInputRef.current?.files;
      enviarDenuncia(data, files);
      setToast({
        show: true,
        success: true,
        message: "¡Formulario enviado correctamente!",
      });
      setFormularioEnviado(true);
    } catch (error) {
      setToast({
        show: true,
        success: false,
        message: "No se pudo enviar el formulario.",
      });
      setFormularioEnviado(false);
      console.log(error);
    }
  }
  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container ">
        <div>
          {/* A esto borralo cuando quieras, es para que se vean todos los campos nomas. */}
        </div>
        <h2 className="text-center mb-4">Formulario de Expedientes</h2>
        
        <p className="text-center">
          Completar Formulario con los siguientes datos:
        </p>
        <form
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="row">
            <div className="col-6">
              <FormPersona
                register={register}
                errors={errors}
                tipoPersona={"Denunciante"}
                index={0}
              />
              {/* Pasa el valor errors para el FormPersona así pilla de ahí los errores */}
            </div>
            <div className={"col-6"}>
              <FormPersona
                register={register}
                errors={errors}
                tipoPersona={"Denunciado"}
                index={1}
              />
            </div>
          </div>

          <div className="row">
            <div className={"col-6"}>
              <FormPersona
                register={register}
                errors={errors}
                tipoPersona={"Técnico"}
                index={2}
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
                ref={fileInputRef}
              />
            </div>
            <div className="text-center col-6">
              <button type="submit" className="btn btn-success mt-4">
                Enviar formulario
              </button>
            </div>
          </div>
        </form>
        {toast.show && (
          <div
            className={`toast align-items-center text-white ${toast.success ? "bg-success" : "bg-danger"} position-fixed top-0 start-50 translate-middle-x mt-4 show`}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            style={{ zIndex: 9999, minWidth: 300 }}
          >
            <div className="d-flex">
              <div className="toast-body">
                {toast.message}
              </div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                aria-label="Close"
                onClick={() => setToast({ ...toast, show: false })}
              ></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
