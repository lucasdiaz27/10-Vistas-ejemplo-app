import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from './components/NavBar';
import { FormPersona } from "./components/FormPersona";
import Consulta from "./pages/consulta";
import { Formulario } from "./pages/formulario";
import Inicio from "./pages/inicio";
import Login from "./pages/Login";

function SiteApp() {
  return (
    <Router>
      <NavBar />

      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/formulario" element={<Formulario />} />
        <Route path="/formularioPersona" element={<FormPersona />} />
        <Route path="/consulta" element={<Consulta />} />
        <Route path="/login" element={<Login />} />

      </Routes>

    </Router>
  );
}

export default SiteApp;