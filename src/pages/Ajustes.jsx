// src/pages/Ajustes.jsx (VERSIÓN FINAL Y COMPLETA)

import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { obtenerPerfilUsuario, actualizarPerfilUsuario, cambiarPassword } from "../apis/apiUsuarios";

const Ajustes = () => {
  // Estados para manejar la UI, carga y errores
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("personal");
  const [form, setForm] = useState(null);
  const [passwords, setPasswords] = useState({ actual: "", nueva: "", repetir: "" });

  // useEffect para cargar los datos del perfil del usuario logueado
  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token no encontrado. Por favor, inicie sesión de nuevo.");
        const data = await obtenerPerfilUsuario(token);
        setForm(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };
    cargarPerfil();
  }, []);

  // Funciones para manejar los cambios y envíos de los formularios
  const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) => setPasswords({ ...passwords, [e.target.name]: e.target.value });

  const handleGuardarCambios = async () => {
    try {
      const token = localStorage.getItem("token");
      const { email, area, ...datosParaActualizar } = form;
      const mensaje = await actualizarPerfilUsuario(datosParaActualizar, token);
      Swal.fire("¡Éxito!", mensaje, "success");
    } catch (err) {
      Swal.fire("Error", err.response?.data || "No se pudieron guardar los cambios.", "error");
    }
  };

  const handlePasswordSubmit = async () => {
    if (passwords.nueva !== passwords.repetir) {
      Swal.fire("Error", "Las nuevas contraseñas no coinciden.", "error");
      return;
    }
    // Lógica de SweetAlert para confirmar
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción cambiará tu contraseña.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cambiar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          const msg = await cambiarPassword(passwords, token);
          Swal.fire("Éxito", msg, "success");
          setPasswords({ actual: "", nueva: "", repetir: "" });
        } catch (err) {
          Swal.fire("Error", err.response?.data || "No se pudo cambiar la contraseña.", "error");
        }
      }
    });
  };

  // Renderizado condicional
  if (cargando) return <div className="p-4">Cargando perfil...</div>;
  if (error) return <div className="p-4 alert alert-danger">Error: {error}</div>;
  if (!form) return <div className="p-4">No se encontraron datos del perfil.</div>;

  // Renderizado principal
  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-1">Ajustes</h2>
      <div className="text-muted mb-4">Administra tu cuenta y preferencias del sistema</div>
      <div className="row">
        <div className="col-md-3 mb-3">
          <div className="list-group">
            <button className={`list-group-item list-group-item-action ${tab === "personal" ? "active" : ""}`} onClick={() => setTab("personal")}>
              <i className="bi bi-person me-2"></i>Información Personal
            </button>
            <button className={`list-group-item list-group-item-action ${tab === "password" ? "active" : ""}`} onClick={() => setTab("password")}>
              <i className="bi bi-lock me-2"></i>Contraseña
            </button>
          </div>
        </div>
        <div className="col-md-9">
          {tab === "personal" && (
            <div className="card">
              <div className="card-body">
                <h5 className="card-title mb-4">Información Personal</h5>
                <div className="row g-3">
                  <div className="col-md-6"><label className="form-label">Nombre de Usuario</label><input className="form-control" name="name" value={form.name || ''} onChange={handleFormChange} /></div>
                  <div className="col-md-6"><label className="form-label">Email</label><input className="form-control" name="email" value={form.email || ''} readOnly disabled /></div>
                  <div className="col-md-6"><label className="form-label">Nombre</label><input className="form-control" name="nombre" value={form.nombre || ''} onChange={handleFormChange} /></div>
                  <div className="col-md-6"><label className="form-label">Apellido</label><input className="form-control" name="apellido" value={form.apellido || ''} onChange={handleFormChange} /></div>
                  <div className="col-md-6"><label className="form-label">Documento</label><input className="form-control" name="documento" value={form.documento || ''} onChange={handleFormChange} /></div>
                  <div className="col-md-6"><label className="form-label">Teléfono</label><input className="form-control" name="telefono" value={form.telefono || ''} onChange={handleFormChange} /></div>
                  <div className="col-md-6"><label className="form-label">Domicilio</label><input className="form-control" name="domicilio" value={form.domicilio || ''} onChange={handleFormChange} /></div>
                  <div className="col-md-6"><label className="form-label">Localidad</label><input className="form-control" name="localidad" value={form.localidad || ''} onChange={handleFormChange} /></div>
                  <div className="col-md-6"><label className="form-label">Código Postal</label><input className="form-control" name="cp" value={form.cp || ''} onChange={handleFormChange} /></div>
                  <div className="col-md-6"><label className="form-label">Rol / Sector</label><input className="form-control" name="area" value={form.area || ''} readOnly disabled /></div>
                </div>
                <button className="btn btn-primary mt-4" onClick={handleGuardarCambios}>Guardar cambios</button>
              </div>
            </div>
          )}
          {tab === "password" && (
            <div className="card">
              <div className="card-body">
                <h5 className="card-title mb-4">Cambiar Contraseña</h5>
                <div className="mb-3"><label className="form-label">Contraseña actual</label><input type="password" name="actual" className="form-control" value={passwords.actual} onChange={handlePasswordChange} /></div>
                <div className="mb-3"><label className="form-label">Nueva contraseña</label><input type="password" name="nueva" className="form-control" value={passwords.nueva} onChange={handlePasswordChange} /></div>
                <div className="mb-3"><label className="form-label">Repetir nueva contraseña</label><input type="password" name="repetir" className="form-control" value={passwords.repetir} onChange={handlePasswordChange} /></div>
                <button className="btn btn-primary" onClick={handlePasswordSubmit}>Actualizar contraseña</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ajustes;