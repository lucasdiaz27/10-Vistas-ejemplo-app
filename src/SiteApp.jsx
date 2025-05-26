import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer/Footer";
import { Formulario } from "./pages/formulario";
import { Inicio } from "./pages/inicio";
import { FormPersona } from "./components/formulario-denuncia/FormPersona";
import Consulta from "./pages/consulta";
import Login from "./pages/Login";
import MenuInterno from "./pages/MenuInterno";
import NavBarInterno from "./components/NavBarInterno";
import { Prueba } from "./pages/prueba";
import ListaDenuncias from "./components/ListaDenuncias";
import DetalleDenuncia from "./components/DetalleDenuncia";

function SiteApp() {
  return (
    <Router>
      <Routes>
        {/* Páginas normales con NavBar y Footer */}
        <Route
          path="/"
          element={
            <>
              <NavBar />
              <Inicio />
              <Footer />
            </>
          }
        />
        <Route
          path="/formulario"
          element={
            <>
              <NavBar />
              <Formulario />
              <Footer />
            </>
          }
        />
        <Route
          path="/formularioPersona"
          element={
            <>
              <NavBar />
              <FormPersona />
              <Footer />
            </>
          }
        />
        <Route
          path="/consulta"
          element={
            <>
              <NavBar />
              <Consulta />
              <Footer />
            </>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <NavBar />
              <Login />
              <Footer />
            </>
          }
        />

        {/* Paginas Internos con NavBarInterno */}
        <Route
          path="/menu-interno"
          element={
            <>
              <NavBarInterno />
              <MenuInterno />
              {/* Aqui podria ir otro footer */}
            </>
          }
        />


        <Route
          path="/prueba"
          element={
            <>
              <Prueba />
              {/* Aqui podria ir otro footer */}
            </>
          }
        />
        <Route
          path="/lista-denuncias"
          element={
            <>
              <NavBarInterno />
              <ListaDenuncias />
              {/* Aqui podria ir otro footer pero me da paja hacerlo*/}
            </>
          }
        />
        <Route
          path="/denuncia/:id"
          element={
            <>
              <NavBarInterno />
              <DetalleDenuncia />
            </>
          }
        />

      </Routes>
    </Router>
  );
}

export default SiteApp;
