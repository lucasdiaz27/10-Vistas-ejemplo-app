import { useNavigate } from "react-router-dom";

export const Inicio = () => {
  const navigate = useNavigate();

  const irAlFormulario = () => {
    navigate("/formulario"); // Redirige al componente Formulario
  };

  return (
    <div className="container text-center mt-5">
      {/* Tarjeta con Bootstrap */}
      <div className="card p-5 shadow-lg">
        <h1 className="mb-3">Bienvenido a SITE</h1>
        <p className="mb-4">Sistema Interno de Traspasos y Expedientes</p>

        {/* Boton para ir al formulario */}
        <button onClick={irAlFormulario} className="btn btn-primary">
          Ir al Formulario
        </button>
      </div>
    </div>
  );
};
