import { useState } from 'react';
import ListaDePases from './ListaDePases';
import VistaTarjetas from './VistaTarjetas';
import FormularioPaseModal from '../expedientes/modales/FormularioPaseModal';
import ModalVerPase from './modales/ModalVerPase';

export default function Pases() {
  const [vistaActiva, setVistaActiva] = useState('lista');

 
  const [modalState, setModalState] = useState({
    tipo: null, // 'nuevo', 'editar', 'ver'
    pase: null,
    expedienteId: null // Necesitaremos un ID de expediente
  });

  const cambiarVista = (vista) => setVistaActiva(vista);
  
 
  const abrirModal = (tipo, pase = null, expedienteId = null) => {
 
    setModalState({ tipo, pase, expedienteId });
  };
  
  const cerrarModal = () => setModalState({ tipo: null, pase: null, expedienteId: null });

  return (
    <div className="p-4 bg-white rounded shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Gestión de Pases</h2>
        
        {/* Este botón puede que no funcione si no tiene un 'expedienteId' */}
        <button className="btn btn-primary" onClick={() => abrirModal('nuevo')}>
          <i className="bi bi-plus-lg me-2"></i> Nuevo Pase (Revisar ID)
        </button>
      </div>

      <ul className="nav nav-tabs mb-3">
        {/* ... (tu código de Tabs sin cambios) ... */}
        <li className="nav-item">
          <button
            className={`nav-link ${vistaActiva === 'lista' ? 'active' : ''}`}
            onClick={() => cambiarVista('lista')}
          >
            <i className="bi bi-list me-1"></i> Lista de Pases
          </button>
        </li>
      </ul>

     
      {vistaActiva === 'lista' ? <ListaDePases abrirModal={abrirModal} /> : <VistaTarjetas abrirModal={abrirModal} />}

      
      {(modalState.tipo === 'nuevo' || modalState.tipo === 'editar') && (
        <FormularioPaseModal
          show={true}
          handleClose={cerrarModal}
          expedienteId={modalState.expedienteId}
          // (Necesitamos pasar el 'usuarioId' también)
          // usuarioId={...} 
          modo={modalState.tipo}
          pase={modalState.pase}
          // (Ya no pasamos 'onGuardar')
        />
      )}

      {/* El modal de 'Ver' sigue igual */}
      {modalState.tipo === 'ver' && <ModalVerPase onClose={cerrarModal} />}
    </div>
  );
}