import { FormConsultas } from "../components/FormConsultas";
import { ConsultaTexto } from "../components/ConsultaTexto";

const Consulta = () => {
    return (
        <div className="min-h-screen bg-neutral-100">
            <div class="row vh-100">
                <div className="col-6 d-flex align-items-center justify-content-center">
                    <ConsultaTexto />
                </div>

                <div className="col-6  align-items-center justify-content-center" >
                    <FormConsultas />
                </div>
            </div>
        </div>
    )
}

export default Consulta;