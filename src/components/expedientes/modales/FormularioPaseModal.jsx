// FormularioPaseModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function getTodayISO() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

export default function FormularioPaseModal({ show, handleClose, expedienteId, usuarioId, modo = "crear", pase = null, onGuardar }) {
    const [formData, setFormData] = useState({
        accion: '',
        fechaAccion: '',
        areaAccion: '',
        tipoTramite: '',
        descripcion: '',
    });

    useEffect(() => {
        if (modo === "editar" && pase) {
            setFormData({
                accion: pase.accion || '',
                fechaAccion: pase.fechaAccion || '',
                areaAccion: pase.areaAccion || '',
                tipoTramite: pase.tipoTramite || '',
                descripcion: pase.descripcion || '',
            });
        } else if (show) {
            setFormData({
                accion: '',
                fechaAccion: getTodayISO(),
                areaAccion: '',
                tipoTramite: '',
                descripcion: '',
            });
        }
    }, [modo, pase, show]);

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = e => {
        e.preventDefault();
        const paseData = {
            ...formData,
            expedienteId,
            usuarioId,
        };
        onGuardar(paseData);
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{modo === "editar" ? "Editar Pase" : "Nuevo Pase"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Acción</Form.Label>
                        <Form.Control type="text" name="accion" value={formData.accion} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Fecha de Acción</Form.Label>
                        <Form.Control type="date" name="fechaAccion" value={formData.fechaAccion} onChange={handleChange} required min={getTodayISO()} max={getTodayISO()} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Área de Acción</Form.Label>
                        <Form.Control type="text" name="areaAccion" value={formData.areaAccion} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Tipo de Trámite</Form.Label>
                        <Form.Control type="text" name="tipoTramite" value={formData.tipoTramite} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control as="textarea" rows={3} name="descripcion" value={formData.descripcion} onChange={handleChange} required />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        {modo === "editar" ? "Guardar Cambios" : "Guardar Pase"}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
