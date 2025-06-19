import React from "react";
import { FaCheckCircle } from "react-icons/fa";

export const Requisitos = () => {
  const requi = [
    "Documentación relevante (factura, resumen de tarjeta, etc.)",
    "DNI del denunciante",
    "Constancia de reclamos previos",
    "Formulario de denuncia completo",
    "Copia de la primera y segunda hoja del DNI",
    "Comprobante que acredite la relación de consumo (factura, ticket, etc.)",
    "Otra documentación útil: presupuestos, garantía, servicio técnico, publicidades, etc.",
  ];
    return (
        <div className="container my-5">
        <h3 className="text-center fw-bold">REQUISITOS</h3>
    <div className="container my-5">
      <div className="card shadow-lg border-0">
        <div className="card-header bg-gradient bg-primary text-white text-center">
          <h4 className="mb-0">📄 Requisitos para realizar la denuncia</h4>
        </div>
        <div className="card-body p-4">
          <ul className="list-group list-group-flush">
            {requi.map((req, index) => (
              <li key={index} className="list-group-item d-flex align-items-start">
                <FaCheckCircle className="text-success me-2 mt-1" />
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
      </div>  
    )
};

export default Requisitos;