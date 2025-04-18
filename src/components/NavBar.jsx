import { Link } from 'react-router-dom';


export const NavBar = () =>{
    return (
        <>
        <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark" style={{ height: "60px" }}>
  <div className="container-fluid">
    <Link to = "/" className="navbar-brand d-flex align-items-center" style={{ height: "60px" }}>
      <img src="Logo.svg" alt="Logo DGC"
      style={{ height: "60px",width: "auto", objectFit: "contain"}}/>
    </Link>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarNav">
      <ul className="navbar-nav mx-auto">
        <li className="nav-item me-5">
          <a className="nav-link" aria-current="page" href="#">Inicio</a>
        </li>
        <li className="nav-item me-5">
        <Link className="nav-link" to="/consulta">Consultas</Link>
        </li>
        <li className="nav-item ">
          <Link className="nav-link" to="/formulario">Formulario</Link>
        </li>
      </ul>
      <ul className="navbar-nav ms-auto">
        <li className="nav-item">
          <a className="nav-link" href="#">Cerrar Sesión</a>
        </li>
      </ul>
    </div>
  </div>
</nav>
        </>
    )
};

export default NavBar;