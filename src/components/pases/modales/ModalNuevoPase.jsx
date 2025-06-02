export default function ModalNuevoPase({ onClose }) {
  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Nuevo Pase</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Expediente</label>
                  <input type="text" className="form-control" />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Fecha</label>
                  <input type="date" className="form-control" />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Iniciador</label>
                  <input type="text" className="form-control" />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Folios</label>
                  <input type="number" className="form-control" />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Asunto</label>
                <input type="text" className="form-control" />
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Origen</label>
                  <select className="form-select">
                    <option>Administración</option>
                    <option>Contabilidad</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Destino</label>
                  <select className="form-select">
                    <option>Dirección</option>
                    <option>Compras</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Texto del Pase</label>
                <textarea className="form-control" rows="3"></textarea>
              </div>

              <div className="mb-3">
                <label className="form-label">Estado</label>
                <select className="form-select">
                  <option>Pendiente</option>
                  <option>En proceso</option>
                  <option>Completado</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Adjuntar Archivos</label>
                <input type="file" className="form-control" multiple />
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button className="btn btn-primary">Guardar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
