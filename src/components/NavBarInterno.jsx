import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";

export const NavBarInterno = () => {
  const navigate = useNavigate();
  const [rol, setRol] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRol(decoded.rol || decoded.role);
      } catch (e) {
        setRol(null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <nav
        className="navbar sticky-top navbar-expand-lg bg-primary"
        data-bs-theme="dark"
        style={{ height: "60px" }}
      >
        <div className="container-fluid">
          <Link
            to="/menu-interno?vista=mesa-entrada"
            className="navbar-brand d-flex align-items-center "
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
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item me-5">
                <Link className="nav-link text-white fw-semibold" to="/menu-interno?vista=mesa-entrada">
                  Mesa de Entrada
                </Link>

              </li>
              <li className="nav-item me-5">
                <Link className="nav-link text-white fw-semibold" to="/menu-interno?vista=pases">
                  Pases
                </Link>
              </li>
              <li className="nav-item me-5">
                <Link className="nav-link text-white fw-semibold" to="/menu-interno?vista=expedientes">
                  Expedientes
                </Link>
              </li>
              <li className="nav-item me-5">
                <Link className="nav-link text-white fw-semibold" to="/menu-interno?vista=usuarios">
                  Usuarios
                </Link>
              </li>
              <li className="nav-item me-5">
                <Link className="nav-link text-white fw-semibold" to="/ajustes">
                  Ajustes
                </Link>
              </li>
              {(rol === "ADMIN" || rol === "DIRECCION") && (
                <li className="nav-item me-5">
                  <Link className="nav-link text-white fw-semibold" to="/menu-interno?vista=auditoria">
                    Auditoría
                  </Link>
                </li>
              )}
            </ul>
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <button
                  className="nav-link text-white fw-semibold btn btn-link"
                  onClick={handleLogout}
                >
                  Cerrar Sesión
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBarInterno;