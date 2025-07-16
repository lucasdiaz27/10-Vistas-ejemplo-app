import { Link } from "react-router-dom";

export const NavBar = () => {
  return (
    <>
      <nav
        className="navbar navbar-expand-lg bg-primary"
        data-bs-theme="dark"
        style={{ position: "relative" }}
      >
        <div className="container-fluid">
          <Link
            to="/"
            className="navbar-brand d-flex align-items-center"
            style={{ height: "60px" }}
          >
            <img
              src="Logo.svg"
              alt="Logo DGC"
              style={{ height: "60px", width: "auto", objectFit: "contain" }}
            />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse bg-primary p-3" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item me-5" style={{fontSize: "1.2rem"}}>
                <Link className="nav-link text-white fw-semibold w-100" to="/">
                  Inicio
                </Link>
              </li>
              {/* <li className="nav-item me-5">
                <Link className="nav-link text-white fw-semibold w-100" to="/consulta">
                  Consultas
                </Link>
              </li> */}
              <li className="nav-item " style={{fontSize: "1.2rem"}}>
                <Link className="nav-link text-white fw-semibold w-100" to="/formulario">
                  Formulario
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;

