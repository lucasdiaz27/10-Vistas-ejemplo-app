import './Login.css';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../validations/loginSchema';
import { useNavigate } from 'react-router-dom';
import axios from "axios";


const Login = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit, 
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data) => {
        try {
            // nombres llave
            const payload = {
                email: data.usuario,
                password: data.contraseña,
            };

            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}auth/login`, payload);

            localStorage.setItem("token", response.data.access_token);
            navigate("/menu-interno?vista=mesa-entrada");
        } catch (error) {
            alert("Usuario o contraseña incorrectos");
        }
    };

    return ( 
        <div className="login-container">
            <div className="login-box">
                <h2>INICIA SESION</h2>
                <form onSubmit={handleSubmit(onSubmit)}> 
                    <div className="mb-3">
                        <label htmlFor="usuario" className="form-label">Usuario</label>
                        <input type="text" className="form-control" id="usuario" placeholder="Usuario" {...register("usuario")} />
                        {errors.usuario && <div className="text-danger">{errors.usuario.message}</div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="contraseña" className="form-label">Contraseña</label>
                        <input type="password" className="form-control" id="contraseña" placeholder="Contraseña" {...register("contraseña")} />
                        {errors.contraseña && <div className="text-danger">{errors.contraseña.message}</div>}
                    </div>
                    <button type="submit" className="btn btn-outline-light">INGRESAR</button>
                </form>
            </div>
        </div>
    );
};

export default Login;

// src/pages/Login.jsx
