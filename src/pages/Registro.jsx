// src/pages/Registro.jsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUsuario } from "../apis/apiAuth";

const ROLES = [
    { value: "OPERADOR", label: "OPERADOR" },
    { value: "DENUNCIANTE", label: "DENUNCIANTE" },
    { value: "ADMIN", label: "ADMIN" },
];

const initialForm = {
    email: "",
    password: "",
    nombre: "",
    apellido: "",
    rol: "OPERADOR",
    documento: "",
    telefono: "",
    cp: "",
    localidad: "",
    domicilio: "",
};

const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

export default function Registro() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState(initialForm);
    const [errors, setErrors] = useState({}); // errores por campo
    const [serverError, setServerError] = useState(""); // error general
    const [loading, setLoading] = useState(false);

    const requiredFields = useMemo(
        () => ["email", "password", "nombre", "apellido", "rol", "documento", "telefono", "cp", "localidad", "domicilio"],
        []
    );

    const validateClient = () => {
        const e = {};

        // Requeridos
        for (const key of requiredFields) {
            if (!String(formData[key] ?? "").trim()) e[key] = "Campo requerido";
        }

        // Email
        if (formData.email && !isValidEmail(formData.email)) {
            e.email = "Email inválido";
        }

        // Password
        if (formData.password && formData.password.length < 8) {
            e.password = "La contraseña debe tener al menos 8 caracteres";
        }

        return e;
    };

    const handleChange = (key) => (ev) => {
        setFormData((prev) => ({ ...prev, [key]: ev.target.value }));
        setErrors((prev) => ({ ...prev, [key]: undefined }));
        setServerError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError("");

        const clientErrors = validateClient();
        if (Object.keys(clientErrors).length > 0) {
            setErrors(clientErrors);
            return;
        }

        setLoading(true);
        try {
            const response = await registerUsuario(formData);

            // Ajustá las claves según lo que devuelva el backend (token / refreshToken)
            const token = response?.data?.token;
            const refreshToken = response?.data?.refreshToken;

            if (token) localStorage.setItem("token", token);
            if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

            navigate("/menu-interno");
        } catch (error) {
            const status = error?.response?.status;

            if (status === 400) {
                // Puede venir { details: { campo: "mensaje" } } o similar
                const details = error?.response?.data?.details;
                if (details && typeof details === "object") {
                    setErrors(details);
                } else {
                    setServerError("Hay errores de validación. Revisá los campos.");
                }
            } else if (status === 409) {
                const msg = error?.response?.data?.error || "Email ya registrado";
                setErrors({ email: msg });
            } else if (status === 429) {
                setServerError("Demasiados intentos. Esperá un momento y volvé a intentar.");
            } else {
                setServerError("Ocurrió un error inesperado. Intentá nuevamente.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-4" style={{ maxWidth: 760 }}>
            <h2 className="mb-3">Registro</h2>
            <p className="text-muted mb-4">Completá los datos para crear tu cuenta.</p>

            {serverError && (
                <div className="alert alert-danger" role="alert">
                    {serverError}
                </div>
            )}

            <form onSubmit={handleSubmit} className="row g-3">
                <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className={`form-control ${errors.email ? "is-invalid" : ""}`}
                        value={formData.email}
                        onChange={handleChange("email")}
                        placeholder="usuario@mail.com"
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                <div className="col-md-6">
                    <label className="form-label">Contraseña</label>
                    <input
                        type="password"
                        className={`form-control ${errors.password ? "is-invalid" : ""}`}
                        value={formData.password}
                        onChange={handleChange("password")}
                        placeholder="Mínimo 8 caracteres"
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>

                <div className="col-md-6">
                    <label className="form-label">Nombre</label>
                    <input
                        className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
                        value={formData.nombre}
                        onChange={handleChange("nombre")}
                    />
                    {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                </div>

                <div className="col-md-6">
                    <label className="form-label">Apellido</label>
                    <input
                        className={`form-control ${errors.apellido ? "is-invalid" : ""}`}
                        value={formData.apellido}
                        onChange={handleChange("apellido")}
                    />
                    {errors.apellido && <div className="invalid-feedback">{errors.apellido}</div>}
                </div>

                <div className="col-md-4">
                    <label className="form-label">Rol</label>
                    <select
                        className={`form-select ${errors.rol ? "is-invalid" : ""}`}
                        value={formData.rol}
                        onChange={handleChange("rol")}
                    >
                        {ROLES.map((r) => (
                            <option key={r.value} value={r.value}>
                                {r.label}
                            </option>
                        ))}
                    </select>
                    {errors.rol && <div className="invalid-feedback">{errors.rol}</div>}
                </div>

                <div className="col-md-4">
                    <label className="form-label">Documento</label>
                    <input
                        className={`form-control ${errors.documento ? "is-invalid" : ""}`}
                        value={formData.documento}
                        onChange={handleChange("documento")}
                    />
                    {errors.documento && <div className="invalid-feedback">{errors.documento}</div>}
                </div>

                <div className="col-md-4">
                    <label className="form-label">Teléfono</label>
                    <input
                        className={`form-control ${errors.telefono ? "is-invalid" : ""}`}
                        value={formData.telefono}
                        onChange={handleChange("telefono")}
                    />
                    {errors.telefono && <div className="invalid-feedback">{errors.telefono}</div>}
                </div>

                <div className="col-md-4">
                    <label className="form-label">Código Postal (CP)</label>
                    <input
                        className={`form-control ${errors.cp ? "is-invalid" : ""}`}
                        value={formData.cp}
                        onChange={handleChange("cp")}
                    />
                    {errors.cp && <div className="invalid-feedback">{errors.cp}</div>}
                </div>

                <div className="col-md-4">
                    <label className="form-label">Localidad</label>
                    <input
                        className={`form-control ${errors.localidad ? "is-invalid" : ""}`}
                        value={formData.localidad}
                        onChange={handleChange("localidad")}
                    />
                    {errors.localidad && <div className="invalid-feedback">{errors.localidad}</div>}
                </div>

                <div className="col-md-4">
                    <label className="form-label">Domicilio</label>
                    <input
                        className={`form-control ${errors.domicilio ? "is-invalid" : ""}`}
                        value={formData.domicilio}
                        onChange={handleChange("domicilio")}
                    />
                    {errors.domicilio && <div className="invalid-feedback">{errors.domicilio}</div>}
                </div>

                <div className="col-12 d-flex gap-2 mt-2">
                    <button className="btn btn-primary" type="submit" disabled={loading}>
                        {loading ? "Registrando..." : "Registrarse"}
                    </button>
                    <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => navigate("/login")}
                        disabled={loading}
                    >
                        Volver al login
                    </button>
                </div>
            </form>
        </div>
    );
}
