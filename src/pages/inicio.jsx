import { useState } from "react";
import { BienvenidoSite } from "../components/BienvenidoSite";
import { ConsultaTuExpediente } from "../components/ConsultaTuExpediente";
import Requisitos from "../components/Requisitos";
import { Fab, Webchat } from "@botpress/webchat";
export const Inicio = () => {
  const [isWebchatOpen, setIsWebchatOpen] = useState(false);
  const toggleWebchat = () => {
    setIsWebchatOpen((prevState) => !prevState);
  };
  return (
    <>
      <div>
        <div className="container-fluid px-0">
          <BienvenidoSite />
          <ConsultaTuExpediente />
        </div>
        <div>
          <Requisitos />
        </div>
      </div>

      <Webchat
        clientId="339c584f-b9f4-4eb3-8af2-40f859ece33c" // Your client ID here
        style={{
          width: "400px",
          height: "600px",
          display: isWebchatOpen ? "flex" : "none",
          position: "fixed",
          zIndex: "999",
          bottom: "90px",
          right: "20px",
        }}
      />
      <Fab
        onClick={() => toggleWebchat()}
        style={{
          position: "fixed",
          width: "80px",
          height: "80px",
          bottom: "20px",
          right: "20px",
        }}
      />
    </>
  );
};

export default Inicio;
