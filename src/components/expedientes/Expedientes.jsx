// Componente principal: Expedientes.jsx
import { useState } from 'react';

import TablaExpedientes from './TablaExpedientes';

export default function Expedientes() {
  const [busqueda, setBusqueda] = useState('');

  return (
    <div className="p-4 bg-white rounded shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Gestión de Expedientes</h2>
        <button className="btn btn-primary">
          <i className="bi bi-plus-lg me-2"></i> Nuevo Expediente
        </button>
      </div>
      <div className="bg-light border p-3 mb-0" style={{ borderTopLeftRadius: '0.5rem', borderTopRightRadius: '0.5rem', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
        <div className="row g-3 align-items-center">
          <div className="col-md-8 col-12 mb-2 mb-md-0">
            <div className="position-relative">
              <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
              <input
                type="text"
                className="form-control ps-5"
                placeholder="Buscar por N° de orden, Cant. folios, Fecha de ingreso, Fecha de finalización, Hipervulnerable, Delegación..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4 col-12 d-flex justify-content-md-end justify-content-start gap-2">
            <select className="form-select">
              <option>10 registros</option>
              <option>25 registros</option>
              <option>50 registros</option>
              <option>100 registros</option>
            </select>
          </div>
        </div>
      </div>
      <div style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, borderBottomLeftRadius: '0.5rem', borderBottomRightRadius: '0.5rem', overflow: 'hidden' }}>
        <TablaExpedientes filtro={busqueda} />
      </div>
    </div>
  );
}