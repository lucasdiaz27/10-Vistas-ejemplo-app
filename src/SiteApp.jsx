import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer/Footer";
import { Formulario } from "./pages/Formulario";
import { Inicio } from "./pages/inicio";
import { FormPersona } from "./components/FormPersona";
import Consulta from "./pages/consulta";
import Login from "./pages/Login";

function SiteApp() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <NavBar />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/formulario" element={<Formulario />} />
            <Route path="/formularioPersona" element={<FormPersona />} />
            <Route path="/consulta" element={<Consulta />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default SiteApp;
