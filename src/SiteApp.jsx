import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {Formulario} from './pages/Formulario'
import { Inicio } from "./pages/inicio";
import { FormPersona } from "./components/FormPersona";

function SiteApp() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/formulario" element={<Formulario/>} />
        <Route path="/formularioPersona" element={<FormPersona/>} />
      </Routes>
    </Router>
  );
}

export default SiteApp;