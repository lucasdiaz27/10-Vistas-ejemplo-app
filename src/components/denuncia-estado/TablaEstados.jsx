import React, { useEffect, useState } from 'react'
import { traerEstadoExpediente } from '../../apis/expedientesApi';

export const TablaEstados = ({nroExp}) => {

    const [estados, setEstados] = useState([])
    const formatearFecha = (fechaStr) => {
        const fecha = new Date(fechaStr);
        const dia = String(fecha.getDate()).padStart(2, '0');
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const anio = fecha.getFullYear();
        return `${dia}/${mes}/${anio}`;
    };

    useEffect(() => {
        if(!nroExp) return;
        //const token = localStorage.getItem("token");
        traerEstadoExpediente(nroExp)
            .then(data => setEstados(data))
            .catch(() => setEstados([]));
    }, [nroExp])

  return (
    <>
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th className="text-center">Estado</th>
                  <th className="text-center">Observación</th>
                  <th className="text-center">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {estados.length == 0 ? (
                    <tr>
                        <td colSpan={3} className='text-center'>No hay datos o el número no es correcto</td>
                    </tr>
                ) : 
                estados.map((estados, idx) => (
                    <tr key={idx}>
                        <td className='text-center'>{estados.estado}</td>
                        <td className='text-center'>{estados.observacion}</td>
                        <td className='text-center'>{formatearFecha(estados.fecha)}</td>
                    </tr>
                ))

                }
              </tbody>
            </table>
    
    </>
  )
}
