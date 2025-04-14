import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from './components/NavBar';
import { Formulario } from './pages/Formulario'
import { Inicio } from "./pages/inicio";
import { FormPersona } from "./components/FormPersona";
import Consulta from "./pages/consulta";

function SiteApp() {
  return (
    <Router>
      <NavBar />

      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/formulario" element={<Formulario />} />
        <Route path="/formularioPersona" element={<FormPersona />} />
        <Route path="/consulta" element={<Consulta />} />
      </Routes>

    </Router>
  );
}

export default SiteApp;