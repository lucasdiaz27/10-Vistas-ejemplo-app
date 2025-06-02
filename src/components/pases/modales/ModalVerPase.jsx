export default function ModalVerPase({ onClose }) {
  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Detalle del Pase</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p><strong>Expediente:</strong> EXP-2023-00123</p>
            <p><strong>Fecha:</strong> 15/05/2023</p>
            <p><strong>Iniciador:</strong> Juan Pérez</p>
            <p><strong>Asunto:</strong> Solicitud de materiales</p>
            <p><strong>Origen:</strong> Administración</p>
            <p><strong>Destino:</strong> Compras</p>
            <p><strong>Folios:</strong> 12</p>
            <p><strong>Estado:</strong> Completado</p>
            <p><strong>Texto del Pase:</strong> Se solicita la compra de materiales de oficina...</p>

            <hr />
            <p className="fw-bold">Adjuntos</p>
            <ul>
              <li>Listado_materiales.pdf <button className="btn btn-sm btn-outline-primary ms-2"><i className="bi bi-download"></i></button></li>
              <li>Presupuesto.xlsx <button className="btn btn-sm btn-outline-primary ms-2"><i className="bi bi-download"></i></button></li>
            </ul>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
