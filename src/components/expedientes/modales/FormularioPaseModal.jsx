import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

import {
  fetchAreasEnum,
  addNewPase,
  updateExistingPase,
  fetchPasesByExpId
} from '../../../store/actions/pasesThunks';

import { contarPaginasPDF } from '../../../utils/contarPaginasPDF';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';


export default function FormularioPaseModal({ show, handleClose, expedienteId, usuarioId, modo = "crear", pase = null, onPaseGuardado }) {

  const dispatch = useDispatch();
  const { areas, status: pasesStatus, error: pasesError } = useSelector(state => state.pases);

  
  const { 
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm();
  
  const [usuarioActual, setUsuarioActual] = useState('');

  // (useEffect para el token - sin cambios)
  useEffect(() => {
    const token = localStorage.getItem('token');
    const tokenData = jwtDecode(token);
    const usuario = tokenData ? tokenData.name : 'Usuario Desconocido';
    setUsuarioActual(usuario);
    
    if (modo === 'crear') {
      setValue('iniciador', usuario);
    }
  }, [show, modo, setValue]); 

  // (useEffect para cargar Áreas y resetear el Form - sin cambios)
  useEffect(() => {
    if (show) {
      dispatch(fetchAreasEnum());
      
      if (modo === "editar" && pase) {
        reset(pase);
      } else {
        reset({
          iniciador: usuarioActual,
          asunto: '',
          areaOrigen: '',
          areaDestino: '',
          cantFolios: '',
          descripcion: '',
          tipoDocumento: 'MEMO',
          file: null,
        });
      }
    }
  }, [modo, pase, show, dispatch, reset, usuarioActual]);

  
  // (Lógica de conteo de páginas - sin cambios)
  const fileInput = watch("file");

  useEffect(() => {
    if (fileInput && fileInput.length > 0) {
      const file = fileInput[0];
      const countPages = async () => {
        try {
          const numPages = await contarPaginasPDF(file);
          setValue("cantFolios", numPages);
        } catch (err) {
          setValue("cantFolios", '');
          alert('No se pudo contar las páginas del PDF');
        }
      };
      countPages();
    } else if (modo === 'crear') {
      setValue("cantFolios", '');
    }
  }, [fileInput, setValue, modo]); 
  
  // (onSubmit - Aquí está el segundo cambio)
  const onSubmit = async (data) => {
    
    try {
      if (modo === "crear") {
        const formDataToSend = new FormData();
        const paseJson = JSON.stringify({
          asunto: data.asunto,
          cantFolios: Number(data.cantFolios),
          areaOrigen: data.areaOrigen,
          areaDestino: data.areaDestino,
          descripcion: data.descripcion,
          expedienteId: Number(expedienteId),
          usuarioId: Number(usuarioId),
          tipoDocumento: data.tipoDocumento
        });
        formDataToSend.append('pase', paseJson);
        
        if (data.file && data.file[0]) { 
          formDataToSend.append('file', data.file[0]);
        }
        
        await dispatch(addNewPase(formDataToSend)).unwrap();
        Swal.fire('¡Éxito!', 'Pase creado correctamente.', 'success');

      } else {
        const paseJson = {
          ...data,
          expedienteId: Number(expedienteId),
          usuarioId: Number(usuarioId),
          cantFolios: Number(data.cantFolios),
        };
        delete paseJson.file; 

        await dispatch(updateExistingPase({ id: pase.id, paseData: paseJson })).unwrap();
        Swal.fire('¡Actualizado!', 'Pase modificado correctamente.', 'success');
      }

      // --- Lógica Post-Submit ---
      
      // a) Refrescar Pases (Redux)
      dispatch(fetchPasesByExpId(expedienteId));
      
      // b) 🚀 CAMBIO 2: Refrescar Órdenes (Hook)
      if (onPaseGuardado) {
        onPaseGuardado();
      }

      // c) Cerrar modal
      handleClose();

    } catch (error) {
      Swal.fire('Error', error.message || 'No se pudo guardar el pase.', 'error');
    }
  };

  const isLoading = pasesStatus === 'loading';

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{modo === "editar" ? "Editar Pase" : "Nuevo Pase"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* --- Formulario (sin cambios) --- */}
        <Form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          
          {/* Campo Iniciador */}
          <Form.Group className="mb-3">
            <Form.Label>Iniciador</Form.Label>
            <Form.Control 
              type="text" 
              value={usuarioActual} 
              disabled 
              {...register("iniciador")} 
            />
          </Form.Group>
          
          {/* Campo Asunto */}
          <Form.Group className="mb-3">
            <Form.Label>Asunto</Form.Label>
            <Form.Control 
              type="text" 
              {...register("asunto", { required: "El asunto es obligatorio" })} 
              isInvalid={!!errors.asunto}
            />
            <Form.Control.Feedback type="invalid">
              {errors.asunto?.message}
            </Form.Control.Feedback>
          </Form.Group>
          
          {/* Campo Área Origen */}
          <Form.Group className="mb-3">
            <Form.Label>Área Origen</Form.Label>
            <Form.Select 
              {...register("areaOrigen", { required: "Seleccione un área de origen" })}
              isInvalid={!!errors.areaOrigen}
            >
              <option value="">Seleccionar área</option>
              {areas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.areaOrigen?.message}
            </Form.Control.Feedback>
          </Form.Group>
          
          {/* Campo Área Destino */}
          <Form.Group className="mb-3">
            <Form.Label>Área Destino</Form.Label>
            <Form.Select 
              {...register("areaDestino", { required: "Seleccione un área de destino" })}
              isInvalid={!!errors.areaDestino}
            >
              <option value="">Seleccionar área</option>
              {areas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.areaDestino?.message}
            </Form.Control.Feedback>
          </Form.Group>
          
          {/* Campo Archivo PDF (solo en modo crear) */}
          {modo !== "editar" && (
            <Form.Group className="mb-3">
              <Form.Label>Archivo PDF</Form.Label>
              <Form.Control 
                type="file" 
                accept="application/pdf" 
                {...register("file")} 
              />
            </Form.Group>
          )}

          {/* Campo Cantidad de Folios (ahora 'readOnly') */}
          <Form.Group className="mb-3">
            <Form.Label>Cantidad de Folios</Form.Label>
            <Form.Control 
              type="number" 
              {...register("cantFolios", { required: "Suba un PDF para contar los folios" })} 
              readOnly 
              isInvalid={!!errors.cantFolios}
            />
            <Form.Control.Feedback type="invalid">
              {errors.cantFolios?.message}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Campo Texto del Pase (Descripción) */}
          <Form.Group className="mb-3">
            <Form.Label>Texto del Pase</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={3} 
              {...register("descripcion", { required: "La descripción es obligatoria" })} 
              isInvalid={!!errors.descripcion}
            />
            <Form.Control.Feedback type="invalid">
              {errors.descripcion?.message}
            </Form.Control.Feedback>
          </Form.Group>
          
          {/* Campo Tipo de Documento */}
          <Form.Group className="mb-3">
            <Form.Label>Tipo de Documento</Form.Label>
            <Form.Select 
              {...register("tipoDocumento", { required: "Seleccione un tipo de documento" })}
              isInvalid={!!errors.tipoDocumento}
            >
              <option value="MEMO">MEMO</option>
              <option value="RESOLUCIÓN">RESOLUCIÓN</option>
              <option value="NOTA">NOTA</option>
              <option value="PROVIDENCIA">PROVIDENCIA</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.tipoDocumento?.message}
            </Form.Control.Feedback>
          </Form.Group>
          
          {/* Botón de envío */}
          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading
              ? 'Guardando...'
              : (modo === "editar" ? "Guardar Cambios" : "Guardar Pase")
            }
          </Button>

          {pasesError && (
            <div className="alert alert-danger mt-3">
              Error de Redux: {pasesError}
            </div>
          )}

        </Form>
      </Modal.Body>
    </Modal>
  );
}