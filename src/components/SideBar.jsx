import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import './SideBar.css';
import { useState } from "react";
import { jwtDecode } from "jwt-decode";

export const SideBar = ({ abierto, setAbierto }) => {
    const toggleSidebar = () => {
        setAbierto(!abierto);
    };
    
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const vistaActual = params.get("vista");

    // Obtener el rol y el nombre del usuario desde el token
    let rol = null;
    let userName = "";
    const token = localStorage.getItem("token");
    if (token) {
        try {
            const decoded = jwtDecode(token);
            rol = decoded.rol || decoded.role;
            userName = decoded.name || "";
        } catch (e) {
            rol = null;
            userName = "";
        }
    }

    return (
        <>
            <button
                onClick={toggleSidebar}
                className="btn position-fixed top-0 start-0 m-2 z-3 border border-white text-white"
                style={{ backgroundColor: "#212529", zIndex: 1051 }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#343a40")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#212529")}
            >
                <i className="bi bi-list"></i>
            </button>
            
            <div
                className={`sidebar bg-dark text-white p-3 position-fixed top-0 start-0 h-100 ${abierto ? "sidebar-open" : "sidebar-closed"}`}
                style={{ width: "280px", transition: "transform 0.3s ease" }}
            >


                <button
                    className="btn btn-outline-light position-fixed top-0 start-0 m-2 z-3"
                    onClick={toggleSidebar}
                    style={{ zIndex: 1051 }} // asegúrate que esté encima del sidebar
                >
                    <i className="bi bi-list"></i>
                </button>


                <Link
                    to="/menu-interno?vista=mesa-entrada"
                    className="navbar-brand d-flex align-items-center ms-5"
                    style={{ height: "60px" }}
                >
                    <img
                        src="Logo.png"
                        alt="Logo DGC"
                        style={{ height: "60px", width: "auto", objectFit: "contain", marginLeft: "120px" }}
                    />
                </Link>
                <hr />
                <ul className="nav nav-pills flex-column mb-auto">
                    <li className="nav-item">
                        <Link to="/menu-interno?vista=mesa-entrada" className={`nav-link text-white ${vistaActual === "mesa-entrada" ? "active" : ""}`}>
                            <i className="bi bi-house-door me-2"></i>
                            Mesa de Entrada
                        </Link>
                    </li>
                    {/* Solo mostrar el resto si NO es MESA_ENTRADA */}
                    {rol !== "MESA_ENTRADA" && (
                        <>
                            <li>
                                <Link to="/menu-interno?vista=pases" className={`nav-link text-white  ${vistaActual === "pases" ? "active" : ""}`}>
                                    <i className="bi bi-speedometer2 me-2"></i>
                                    Pases
                                </Link>
                            </li>
                            <li>
                                <Link to="/menu-interno?vista=expedientes" className={`nav-link text-white ${vistaActual === "expedientes" ? "active" : ""}`}>
                                    <i className="bi bi-table me-2"></i>
                                    Expedientes
                                </Link>
                            </li>
                            <li>
                                <Link to="/menu-interno?vista=usuarios" className={`nav-link text-white ${vistaActual === "usuarios" ? "active" : ""}`}>
                                    <i className="bi bi-grid me-2"></i>
                                    Usuarios
                                </Link>
                            </li>
                            <Link
                                to="/ajustes" className={`nav-link text-white ${location.pathname === "/ajustes" ? "active" : ""}`}
                            >
                                <i className="bi bi-people me-2"></i>
                                Ajustes
                            </Link>
                        </>
                    )}
                    <li>
                        <Link to="/login" className={`nav-link text-white ${vistaActual === "cerrarsesion  " ? "active" : ""}`}
                            onClick={handleLogout}
                            style={{cursor: "pointer"}}>
                            <i className="bi bi-grid me-2"></i>
                            Cerrar Sesión
                        </Link>
                    </li>
                </ul>
                <hr />
                <div className="dropdown">
                    <a
                        href="#"
                        className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        <img
                            src="https://github.com/mdo.png"
                            alt=""
                            width="32"
                            height="32"
                            className="rounded-circle me-2"
                        />
                        <strong>{userName || "Usuario"}</strong>
                    </a>
                    <ul className="dropdown-menu dropdown-menu-dark text-small shadow">
                        <li><a className="dropdown-item" href="#">Settings</a></li>
                        <li><a className="dropdown-item" href="#">Profile</a></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><a className="dropdown-item" href="#">Sign out</a></li>
                    </ul>
                </div>
            </div>
        </>
        
    );
};

export default SideBar;