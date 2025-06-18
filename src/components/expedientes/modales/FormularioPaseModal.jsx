// FormularioPaseModal.jsx
import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

export default function FormularioPaseModal({ show, handleClose, expedienteId, usuarioId }) {
    const [formData, setFormData] = useState({
        accion: '',
        fecha: '',
        area: '',
        tipo_tramite: '',
        descripcion: '',
    });

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = e => {
        e.preventDefault();
        // Aquí podés mandar formData + expedienteId + usuarioId a tu API
        console.log({ ...formData, expediente: expedienteId, usuario: usuarioId });
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Nuevo Pase</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Acción</Form.Label>
                        <Form.Control type="text" name="accion" value={formData.accion} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Fecha de Acción</Form.Label>
                        <Form.Control type="date" name="fecha" value={formData.fecha} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Área de Acción</Form.Label>
                        <Form.Control type="text" name="area" value={formData.area} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Tipo de Trámite</Form.Label>
                        <Form.Control type="text" name="tipo_tramite" value={formData.tipo_tramite} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control as="textarea" rows={3} name="descripcion" value={formData.descripcion} onChange={handleChange} required />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Guardar Pase
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
