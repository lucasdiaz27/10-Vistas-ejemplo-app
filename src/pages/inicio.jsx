import { BienvenidoSite } from "../components/BienvenidoSite";
import { ConsultaTuExpediente } from "../components/ConsultaTuExpediente";
import Requisitos from "../components/Requisitos";
export const Inicio = () => {
  
  return (
    <div>
    <div className="container-fluid px-0">
      <BienvenidoSite />
      <ConsultaTuExpediente />
    </div>

    <div>
      <Requisitos/>
    </div>
    </div>
    
  );
};

export default Inicio;
