import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
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
import { DetalleDenuncia as DetalleDenunciaPage } from "./pages/DetalleDenuncia";
import DetalleExpediente from "./components/expedientes/DetalleExpediente";
import Ajustes from "./pages/Ajustes";
import ScrollToTop from "./components/ScrollToTop";
import SideBar from "./components/SideBar";
import { useState } from "react";
import PrivateRoute from "./routes/PrivateRoute";
import ProtectedRoute from "./routes/RutaProtegida";
import GeneradorPDF from "./components/pdf/GeneradorPDF";
import { Navbar } from "react-bootstrap";
import { InternalLayout } from "./routes/InternalLayout";
import { PaginaModal } from "./components/expedientes/modales/PaginaModal";
import { ModalPdf } from "./components/expedientes/modales/ModalPdf";
import PaginaTerminos from "./pages/PaginaTerminos";

function SiteApp() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Layout público con NavBar y Footer */}
        <Route
          element={
            <>
              <NavBar /> <Outlet /> <Footer />
            </>
          }
        >
          <Route path="/" element={<Inicio />} />
          <Route path="/modal" element={<ModalPdf />} />
          <Route path="/formulario" element={<Formulario />} />
          <Route path="/formularioPersona" element={<FormPersona />} />
          <Route path="/consulta" element={<Consulta />} />
          <Route path="/login" element={<Login />} />
          <Route path="/PaginaTerminos" element={<PaginaTerminos />} />
        </Route>

        {/* Páginas internas protegidas con roles */}
        <Route element={<ProtectedRoute />}>
          <Route element={<InternalLayout />}>
            <Route path="/menu-interno" element={<MenuInterno />} />
            <Route path="/lista-denuncias" element={<ListaDenuncias />} />
            <Route path="/denuncia/:id" element={<DetalleDenunciaPage />} />
            <Route path="/expedientes/:id" element={<DetalleExpediente />} />
            <Route path="/ajustes" element={<Ajustes />} />
          </Route>
        </Route>

        {/* NUEVO: Ruta protegida para probar el generador de PDF */}
        {/* <Route
          path="/prueba-pdf"
          element={
            <PrivateRoute>
              <>
                <SideBar abierto={sidebarAbierta} setAbierto={setSidebarAbierta} />
                <div className={`contenido-principal ${sidebarAbierta ? "con-sidebar" : ""}`}>
                  <h2>Prueba Generador de PDF</h2>
                  <GeneradorPDF />
                </div>
              </>
            </PrivateRoute>
          }
        /> */}
      </Routes>
    </Router>
  );
}

export default SiteApp;
