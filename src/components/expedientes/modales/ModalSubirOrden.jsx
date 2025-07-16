import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function ModalSubirOrden({ show, onClose, onSubmitOrden, expedienteId }) {
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [ordenDto, setOrdenDto] = useState({
    tipoDocumento: '',
    expedienteId
  })

  const tiposDocumento = ["MEMO", "RESOLUCIÓN", "OFICIO", "NOTA"];

  const handleFileChange = (e) => setArchivo(e.target.files[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formDataOrden = new FormData();
    const ordenJson = JSON.stringify({
      tipoDocumento: ordenDto.tipoDocumento,
      expedienteId: ordenDto.expedienteId
    });
    formDataOrden.append('orden', ordenJson);

    if (archivo) {
      formDataOrden.append('file', archivo);
    } else {
      alert("Debe seleccionar un archivo.");
      return;
    }



    onSubmitOrden(formDataOrden);
    setTipoDocumento("");
    setArchivo(null);
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Subir Orden</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Tipo de Documento</Form.Label>
            <Form.Select
              value={ordenDto.tipoDocumento} 
              onChange={(e) => setOrdenDto({...ordenDto, tipoDocumento: e.target.value})}
              required
            >
              <option >Seleccione...</option>
              {tiposDocumento.map((tipo, idx) => (
                <option key={idx} value={tipo}>
                  {tipo}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Archivo</Form.Label>
            <Form.Control
              type="file"
              accept="application/pdf,image/*"
              onChange={handleFileChange}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            Subir Orden
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
