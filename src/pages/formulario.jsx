import { useRef, useState, useEffect } from "react";
import { FormPersona } from "../components/formulario-denuncia/FormPersona";
import { FormObjeto } from "../components/formulario-denuncia/FormObjeto";
import { useForm } from "react-hook-form";
import * as bootstrap from "bootstrap";
import { zodResolver } from "@hookform/resolvers/zod";
import { denunciaSchema } from "../validations/denunciaSchma";
import { enviarDenuncia } from "../apis/apiDenuncia";
import { Fab, Webchat } from "@botpress/webchat";
import { showAlert } from "../utils/accessDenied";
import { FormDenunciante } from "../components/formulario-denuncia/FormDenunciante";

export const Formulario = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [archivoError, setArchivoError] = useState("Debe subir al menos un archivo PDF.");
  const [toast, setToast] = useState({
    show: false,
    success: true,
    message: "",
  });
  const validarArchivos = (files) => {
    return Array.from(files).some(file => file.type === "application/pdf");
  };

  const fileInputRef = useRef();
  const [isWebchatOpen, setIsWebchatOpen] = useState(false);
  const toggleWebchat = () => setIsWebchatOpen((prevState) => !prevState);

  // inicializar tooltips de Bootstrap
  useEffect(() => {
    // inicializar todos los tooltips
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach((tooltip) => {
      new bootstrap.Tooltip(tooltip);
    });

    // cleanup al desmontar
    return () => {
      tooltips.forEach((tooltip) => {
        const instance = bootstrap.Tooltip.getInstance(tooltip);
        if (instance) {
          instance.dispose();
        }
      });
    };
  }, []);

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (validarArchivos(files)) {
      setArchivoError("");
    }
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(denunciaSchema),
    mode: "onChange", // Para que la validación sea en tiempo real
  });
  useEffect(() => {
    console.log("Form errors:", errors);
  }, [errors]);

  const onSubmit = async (data) => {
    console.log(data);
    if (!watch("aceptarTerminos")) {
      return; // No permitir el envío si los términos no están aceptados
    }
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

      // Compatibilidad: si el denunciado usa "razonSocial", mapearlo a "nombre"
      // para que el JSON enviado al backend mantenga la misma forma que antes.
      if (personasNormalizadas[1] && personasNormalizadas[1].persona) {
        const personaDenunciado = personasNormalizadas[1].persona;
        if (personaDenunciado.razonSocial && !personaDenunciado.nombre) {
          personaDenunciado.nombre = personaDenunciado.razonSocial;
          // mantener apellido como cadena vacía si no existe (estructura anterior)
          personaDenunciado.apellido = personaDenunciado.apellido ?? "";
          // opcional: eliminar "razonSocial" si no se desea enviarlo
          delete personaDenunciado.razonSocial;
        }
      }

  const dataFinal = { ...data, personas: personasNormalizadas };
  // Para depuración: loguear el JSON final que se enviará al backend
  console.log("Data final a enviar:", dataFinal);
      const files = fileInputRef.current?.files;
      if (!validarArchivos(files)) {
        showAlert({title: Error, text: "Selecciona al menos un archivo PDF con imágenes", icon: "error"})
      }
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
      // console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-light min-vh-100 py-5">
        <div className="container ">
          <h2 className="text-center mb-4">Formulario de Expedientes</h2>
          <p className="text-center">
            Completar Formulario con los siguientes datos:
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
              <div className="col-12 col-md-6">
                <FormDenunciante
                  register={register}
                  errors={errors}
                  tipoPersona={"Denunciante"}
                  index={0}
                />
              </div>
              <div className={"col-12 col-md-6"}>
                <FormPersona
                  register={register}
                  errors={errors}
                  tipoPersona={"Denunciado"}
                  index={1}
                />
              </div>
            </div>

            <div className="row">
              <div className={"col-12 col-md-6"}>
                <FormPersona
                  register={register}
                  errors={errors}
                  tipoPersona={"Técnico"}
                  index={2}
                  optional={true}
                />
              </div>
              <div className={"col-12 col-md-6"}>
                <FormObjeto errors={errors} register={register} />
                <label className="form-label" htmlFor="descripcion">
                  {" "}
                  <h5>
                    Descripción{" "}
                    <span style={{ color: "red", marginLeft: "4px" }}>*</span>
                  </h5>
                </label>
                <textarea
                  id="descripcion"
                  className="form-control"
                  {...register("descripcion")}
                  rows={5}
                  placeholder="Descripción de la denuncia"
                />
                {errors.descripcion?.message && (
                  <p className="text-danger">{errors.descripcion.message}</p>
                )}
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
                  onChange={handleFileChange}
                />
                {archivoError && <p className="text-danger">{archivoError}</p> }
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
                    Acepto los{" "}
                    <a
                      href="/PaginaTerminos"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Términos y Condiciones
                    </a>
                  </label>
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className={`btn mt-2 ${
                      !watch("aceptarTerminos")
                        ? "btn-secondary opacity-50"
                        : "btn-success"
                    }`}
                    style={
                      !watch("aceptarTerminos") ? { cursor: "not-allowed" } : {}
                    }
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    { ... (!watch("aceptarTerminos") && {
                      'data-bs-title': 'Debe aceptar los términos y condiciones para continuar'
                    })}>
                    {isSubmitting ? "Enviando..." : "Enviar formulario"}
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
          width: "400px",
          height: "600px",
          display: isWebchatOpen ? "flex" : "none",
          position: "fixed",
          zIndex: "999",
          bottom: "90px",
          right: "20px",
        }}
      />
      <Fab
        onClick={toggleWebchat}
        title="Asistente SITE"
        botName="Asistente SITE"
        style={{
          position: "fixed",
          width: "80px",
          height: "80px",
          bottom: "20px",
          right: "20px",
        }}
      />
    </>
  );
};
