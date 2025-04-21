import { useNavigate } from "react-router-dom";

export const BienvenidoSite = () => {
  const navigate = useNavigate();

  return (
    <div
      className="text-white d-flex align-items-center justify-content-center"
      style={{
        backgroundImage: "url('public/imagen para inicio.avif')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        height: "300px",
        width: "100%",
      }}
    >
      <div
        style={{
          position: "absolute",
          height: "300px",
          width: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.3)", // capa negra con opacidad
          zIndex: 1,
        }}
      />
      <div className="text-center" style={{ zIndex: 2 }}>
        <h1 className="fw-bold">Bienvenido a SITE</h1>
        <p>Sistema Interno de Traspasos y Expedientes</p>
        <button
          onClick={() => navigate("/formulario")}
          className="btn btn-primary mt-3"
        >
          Iniciar Formulario
        </button>
      </div>
      <div />
    </div>
  );
};
