// ModalVerExpediente.jsx

export default function ModalVerExpediente({ onClose, expediente }) {
  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Detalle del Expediente</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p><strong>N° de orden:</strong> {expediente.nroOrden}</p>
            <p><strong>Nombre:</strong> {expediente.nombre}</p>
            <p><strong>DNI:</strong> {expediente.dni}</p>
            <p><strong>Tipo:</strong> {expediente.tipo}</p>
            <p><strong>Fecha de ingreso:</strong> {expediente.fechaIngreso}</p>
            <p><strong>Estado:</strong> {expediente.estado}</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
