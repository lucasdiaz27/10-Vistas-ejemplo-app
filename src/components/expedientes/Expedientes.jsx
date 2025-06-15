// Componente principal: Expedientes.jsx
import { useState, useEffect } from 'react';

import TablaExpedientes from './TablaExpedientes';
import { traerExpedientes } from '../../apis/expedientesApi';

export default function Expedientes() {
  const [busqueda, setBusqueda] = useState('');
  const [expedientes, setExpedientes] = useState([]);

  useEffect(() => {
    const fetchExpedientes = async () => {
      const data = await traerExpedientes();
      setExpedientes(data);
    };
    fetchExpedientes();
  }, []);

  // Función para eliminar duplicados por id
  const eliminarDuplicados = () => {
    const vistos = new Set();
    const unicos = [];
    for (const exp of expedientes) {
      if (!vistos.has(String(exp.id))) {
        unicos.push(exp);
        vistos.add(String(exp.id));
      }
    }
    setExpedientes(unicos);
  };

  return (
    <div className="p-4 bg-white rounded shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Gestión de Expedientes</h2>
        <div>
          <button className="btn btn-danger me-2" onClick={eliminarDuplicados}>
            <i className="bi bi-trash me-2"></i>Eliminar duplicados
          </button>
          <button className="btn btn-primary">
            <i className="bi bi-plus-lg me-2"></i> Nuevo Expediente
          </button>
        </div>
      </div>

      <div className="card p-3 mb-4">
        <div className="row g-3">
          <div className="col-md-8">
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
          <div className="col-md-4">
            <select className="form-select">
              <option>10 registros</option>
              <option>25 registros</option>
              <option>50 registros</option>
              <option>100 registros</option>
            </select>
          </div>
        </div>
      </div>

      <TablaExpedientes expedientes={expedientes} filtro={busqueda} />
    </div>
  );
}