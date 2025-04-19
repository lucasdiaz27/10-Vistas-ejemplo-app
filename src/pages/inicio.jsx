import { BienvenidoSite } from "../components/BienvenidoSite";
import { ConsultaTuExpediente } from "../components/ConsultaTuExpediente";
export const Inicio = () => {
  
  return (
    <div className="container-fluid px-0">
      <BienvenidoSite />
      <ConsultaTuExpediente />
    </div>
  );
};

export default Inicio;
