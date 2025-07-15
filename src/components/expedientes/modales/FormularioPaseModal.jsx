// FormularioPaseModal.jsx
// Este componente gestiona el formulario para crear/editar pases, incluyendo la subida de PDF y el conteo de páginas
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { obtenerAreasEnum } from '../../../apis/pasesApi';
import { contarPaginasPDF } from '../../../utils/contarPaginasPDF';
import { jwtDecode } from 'jwt-decode';

// Devuelve la fecha actual en formato ISO (YYYY-MM-DD)

function getTodayISO() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

export default function FormularioPaseModal({ show, handleClose, expedienteId, usuarioId, modo = "crear", pase = null, onGuardar }) {

    const [usuarioActual, setUsuarioActual] = useState(''); // Usuario actual decodificado del token

    // Estado del formulario, incluye todos los campos requeridos
    const [formData, setFormData] = useState({
        iniciador: '',
        asunto: '',
        areaOrigen: '',
        areaDestino: '',
        cantFolios: '',
        descripcion: '',
        tipoDocumento: 'MEMO',
        file: null,
    });
    const [areas, setAreas] = useState([]); // Áreas dinámicas desde backend

    useEffect(() => {
        const token = localStorage.getItem('token');
        const tokenData = jwtDecode(token);
        const usuarioActual = tokenData ? tokenData.name : 'Usuario Desconocido';
        setUsuarioActual(usuarioActual);
    })
    // Cargar áreas desde backend al abrir el modal
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

    // Actualiza el formulario según el modo (crear/editar) y los datos del pase
    useEffect(() => {
        if (modo === "editar" && pase) {
            setFormData({
                iniciador: pase.iniciador || '',
                asunto: pase.asunto || '',
                areaOrigen: pase.areaOrigen || '',
                areaDestino: pase.areaDestino || '',
                cantFolios: pase.cantFolios || '',
                descripcion: pase.descripcion || '',
                tipoDocumento: pase.tipoDocumento || 'MEMO', // Mantiene el valor si existe
                file: null, // No se puede editar el archivo
            });
        } else if (show) {
            setFormData({
                iniciador: '',
                asunto: '',
                areaOrigen: '',
                areaDestino: '',
                cantFolios: '',
                descripcion: '',
                tipoDocumento: 'MEMO',
                file: null,
            });
        }
    }, [modo, pase, show]);

    // Maneja los cambios en los campos del formulario
    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Maneja la subida de archivo PDF y cuenta las páginas
    const handleFileChange = async e => {
        const file = e.target.files[0];
        if (file) {
            try {
                const numPages = await contarPaginasPDF(file);
                setFormData(prev => ({ ...prev, file, cantFolios: numPages }));
            } catch (err) {
                setFormData(prev => ({ ...prev, file, cantFolios: '' }));
                alert('No se pudo contar las páginas del PDF');
            }
        } else {
            setFormData(prev => ({ ...prev, file: null, cantFolios: '' }));
        }
    };

    // Envía el formulario al backend como form-data (pase y file)
    const handleSubmit = e => {
        e.preventDefault();
        const formDataToSend = new FormData();
        // El JSON del pase va como string bajo la key "pase"
        const paseJson = JSON.stringify({
            asunto: formData.asunto,
            cantFolios: Number(formData.cantFolios), // Asegura tipo Long
            areaOrigen: formData.areaOrigen, // Debe coincidir con ENUM
            areaDestino: formData.areaDestino, // Debe coincidir con ENUM
            descripcion: formData.descripcion,
            expedienteId: Number(expedienteId), // Asegura tipo Long
            usuarioId: Number(usuarioId), // Asegura tipo Long
            tipoDocumento: formData.tipoDocumento // Debe coincidir con ENUM
        });
        
        formDataToSend.append('pase', paseJson);
        // El archivo PDF va bajo la key "file"
        if (formData.file) formDataToSend.append('file', formData.file);
        // LOG para depuración
        console.log('JSON enviado:', paseJson);
        if (formData.file) {
            console.log('Archivo PDF:', formData.file.name, formData.file.size, formData.file.type);
        } else {
            console.log('Sin archivo PDF');
        }
        onGuardar(formDataToSend);
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{modo === "editar" ? "Editar Pase" : "Nuevo Pase"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit} encType="multipart/form-data">
                    {/* Campo Iniciador */}
                    <Form.Group className="mb-3">
                        <Form.Label>Iniciador</Form.Label>
                        <Form.Control type="text" name="iniciador" value={usuarioActual} disabled onChange={handleChange} required />
                    </Form.Group>
                    {/* Campo Asunto */}
                    <Form.Group className="mb-3">
                        <Form.Label>Asunto</Form.Label>
                        <Form.Control type="text" name="asunto" value={formData.asunto} onChange={handleChange} required />
                    </Form.Group>
                    {/* Campo Área Origen (select con opciones del backend) */}
                    <Form.Group className="mb-3">
                        <Form.Label>Área Origen</Form.Label>
                        <Form.Select name="areaOrigen" value={formData.areaOrigen} onChange={handleChange} required>
                            <option value="">Seleccionar área</option>
                            {areas.map(area => (
                                <option key={area} value={area}>{area}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    {/* Campo Área Destino (select con opciones del backend) */}
                    <Form.Group className="mb-3">
                        <Form.Label>Área Destino</Form.Label>
                        <Form.Select name="areaDestino" value={formData.areaDestino} onChange={handleChange} required>
                            <option value="">Seleccionar área</option>
                            {areas.map(area => (
                                <option key={area} value={area}>{area}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    {/* Campo para subir PDF y contar folios */}
                    <Form.Group className="mb-3">
                        <Form.Label>Archivo PDF</Form.Label>
                        <Form.Control type="file" accept="application/pdf" onChange={handleFileChange} />
                    </Form.Group>
                    {/* Campo Texto del Pase (Descripción) */}
                    <Form.Group className="mb-3">
                        <Form.Label>Texto del Pase</Form.Label>
                        <Form.Control as="textarea" rows={3} name="descripcion" value={formData.descripcion} onChange={handleChange} required />
                    </Form.Group>
                    {/* Campo Tipo de Documento (select) */}
                    <Form.Group className="mb-3">
                        <Form.Label>Tipo de Documento</Form.Label>
                        <Form.Select name="tipoDocumento" value={formData.tipoDocumento} onChange={handleChange} required>
                            <option value="MEMO">MEMO</option>
                            <option value="RESOLUCIÓN">RESOLUCIÓN</option>
                            <option value="NOTA">NOTA</option>
                            <option value="PROVIDENCIA">PROVIDENCIA</option>
                        </Form.Select>
                    </Form.Group>
                    {/* Botón de envío */}
                    <Button variant="primary" type="submit">
                        {modo === "editar" ? "Guardar Cambios" : "Guardar Pase"}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
