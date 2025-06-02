export default function VistaTarjetas({ abrirModal }) {
  return (
    <div className="row">
      <div className="col-md-4 mb-4">
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title">EXP-2023-00123</h5>
            <h6 className="card-subtitle text-muted mb-2">15/05/2023</h6>
            <p>Solicitud de materiales</p>
            <div className="d-flex justify-content-between mb-2">
              <span><i className="bi bi-person"></i> Juan Pérez</span>
              <span><i className="bi bi-file-earmark"></i> 12 folios</span>
            </div>
            <div className="d-flex justify-content-between mb-3">
              <span className="badge bg-secondary">Administración</span>
              <i className="bi bi-arrow-right"></i>
              <span className="badge bg-secondary">Compras</span>
            </div>
            <div className="d-flex justify-content-between">
              <button className="btn btn-sm btn-outline-primary" onClick={() => abrirModal('ver')}>
                <i className="bi bi-eye"></i> Ver
              </button>
              <button className="btn btn-sm btn-outline-primary" onClick={() => abrirModal('editar')}>
                <i className="bi bi-pencil"></i> Editar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
