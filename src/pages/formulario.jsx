import { useRef, useState } from "react";
import { FormPersona } from "../components/formulario-denuncia/FormPersona";
import { FormObjeto } from "../components/formulario-denuncia/FormObjeto";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { denunciaSchema } from "../validations/denunciaSchma";
import { enviarDenuncia } from "../apis/apiDenuncia";
import { Fab, Webchat } from "@botpress/webchat";

export const Formulario = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    success: true,
    message: "",
  });
  const fileInputRef = useRef();
  const [isWebchatOpen, setIsWebchatOpen] = useState(false);
  const toggleWebchat = () => setIsWebchatOpen((prevState) => !prevState);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(denunciaSchema),
    mode: 'onChange', // Para que la validación sea en tiempo real
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const rolesPorIndice = ["denunciante", "denunciado", "tecnico"];
      const personasNormalizadas = (data.personas || []).map((p, idx) => ({
        ...p,
        nombreDelegado: p.nombreDelegado ?? "",
        apellidoDelegado: p.apellidoDelegado ?? "",
        dniDelegado: p.dniDelegado ?? "",
        rol: p.rol && p.rol !== "" ? p.rol : rolesPorIndice[idx] || "",
      }));
      
      const dataFinal = { ...data, personas: personasNormalizadas };
      const files = fileInputRef.current?.files;
      await enviarDenuncia(dataFinal, files);

      setToast({
        show: true,
        success: true,
        message: "¡Formulario enviado correctamente!",
      });
    } catch (error) {
      setToast({
        show: true,
        success: false,
        message: "No se pudo enviar el formulario.",
      });
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-light min-vh-100 py-5">
        <div className="container ">
          <h2 className="text-center mb-4">Formulario de Expedientes</h2>
          <p className="text-center">Completar Formulario con los siguientes datos:</p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
              <div className="col-12 col-md-6">
                <FormPersona register={register} errors={errors} tipoPersona={"Denunciante"} index={0} />
              </div>
              <div className={"col-12 col-md-6"}>
                <FormPersona register={register} errors={errors} tipoPersona={"Denunciado"} index={1} />
              </div>
            </div>

            <div className="row">
              <div className={"col-12 col-md-6"}>
                <FormPersona register={register} errors={errors} tipoPersona={"Técnico"} index={2} />
              </div>
              <div className={"col-12 col-md-6"}>
                <FormObjeto errors={errors} register={register} />
                <label className="form-label" htmlFor="descripcion">Descripción</label>
                <textarea
                  id="descripcion"
                  className="form-control"
                  {...register("descripcion")}
                  rows={5}
                  placeholder="Descripción de la denuncia"
                />
                <div className="form-check mt-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="notificar"
                    {...register("notificar")}
                  />
                  <label className="form-check-label" htmlFor="notificar">
                    Notificar al mail
                  </label>
                </div>
              </div>
            </div>
            
            <div className="row">
              <div className="col-12 col-md-6">
                <label className="form-label">Envía tus archivos aquí</label>
                <input
                  className="form-control"
                  type="file"
                  id="formFileMultiple"
                  multiple
                  ref={fileInputRef}
                />
              </div>
            </div>

            {/* --- SECCIÓN DE TÉRMINOS Y CONDICIONES RESTAURADA --- */}
            <div className="row mt-4">
              <div className="col-12">
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="aceptarTerminos"
                    {...register("aceptarTerminos")}
                  />
                  <label htmlFor="aceptarTerminos" className="form-check-label">
                    Acepto los <a href="/PaginaTerminos" target="_blank" rel="noopener noreferrer">Términos y Condiciones</a>
                  </label>
                  {errors.aceptarTerminos && (
                    <p className="text-danger small mt-1">{errors.aceptarTerminos.message}</p>
                  )}
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-success mt-2"
                    disabled={!watch("aceptarTerminos") || isSubmitting}
                  >
                    {isSubmitting ? 'Enviando...' : 'Enviar formulario'}
                  </button>
                </div>
              </div>
            </div>
          </form>

          {toast.show && (
            <div
              className={`toast align-items-center text-white ${
                toast.success ? "bg-success" : "bg-danger"
              } position-fixed top-0 start-50 translate-middle-x mt-4 show`}
              role="alert"
              style={{ zIndex: 9999, minWidth: 300 }}
            >
              <div className="d-flex">
                <div className="toast-body">{toast.message}</div>
                <button
                  type="button"
                  className="btn-close btn-close-white me-2 m-auto"
                  onClick={() => setToast({ ...toast, show: false })}
                ></button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Webchat
        clientId="339c584f-b9f4-4eb3-8af2-40f859ece33c"
        style={{
          width: "400px", height: "600px", display: isWebchatOpen ? "flex" : "none",
          position: "fixed", zIndex: "999", bottom: "90px", right: "20px",
        }}
      />
      <Fab
        onClick={toggleWebchat}
        title="Asistente SITE"
        botName="Asistente SITE"
        style={{
          position: "fixed", width: "80px", height: "80px",
          bottom: "20px", right: "20px",
        }}
      />
    </>
  );
};

