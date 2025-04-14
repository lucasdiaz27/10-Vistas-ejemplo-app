export const FormConsultas = () => {
    return (
        <div className="d-flex aling-items-center justify-content-center mt-5">
            <div className="card shadow p-4" style={{ maxWidth: '400px', width: '100%' }}>
                <h5 className="mb-4 text-center">Completa el formulario</h5>
                <form>
                    <div className="mb-3">
                        <label htmlFor="nombre" className="form-label">Nombre</label>
                        <input type="text" className="form-control" id="nombre" placeholder="Tu nombre" />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="correo" className="form-label">Correo</label>
                        <input type="email" className="form-control" id="correo" placeholder="tucorreo@mail.com" />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="motivo" className="form-label">Motivo de consulta</label>
                        <input type="text" className="form-control" id="motivo" placeholder="Motivo" />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="consulta" className="form-label">¿Cuál es tu consulta?</label>
                        <textarea className="form-control" id="consulta" rows="3" placeholder="Escribí tu consulta aquí"></textarea>
                    </div>

                    <button type="submit" className="btn bg-primary text-white w-100">ENVIAR</button>
                </form>
            </div>
        </div>
    )
}