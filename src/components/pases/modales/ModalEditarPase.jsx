export default function ModalEditarPase({ onClose }) {
  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editar Pase</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form>
              {/* Reutiliza mismos campos que NuevoPase, pero con valores cargados */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Expediente</label>
                  <input type="text" className="form-control" value="EXP-2023-00123" />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Fecha</label>
                  <input type="date" className="form-control" value="2023-05-15" />
                </div>
              </div>
              {/* Agregá los demás campos igual que en ModalNuevoPase */}
              {/* ... */}
            </form>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button className="btn btn-primary">Actualizar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
