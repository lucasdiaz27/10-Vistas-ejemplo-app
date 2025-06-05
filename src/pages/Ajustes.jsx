import React, { useState } from "react";

const Ajustes = () => {
  const [tab, setTab] = useState("personal");
  const [form, setForm] = useState({
    nombre: "Juan",
    apellido: "Díaz",
    email: "juan.diaz@dgc.gob.ar",
    telefono: "(011) 4567-8900",
    cargo: "Analista",
    departamento: "Sistemas",
  });
  const [passwords, setPasswords] = useState({ actual: "", nueva: "", repetir: "" });
  const [notificaciones, setNotificaciones] = useState({ correo: true, sistema: true });
  const [tema, setTema] = useState("claro");
  const [privacidad, setPrivacidad] = useState({ mostrarEmail: true, mostrarTelefono: false });

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };
  const handleNotifChange = (e) => {
    setNotificaciones({ ...notificaciones, [e.target.name]: e.target.checked });
  };
  const handlePrivacidadChange = (e) => {
    setPrivacidad({ ...privacidad, [e.target.name]: e.target.checked });
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-1">Ajustes</h2>
      <div className="text-muted mb-4">Administra tu cuenta y preferencias del sistema</div>
      <div className="row">
        <div className="col-md-3 mb-3">
          <div className="list-group">
            <button className={`list-group-item list-group-item-action${tab === "personal" ? " active" : ""}`} onClick={() => setTab("personal")}> <i className="bi bi-person me-2"></i>Información Personal</button>
            <button className={`list-group-item list-group-item-action${tab === "password" ? " active" : ""}`} onClick={() => setTab("password")}> <i className="bi bi-lock me-2"></i>Contraseña</button>
            <button className={`list-group-item list-group-item-action${tab === "notificaciones" ? " active" : ""}`} onClick={() => setTab("notificaciones")}> <i className="bi bi-bell me-2"></i>Notificaciones</button>
            <button className={`list-group-item list-group-item-action${tab === "tema" ? " active" : ""}`} onClick={() => setTab("tema")}> <i className="bi bi-palette me-2"></i>Tema</button>
            <button className={`list-group-item list-group-item-action${tab === "privacidad" ? " active" : ""}`} onClick={() => setTab("privacidad")}> <i className="bi bi-shield-lock me-2"></i>Privacidad</button>
          </div>
        </div>
        <div className="col-md-9">
          {tab === "personal" && (
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title mb-4">Información Personal</h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Nombre</label>
                    <input className="form-control" name="nombre" value={form.nombre} onChange={handleFormChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Apellido</label>
                    <input className="form-control" name="apellido" value={form.apellido} onChange={handleFormChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Correo electrónico</label>
                    <input className="form-control" name="email" value={form.email} onChange={handleFormChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Teléfono</label>
                    <input className="form-control" name="telefono" value={form.telefono} onChange={handleFormChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Cargo</label>
                    <input className="form-control" name="cargo" value={form.cargo} onChange={handleFormChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Departamento</label>
                    <input className="form-control" name="departamento" value={form.departamento} onChange={handleFormChange} />
                  </div>
                </div>
                <button className="btn btn-primary mt-4">Guardar cambios</button>
              </div>
            </div>
          )}
          {tab === "password" && (
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title mb-4">Cambiar Contraseña</h5>
                <div className="mb-3">
                  <label className="form-label">Contraseña actual</label>
                  <input type="password" className="form-control" name="actual" value={passwords.actual} onChange={handlePasswordChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Nueva contraseña</label>
                  <input type="password" className="form-control" name="nueva" value={passwords.nueva} onChange={handlePasswordChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Repetir nueva contraseña</label>
                  <input type="password" className="form-control" name="repetir" value={passwords.repetir} onChange={handlePasswordChange} />
                </div>
                <button className="btn btn-primary">Actualizar contraseña</button>
              </div>
            </div>
          )}
          {tab === "notificaciones" && (
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title mb-4">Notificaciones</h5>
                <div className="form-check form-switch mb-2">
                  <input className="form-check-input" type="checkbox" id="notif1" name="correo" checked={notificaciones.correo} onChange={handleNotifChange} />
                  <label className="form-check-label" htmlFor="notif1">Recibir notificaciones por correo</label>
                </div>
                <div className="form-check form-switch mb-2">
                  <input className="form-check-input" type="checkbox" id="notif2" name="sistema" checked={notificaciones.sistema} onChange={handleNotifChange} />
                  <label className="form-check-label" htmlFor="notif2">Recibir notificaciones en el sistema</label>
                </div>
              </div>
            </div>
          )}
          {tab === "tema" && (
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title mb-4">Tema</h5>
                <div className="mb-3">
                  <label className="form-label">Selecciona el tema de la interfaz</label>
                  <select className="form-select" value={tema} onChange={e => setTema(e.target.value)}>
                    <option value="claro">Claro</option>
                    <option value="oscuro">Oscuro</option>
                    <option value="sistema">Usar el del sistema</option>
                  </select>
                </div>
                <button className="btn btn-primary">Guardar tema</button>
              </div>
            </div>
          )}
          {tab === "privacidad" && (
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title mb-4">Privacidad</h5>
                <div className="form-check mb-2">
                  <input className="form-check-input" type="checkbox" id="priv1" name="mostrarEmail" checked={privacidad.mostrarEmail} onChange={handlePrivacidadChange} />
                  <label className="form-check-label" htmlFor="priv1">Mostrar mi correo electrónico a otros usuarios</label>
                </div>
                <div className="form-check mb-2">
                  <input className="form-check-input" type="checkbox" id="priv2" name="mostrarTelefono" checked={privacidad.mostrarTelefono} onChange={handlePrivacidadChange} />
                  <label className="form-check-label" htmlFor="priv2">Mostrar mi teléfono a otros usuarios</label>
                </div>
                <button className="btn btn-primary">Guardar privacidad</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ajustes;
