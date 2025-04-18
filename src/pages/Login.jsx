import './Login.css';





const Login = () => {
    return(
        <div className="login-container">
            <div className="login-box">
                <h2>INICIA SESION</h2>
                <form>
                    <div className="mb-3">
                        <label htmlFor="usuario" className="form-label">Usuario</label>
                        <input type="text" className="form-control" id="usuario" placeholder="Usuario" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="contraseña" className="form-label">Contraseña</label>
                        <input type="password" className="form-control" id="contraseña" placeholder="Contraseña" />
                    </div>
                    <button type="submit" className="btn btn-outline-light">INGRESAR</button>
                </form>
            </div>
        </div>
    )
}


export default Login;