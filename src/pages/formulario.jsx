import { useState } from 'react';

function formulario() {
  const [formularioEnviado, setFormularioEnviado] = useState(false);

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container mt-5">
        
        <h2 className="text-center mb-4">Formulario de Expedientes</h2>
        {formularioEnviado && (
  <div className="alert alert-success text-center" role="alert">
    Formulario enviado
  </div>
)}

        <p className="text-center">Completar Formulario con los siguientes datos:</p>

        <div className="row">
          {/* Columna empresa */}
          <div className="col-md-6 mb-4">
            <div className="bg-white p-4 rounded shadow">
              <h5>Datos de la empresa:</h5>

              <div className="mb-3">
                <label htmlFor="nombreEmpresa" className="form-label">Nombre o razón social</label>
                <input type="text" className="form-control" id="nombreEmpresa" placeholder="Ingrese el nombre o razón social" />
              </div>
              <div className="mb-3">
                <label htmlFor="dniEmpresa" className="form-label">DNI/CUIT</label>
                <input type="number" className="form-control" id="dniEmpresa" placeholder="Ingrese DNI o CUIT" />
              </div>
              <div className="mb-3">
                <label htmlFor="domicilioEmpresa" className="form-label">Domicilio</label>
                <input type="text" className="form-control" id="domicilioEmpresa" placeholder="Ingrese el domicilio" />
              </div>
              <div className="mb-3">
                <label htmlFor="localidadEmpresa" className="form-label">Localidad</label>
                <input type="text" className="form-control" id="localidadEmpresa" placeholder="Ingrese la localidad" />
              </div>
              <div className="mb-3">
                <label htmlFor="postalEmpresa" className="form-label">Código postal</label>
                <input type="number" className="form-control" id="postalEmpresa" placeholder="Ingrese el código postal" />
              </div>
              <div className="mb-3">
                <label htmlFor="telefonoEmpresa" className="form-label">Teléfono</label>
                <input type="number" className="form-control" id="telefonoEmpresa" placeholder="Ingrese el teléfono" />
              </div>
              <div className="mb-3">
                <label htmlFor="emailEmpresa" className="form-label">Email</label>
                <input type="email" className="form-control" id="emailEmpresa" placeholder="Ingrese el email" />
              </div>
              <div className="mb-3">
                <label htmlFor="faxEmpresa" className="form-label">Fax</label>
                <input type="number" className="form-control" id="faxEmpresa" placeholder="Ingrese el fax" />
              </div>
            </div>
          </div>

          {/* Columna fabricante */}
          <div className="col-md-6 mb-4">
            <div className="bg-white p-4 rounded shadow">
              <h5>Datos del fabricante:</h5>

              <div className="mb-3">
                <label htmlFor="nombreFabricante" className="form-label">Nombre o razón social</label>
                <input type="text" className="form-control" id="nombreFabricante" placeholder="Ingrese el nombre o razón social" />
              </div>
              <div className="mb-3">
                <label htmlFor="dniFabricante" className="form-label">DNI/CUIT</label>
                <input type="number" className="form-control" id="dniFabricante" placeholder="Ingrese DNI o CUIT" />
              </div>
              <div className="mb-3">
                <label htmlFor="domicilioFabricante" className="form-label">Domicilio</label>
                <input type="text" className="form-control" id="domicilioFabricante" placeholder="Ingrese el domicilio" />
              </div>
              <div className="mb-3">
                <label htmlFor="localidadFabricante" className="form-label">Localidad</label>
                <input type="text" className="form-control" id="localidadFabricante" placeholder="Ingrese la localidad" />
              </div>
              <div className="mb-3">
                <label htmlFor="postalFabricante" className="form-label">Código postal</label>
                <input type="number" className="form-control" id="postalFabricante" placeholder="Ingrese el código postal" />
              </div>
              <div className="mb-3">
                <label htmlFor="telefonoFabricante" className="form-label">Teléfono</label>
                <input type="number" className="form-control" id="telefonoFabricante" placeholder="Ingrese el teléfono" />
              </div>
              <div className="mb-3">
                <label htmlFor="emailFabricante" className="form-label">Email</label>
                <input type="email" className="form-control" id="emailFabricante" placeholder="Ingrese el email" />
              </div>
              <div className="mb-3">
                <label htmlFor="faxFabricante" className="form-label">Fax</label>
                <input type="number" className="form-control" id="faxFabricante" placeholder="Ingrese el fax" />
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-5 mb-4">
            <div className="bg-white p-4 rounded shadow">
              <h5>Objeto de reclamo</h5>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="cambioProducto" />
                <label className="form-check-label" htmlFor="cambioProducto">Cambio de producto</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="bonificacion" />
                <label className="form-check-label" htmlFor="bonificacion">Bonificacion</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="reparacion" />
                <label className="form-check-label" htmlFor="reparacion">Reparacion</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="devolucion" />
                <label className="form-check-label" htmlFor="devolucion">Devolucion de dinero</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="anulacion" />
                <label className="form-check-label" htmlFor="anulacion">Anulacion de contrato</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="otroObjeto" />
                <label className="form-check-label" htmlFor="otroObjeto">Otro</label>
              </div>
            </div>
            <div className="bg-white p-4 rounded shadow mt-3">
              <h5>Motivo del reclamo</h5>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="problemaServicio" />
                <label className="form-check-label" htmlFor="problemaServicio">Problemas con el servicio</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="publicidad" />
                <label className="form-check-label" htmlFor="publicidad">Publicidad engañosa</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="producto" />
                <label className="form-check-label" htmlFor="producto">Producto defectuoso</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="garantia" />
                <label className="form-check-label" htmlFor="garantia">Problemas con la garantia</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="facturacion" />
                <label className="form-check-label" htmlFor="facturacion">Problemas con la facturacion</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="documentacion" />
                <label className="form-check-label" htmlFor="documentacion">Falta de documentacion</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="intereses" />
                <label className="form-check-label" htmlFor="intereses">Intereses abusivos</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="contrato" />
                <label className="form-check-label" htmlFor="contrato">Incumplimiento de contrato</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="trato" />
                <label className="form-check-label" htmlFor="trato">Trato indigno</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="precios" />
                <label className="form-check-label" htmlFor="precios">Diferencia de precios</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="otroObjetos" />
                <label className="form-check-label" htmlFor="otroObjetos">otro</label>
              </div>
              
            </div>
          </div>
          <div className="col-md-7 mb-4">
            <div className="bg-white p-4 rounded shadow">
              <h5>Datos del tecnico</h5>
              <div className="mb-3">
                <label htmlFor="nombreTecnico" className="form-label">Nombre o razón social</label>
                <input type="text" className="form-control" id="nombreTecnico" placeholder="Ingrese el nombre o razón social" />
              </div>
              <div className="mb-3">
                <label htmlFor="dniTecnico" className="form-label">DNI/CUIT</label>
                <input type="number" className="form-control" id="dniTecnico" placeholder="Ingrese DNI o CUIT" />
              </div>
              <div className="mb-3">
                <label htmlFor="domicilioTecnico" className="form-label">Domicilio</label>
                <input type="text" className="form-control" id="domicilioTecnico" placeholder="Ingrese el domicilio" />
              </div>
              <div className="mb-3">
                <label htmlFor="localidadTecnico" className="form-label">Localidad</label>
                <input type="text" className="form-control" id="localidadTecnico" placeholder="Ingrese la localidad" />
              </div>
              <div className="mb-3">
                <label htmlFor="postalTecnico" className="form-label">Código postal</label>
                <input type="number" className="form-control" id="postalTecnico" placeholder="Ingrese el código postal" />
              </div>
              <div className="mb-3">
                <label htmlFor="telefonoTecnico" className="form-label">Teléfono</label>
                <input type="number" className="form-control" id="telefonoTecnico" placeholder="Ingrese el teléfono" />
              </div>
              <div className="mb-3">
                <label htmlFor="emailTecnico" className="form-label">Email</label>
                <input type="email" className="form-control" id="emailTecnico" placeholder="Ingrese el email" />
              </div>
              <div className="mb-3">
                <label htmlFor="faxTecnico" className="form-label">Fax</label>
                <input type="number" className="form-control" id="faxTecnico" placeholder="Ingrese el fax" />
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-4">
          <button type="button" className="btn btn-success" onClick={() => setFormularioEnviado(true)}>Enviar formulario</button>
        </div>

      </div>
    </div>
  );
}

export default formulario;