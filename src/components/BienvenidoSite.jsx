import { useNavigate } from "react-router-dom";

export const BienvenidoSite = () => {
  const navigate = useNavigate();

  return (
    <div
        className="text-white d-flex align-items-center justify-content-center"
        style={{
          backgroundImage: "url('/imagen para inicio.avif')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "300px",
        }}
      >
        <div className="text-center">
          <h1 className="fw-bold">Bienvenido a SITE</h1>
          <p>Sistema Interno de Traspasos y Expedientes</p>
          <button
            onClick={() => navigate("/formulario")}
            className="btn btn-primary mt-3"
          >
            Iniciar Formulario
          </button>
        </div>
      </div>
  )
}