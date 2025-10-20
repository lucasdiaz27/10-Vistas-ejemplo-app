// src/components/expedientes/modales/FormularioPaseModal.jsx

import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { addNewPase, updateExistingPase, fetchPasesByExpId } from '../../../features/pases/pasesThunks';
import Swal from 'sweetalert2';
import { obtenerAreasEnum } from '../../../apis/pasesApi';
import { contarPaginasPDF } from '../../../utils/contarPaginasPDF';

const initialStateForm = {
    iniciador: '', asunto: '', areaOrigen: '', areaDestino: '',
    cantFolios: '', descripcion: '', tipoDocumento: 'MEMO', file: null,
};

export default function FormularioPaseModal({ show, handleClose, expedienteId, modo = "crear", paseInicial }) {
    
    const dispatch = useDispatch();
    const [formData, setFormData] = useState(initialStateForm);
    const [areas, setAreas] = useState([]);
    const [usuarioActual, setUsuarioActual] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (show) {
            const token = localStorage.getItem('token');
            if (token) {
                const tokenData = jwtDecode(token);
                setUsuarioActual(tokenData ? tokenData.name : 'Usuario Desconocido');
            }
        }
    }, [show]);

    useEffect(() => {
        const fetchAreas = async () => {
            const token = localStorage.getItem('token');
            try {
                const areasBackend = await obtenerAreasEnum(token);
                setAreas(areasBackend);
            } catch (err) {
                setAreas([]);
            }
        };
        if (show) fetchAreas();
    }, [show]);

    useEffect(() => {
        if (show) {
            if (modo === "editar" && paseInicial) {
                setFormData({
                    asunto: paseInicial.asunto ?? '',
                    areaOrigen: paseInicial.areaOrigen ?? '',
                    areaDestino: paseInicial.areaDestino ?? '',
                    cantFolios: paseInicial.cantFolios ?? '',
                    descripcion: paseInicial.descripcion ?? '',
                    tipoDocumento: paseInicial.tipoDocumento ?? 'MEMO',
                    file: null,
                });
            } else {
                setFormData(initialStateForm);
            }
        }
    }, [modo, paseInicial, show]);

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = async e => {
        const file = e.target.files[0];
        if (file) {
            try {
                const numPages = await contarPaginasPDF(file);
                setFormData(prev => ({ ...prev, file, cantFolios: numPages }));
            } catch (err) {
                setFormData(prev => ({ ...prev, file: null, cantFolios: '' }));
                Swal.fire('Error', 'No se pudo procesar el archivo PDF.', 'error');
            }
        } else {
            setFormData(prev => ({ ...prev, file: null, cantFolios: '' }));
        }
    };

    const handleSubmit = e => {
        e.preventDefault();
        setIsSubmitting(true);

        let userId = null;
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                userId = decodedToken.jti;
            } catch (error) {
                console.error("Error al decodificar el token:", error);
                Swal.fire('Error', 'Tu sesión no es válida. Por favor, volvé a iniciar sesión.', 'error');
                setIsSubmitting(false);
                return;
            }
        }

        const paseJsonData = {
            asunto: formData.asunto,
            cantFolios: Number(formData.cantFolios),
            areaOrigen: formData.areaOrigen,
            areaDestino: formData.areaDestino,
            descripcion: formData.descripcion,
            expedienteId: Number(expedienteId),
            usuarioId: Number(userId),
            tipoDocumento: formData.tipoDocumento
        };
        
        const action = modo === 'crear' 
            ? addNewPase({ paseData: paseJsonData, file: formData.file }) 
            : updateExistingPase({ id: paseInicial.id, paseData: paseJsonData, file: formData.file });

        dispatch(action)
            .unwrap()
            .then(() => {
                Swal.fire('¡Éxito!', `Pase ${modo === 'crear' ? 'creado' : 'actualizado'} correctamente.`, 'success');
                handleClose();
                dispatch(fetchPasesByExpId(expedienteId));
            })
            .catch((error) => {
                Swal.fire('Error', `No se pudo guardar el pase: ${error.message || error}`, 'error');
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    if (!show) return null;

    return (
        <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>{modo === "editar" ? "Editar Pase" : "Nuevo Pase"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Iniciador</Form.Label>
                        <Form.Control type="text" value={usuarioActual} disabled />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                        <Form.Label>Asunto</Form.Label>
                        <Form.Control type="text" name="asunto" value={formData.asunto || ''} onChange={handleChange} required />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                        <Form.Label>Área Origen</Form.Label>
                        <Form.Select name="areaOrigen" value={formData.areaOrigen || ''} onChange={handleChange} required>
                            <option value="">Seleccionar área</option>
                            {areas.map(area => <option key={area} value={area}>{area}</option>)}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Área Destino</Form.Label>
                        <Form.Select name="areaDestino" value={formData.areaDestino || ''} onChange={handleChange} required>
                            <option value="">Seleccionar área</option>
                            {areas.map(area => <option key={area} value={area}>{area}</option>)}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Archivo PDF (Opcional)</Form.Label>
                        <Form.Control type="file" accept="application/pdf" onChange={handleFileChange} />
                        {formData.cantFolios && <Form.Text>{formData.cantFolios} página(s) detectada(s).</Form.Text>}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Texto del Pase</Form.Label>
                        <Form.Control as="textarea" rows={3} name="descripcion" value={formData.descripcion || ''} onChange={handleChange} required />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                        <Form.Label>Tipo de Documento</Form.Label>
                        <Form.Select name="tipoDocumento" value={formData.tipoDocumento || 'MEMO'} onChange={handleChange} required>
                            <option value="MEMO">MEMO</option>
                            <option value="RESOLUCIÓN">RESOLUCIÓN</option>
                            <option value="NOTA">NOTA</option>
                            <option value="PROVIDENCIA">PROVIDENCIA</option>
                        </Form.Select>
                    </Form.Group>

                    <div className="d-flex justify-content-end">
                        <Button variant="secondary" onClick={handleClose} disabled={isSubmitting} className="me-2">
                            Cancelar
                        </Button>
                        <Button variant="primary" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Guardando...' : (modo === "editar" ? "Guardar Cambios" : "Guardar Pase")}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

