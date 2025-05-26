import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function DetalleDenuncia() {
  const { id } = useParams();
  const [denuncia, setDenuncia] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/denuncia/traerDenuncia")


      .then(res => res.json())
      .then(data => {
        setDenuncia(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al cargar la denuncia:', error);
        setLoading(false);
      });
  }, [id]);

  
  if (loading) return <p>Cargando denuncia...</p>;
  if (!denuncia) return <p>No se encontró la denuncia.</p>;

  return (
    <div className='p-4'>
      <h2 className='text-2xl font-bold mb-4'>Detalle de la Denuncia</h2>

      <div className='mb-4'>
        <p><strong>ID:</strong> {denuncia.id}</p>
        <p><strong>Estado:</strong> {denuncia.estado}</p>
        <p><strong>Motivo:</strong> {denuncia.motivo}</p>
      </div>

      <div className='mb-4'>
        <h3 className='font-semibold'>Denunciante</h3>
        <p>{denuncia.denunciante?.nombre} - DNI: {denuncia.denunciante?.dni}</p>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold">Denunciado:</h3>
        <p>{denuncia.denunciado?.nombre} - CUIT: {denuncia.denunciado?.cuit}</p>
      </div>

      <div>
        <h3 className="font-semibold">Técnico:</h3>
        <p>{denuncia.tecnico?.nombre}</p>
      </div>
    </div>
  );
}

