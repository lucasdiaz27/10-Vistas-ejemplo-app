import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ModalEditarExpediente from './modales/ModalEditarExpediente';
import { traerExpedientes } from '../../apis/expedientesApi';

export default function TablaExpedientes({ filtro }) {
  const [expedientes, setExpedientes] = useState([]);
  const [modal, setModal] = useState(null);
  const [expedienteSeleccionado, setExpedienteSeleccionado] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExpedientes = async () => {
      try {
        const data = await traerExpedientes();
        setExpedientes(data);
      } catch (err) {
        console.error('Error al traer expedientes:', err);
      }
    };

    fetchExpedientes();
  }, []);

  const abrirModal = (tipo, expediente) => {
    setExpedienteSeleccionado(expediente);
    setModal(tipo);
  };

  const cerrarModal = () => {
    setModal(null);
    setExpedienteSeleccionado(null);
  };

  // Solo filtra por los campos que existen en la respuesta de la API
  const texto = filtro.trim().toLowerCase();
  const filtrados = texto
    ? expedientes.filter(exp =>
        (exp.nro_exp ?? '').toLowerCase().includes(texto) ||
        (exp.cant_folios?.toString() ?? '').toLowerCase().includes(texto) ||
        (exp.fecha_inicio ?? '').toLowerCase().includes(texto) ||
        (exp.fecha_finalizacion ?? '').toLowerCase().includes(texto) ||
        (exp.hipervulnerable ?? '').toLowerCase().includes(texto) ||
        (exp.delegacion ?? '').toLowerCase().includes(texto)
      )
    : expedientes;

  return (
    <>
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-primary">
            <tr>
              <th style={{ minWidth: 110 }}>N° de orden</th>
              <th style={{ minWidth: 90 }}>Cant. folios</th>
              <th style={{ minWidth: 130 }}>Fecha de ingreso</th>
              <th style={{ minWidth: 150 }}>Fecha de finalización</th>
              <th style={{ minWidth: 60, textAlign: 'center' }}>HV</th>
              <th style={{ minWidth: 110 }}>Delegación</th>
              <th className="text-end" style={{ minWidth: 110 }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((exp) => (
              <tr key={exp.id}>
                <td>{exp.nro_exp ?? exp.id ?? "-"}</td>
                <td>{exp.cant_folios ?? "-"}</td>
                <td>{exp.fecha_inicio ?? "-"}</td>
                <td>{exp.fecha_finalizacion ?? "-"}</td>
                <td className="text-center">{exp.hipervulnerable ?? "-"}</td>
                <td>{exp.delegacion ?? "-"}</td>
                <td className="text-end">
                  <div className="btn-group btn-group-sm">
                    <button
                      className="btn btn-outline-primary"
                      title="Ver expediente"
                      onClick={() => navigate(`/expedientes/${exp.id}`)}
                    >
                      <i className="bi bi-eye"></i>
                    </button>
                    <button
                      className="btn btn-outline-primary"
                      title="Editar expediente"
                      onClick={() => abrirModal('editar', exp)}
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtrados.length === 0 && (
          <div className="alert alert-light text-center">No se encontraron resultados.</div>
        )}
      </div>

      {modal === 'editar' && expedienteSeleccionado && (
        <ModalEditarExpediente expediente={expedienteSeleccionado} onClose={cerrarModal} />
      )}
    </>
  );
}
