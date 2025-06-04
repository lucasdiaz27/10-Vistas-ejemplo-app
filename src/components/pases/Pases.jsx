// Este archivo es el componente base: Pases.jsx
import { useState } from 'react';
import ListaDePases from './ListaDePases';
import VistaTarjetas from './VistaTarjetas';
import ModalNuevoPase from "./modales/ModalNuevoPase";
import ModalVerPase from './modales/ModalVerPase';
import ModalEditarPase from './modales/ModalEditarPase';

export default function Pases() {
  const [vistaActiva, setVistaActiva] = useState('lista');
  const [modal, setModal] = useState(null);

  const cambiarVista = (vista) => setVistaActiva(vista);
  const abrirModal = (tipo) => setModal(tipo);
  const cerrarModal = () => setModal(null);

  return (
    <div className="p-4 bg-white rounded shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Gestión de Pases</h2>
        <button className="btn btn-primary" onClick={() => abrirModal('nuevo')}>
          <i className="bi bi-plus-lg me-2"></i> Nuevo Pase
        </button>
      </div>

      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${vistaActiva === 'lista' ? 'active' : ''}`}
            onClick={() => cambiarVista('lista')}
          >
            <i className="bi bi-list me-1"></i> Lista de Pases
          </button>
        </li>
        {/*
        <li className="nav-item">
          <button
            className={`nav-link ${vistaActiva === 'tarjetas' ? 'active' : ''}`}
            onClick={() => cambiarVista('tarjetas')}
          >
            <i className="bi bi-grid me-1"></i> Vista Tarjetas
          </button>
        </li>
        */}
      </ul>

      {vistaActiva === 'lista' ? <ListaDePases abrirModal={abrirModal} /> : <VistaTarjetas abrirModal={abrirModal} />}

      {modal === 'nuevo' && <ModalNuevoPase onClose={cerrarModal} />}
      {modal === 'ver' && <ModalVerPase onClose={cerrarModal} />}
      {modal === 'editar' && <ModalEditarPase onClose={cerrarModal} />}
    </div>
  );
}

