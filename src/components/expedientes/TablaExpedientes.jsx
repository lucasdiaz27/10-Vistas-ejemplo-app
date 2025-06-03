// TablaExpedientes.jsx

import { useState } from 'react';
import ModalVerExpediente from './modales/ModalVerExpediente';
import ModalEditarExpediente from './modales/ModalEditarExpediente';

const datosEjemplo = [
  {
    id: 1,
    nroOrden: 'EXP-2023-00124',
    nombre: 'Martín González',
    dni: '28456789',
    tipo: 'Reclamo',
    fechaIngreso: '2023-11-15',
    estado: 'Pendiente'
  },
  {
    id: 2,
    nroOrden: 'EXP-2023-00123',
    nombre: 'Laura Fernández',
    dni: '33789456',
    tipo: 'Denuncia',
    fechaIngreso: '2023-11-14',
    estado: 'En proceso'
  },
  {
    id: 3,
    nroOrden: 'EXP-2023-00122',
    nombre: 'Carlos Rodríguez',
    dni: '25123789',
    tipo: 'Reclamo',
    fechaIngreso: '2023-11-12',
    estado: 'Finalizado'
  }
];

export default function TablaExpedientes({ filtro }) {
  const [modal, setModal] = useState(null); // 'ver' | 'editar'
  const [expedienteSeleccionado, setExpedienteSeleccionado] = useState(null);

  const abrirModal = (tipo, expediente) => {
    setExpedienteSeleccionado(expediente);
    setModal(tipo);
  };

  const cerrarModal = () => {
    setModal(null);
    setExpedienteSeleccionado(null);
  };

  const normalizado = filtro.toLowerCase();

  const datosFiltrados = datosEjemplo.filter(exp =>
    exp.nroOrden.toLowerCase().includes(normalizado) ||
    exp.nombre.toLowerCase().includes(normalizado) ||
    exp.dni.toLowerCase().includes(normalizado) ||
    exp.estado.toLowerCase().includes(normalizado) ||
    exp.tipo.toLowerCase().includes(normalizado)
  );

  const badgeEstado = (estado) => {
    const map = {
      'Pendiente': 'bg-warning text-dark',
      'En proceso': 'bg-info text-white',
      'Finalizado': 'bg-success'
    };
    return <span className={`badge ${map[estado]}`}>{estado}</span>;
  };

  return (
    <>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead className="table-light">
            <tr>
              <th>N° de orden</th>
              <th>Nombre</th>
              <th>DNI</th>
              <th>Tipo</th>
              <th>Fecha de ingreso</th>
              <th>Estado</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {datosFiltrados.map((exp) => (
              <tr key={exp.id}>
                <td>{exp.nroOrden}</td>
                <td>{exp.nombre}</td>
                <td>{exp.dni}</td>
                <td>{exp.tipo}</td>
                <td>{exp.fechaIngreso}</td>
                <td>{badgeEstado(exp.estado)}</td>
                <td className="text-end">
                  <div className="btn-group btn-group-sm">
                    <button
                      className="btn btn-outline-primary"
                      title="Ver expediente"
                      onClick={() => abrirModal('ver', exp)}
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
        {datosFiltrados.length === 0 && (
          <div className="alert alert-light text-center">No se encontraron resultados.</div>
        )}
      </div>

      {modal === 'ver' && expedienteSeleccionado && (
        <ModalVerExpediente expediente={expedienteSeleccionado} onClose={cerrarModal} />
      )}

      {modal === 'editar' && expedienteSeleccionado && (
        <ModalEditarExpediente expediente={expedienteSeleccionado} onClose={cerrarModal} />
      )}
    </>
  );
}
