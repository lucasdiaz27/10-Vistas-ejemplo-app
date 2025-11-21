import { useState } from "react";
import ReactQuill from "react-quill";
import { pdf } from "@react-pdf/renderer";
import { DocumentoPDF } from "./DocumentoPDF";
import "react-quill/dist/quill.snow.css";

const textosPredeterminados = {
  dictamen: `
    <p><strong>EXPTE. Nº</strong></p>
    <p><strong>A LA DIRECCIÓN GENERAL DE COMERCIO</strong><br/>Su despacho.</p>

    <p>
      Que viene a esta Asesoría Jurídica, el expediente de marras y que del análisis de la denuncia 
      efectuada por el Sr./Sra. <span style="border-bottom:1px solid #000; padding:2px 40px;"></span>, 
      siendo que los mismos a prima facie se encuentran encuadrados en una relación de consumo, es que esta 
      Asesoría Letrada considera apropiado, salvo mejor y más elevado criterio de la Superioridad, 
      <strong>SE DE INICIO AL PROCEDIMIENTO ADMINISTRATIVO</strong>, previsto en la Ley N° 7.148, refrendada 
      por Decreto Provincial N° 373/14; no hallándose impedimento de índole legal, al tenor de la denuncia 
      y la documental aportada, sin perjuicio de que en mérito de la complejidad del caso en crisis, pueda 
      ser remitido de oficio estos actuados a la Autoridad Competente o ser desestimada in-limine por 
      resolución fundada.
    </p>

    <p>
      Que según lo establecido en <strong>RESOL-2022-13-E-GDESDEDGR#MEC</strong>, referente Tasa Retributiva de Servicio, 
      se debe cumplir con el articulado de Tasa Gral. de Actuación y de Dirección Gral. de Comercio, para el 
      curso del presente expediente.
    </p>

    <p>
      Por lo expuesto, se sugiere que se corra traslado a las partes y se fije audiencia de conciliación, 
      citándose a las partes en conflicto.
    </p>

    <br/><br/>
    <p><strong>ASESORÍA LEGAL</strong><br/>DIRECCIÓN GENERAL DE COMERCIO</p>`,
  providencia: `
    <p><strong>PROVIDENCIA SIMPLE</strong></p>
    <p>Atento al estado de autos, agréguese la documentación acompañada y téngase presente para su oportunidad.</p>
    <p>Pase las actuaciones a despacho para resolver lo que por derecho corresponda.</p>
  `,
  decreto: `
    <p><strong>DECRETO</strong></p>
    <p><strong>REF. EXPTE. N°</strong> <span style="border-bottom:1px solid #000; padding:2px 50px;"></span></p>

    <p>
      Santiago Del Estero, <span style="border-bottom:1px solid #000; padding:0 40px;"></span> de 
      <span style="border-bottom:1px solid #000; padding:0 40px;"></span> de 2025.
    </p>

    <p>
      Atento a lo dispuesto por el Art. 26 del Decreto N° 373/2014 ratificado por Ley Provincial N° 7.148, 
      cítesé a las partes a los fines de que comparezcan a esta Dirección General de Comercio 
      (Dpto. Defensa del Consumidor), sito en calle 25 de Mayo N° 35 de la Ciudad Capital de la Provincia de 
      Santiago Del Estero, el día 
      <span style="border-bottom:1px solid #000; padding:0 40px;"></span> de 
      <span style="border-bottom:1px solid #000; padding:0 40px;"></span> de 
      <span style="border-bottom:1px solid #000; padding:0 40px;"></span> a las 
      <span style="border-bottom:1px solid #000; padding:0 40px;"></span> hs., para que tenga lugar la 
      Audiencia de Conciliación.
    </p>

    <br/><br/><br/>
    <p><span style="border-top:1px solid #000; padding-top:4px;">Firma / Cargo</span></p>
  `,
  imputacion: `
    <p style="text-align: right;">
    Santiago del Estero, ____ de _________ de _______.-
</p>

<p><strong>REF: EXPEDIENTE: Nº</strong></p>

<p>
    De conformidad con los hechos denunciados, a la documentación acompañada y a las constancias de autos, corresponde 
    <strong>DAR POR CONCLUIDA LA PRESENTE INSTANCIA CONCILIATORIA</strong>, acorde a lo dispuesto en los arts. 26 y 32 
    del ANEXO 1 DEL DECRETO PROVINCIAL Nº 373/2.014 DE IMPLEMENTACIÓN Y DE PROCEDIMIENTO PARA LA DEFENSA DE LOS 
    DERECHOS Y GARANTÍAS DE LOS CONSUMIDORES Y USUARIOS EN LA PCIA. DE SANTIAGO DEL ESTERO RATIFICADO POR LEY 7.148, 
    teniendo en cuenta que no concluyera, en esta etapa, un acuerdo conciliatorio entre las partes.
</p>

<p>
    Que el caso de marras se inicia por denuncia de la Sr/Sra
    ........................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................
</p>

<p>
    Que a fs. _____ se agrega documentación que acredita la relación de consumo conforme el Articulo 3° de la Ley 
    N° 24.240. 
</p>

<p>
    Que a fs. xxxx y xxxxxx se produce la apertura administrativa y conciliatoria de los presentes obrados, fijándose 
    audiencia de conciliación en fecha …………….. , adjuntandose acta de Audiencia a fs ____ .
</p>

<p>
    Por todo lo expuesto, y en consonancia con lo dispuesto por el art. 32 del ANEXO 1 DEL DECRETO PROVINCIAL 
    Nº 373/2.014 DE IMPLEMENTACIÓN Y DE PROCEDIMIENTO PARA LA DEFENSA DE LOS DERECHOS Y GARANTÍAS DE LOS CONSUMIDORES 
    Y USUARIOS EN LA PCIA. DE SANTIAGO DEL ESTERO RATIFICADO POR LEY 7.148, corresponde 
    <strong>IMPUTAR</strong> a la .................................................... CUIT N° .................................... ; 
    en el marco de la relación de consumo, por presunta infracción a la 
    <strong>LEY NACIONAL N° 24.240 DE DEFENSA DEL CONSUMIDOR</strong> y sus modif. por transgresión:
</p>

<p><strong>ARTÍCULO:</strong></p>
<p><strong>ARTICULO:</strong></p>

<p>
    <strong>HÁGASE SABER</strong> a la presunta firma infractora que, en el término 48 hs. (según Dec. Pcial. Nº 373/14), 
    a contar desde la notificación del presente proveído, deberá presentar por escrito su descargo y ofrecer las pruebas 
    que hicieren a su derecho, de conformidad al Anexo I Tit. IV Cap. 4 Art. 28 y Cap. 6 Art 33 del Decreto Provincial 
    Reglamentario 373/14, en esta DIRECCIÓN GENERAL DE COMERCIO, calle 25 de Mayo Nº 35, Santiago del Estero, de 
    8.00 a 13.00 horas, bajo apercibimiento de darle por decaído el derecho. 
</p>

<p>
    <strong>NOTIFÍQUESE</strong> de la presente, a las firmas IMPUTADAS, téngase presente que dicho acto no es una sanción 
    sino que, de acuerdo a las manifestaciones efectuadas por las partes, se determina una presunta infracción a la Ley 
    24.240 y sus modificatorias, debiendo con este acto ejercer su derecho de defensa.
</p>
  `,
  multa: `
    <p><strong>RESOLUCIÓN N°……..………….</strong><br/>
SANTIAGO DEL ESTERO,</p>

<p><strong>ACTUACIONES CARATULADAS: EXPTE. Nº</strong></p>

<p><strong>VISTO:</strong><br/>
Que las presentes actuaciones son iniciadas, por denuncia del Sr/ Sra.  D.N.I N°        , en contra de la firma                              CUIT N°                                 con domicilio en                      , Santiago del Estero, por supuesta infracción a la Ley N° 24.240, que esta Autoridad de Aplicación a fs.           dictara acto administrativo de IMPUTACION en fecha            , y que concedido el derecho de defensa, las actuaciones se encuentran en estado de resolver definitivamente sobre la cuestión de fondo, conforme al art. 47 de la Ley Nº 24.240.-</p>

<p><strong>CONSIDERANDO:</strong><br/>
Que de conformidad a los hechos denunciados en las actuaciones de referencia, iniciadas por el Sr./ Sra.                                                la misma sostiene que ……………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………….<br/>
Que a fs.      y           luce documental acompañada por la denunciante lo que acredita la relación de consumo conforme lo estipulado por el Articulo 3° de la 24.240.<br/>
Que a fs.        y      se da apertura al procedimiento administrativo celebrándose audiencia de conciliación en fecha                                    , cuya acta luce adjunta a fs                 , y que habiendo sido debidamente notificada las partes conforme cedulas debidamente diligenciada luce a fs.                         , solo comparece el denunciante quien ratifica los términos de su denuncia y solicitando la entrega del moto vehículo, no compareciendo la firma denunciada.<br/>
Que a fs.                  comparece la firma denunciada y expone que ……………………………………………………………………………………………………………………………………………………………………………………..<br/>
Que a fs.       esta Autoridad de Aplicación ha formulado imputación de cargos en contra de la firma          por presunta infracción a los artículos        ,        y         de la Ley N° 24.240, conforme a los hechos allí expuestos a los que me remito en razón de la brevedad, lo que fue debidamente notificado a la sumariada conforme cedula debidamente diligenciada que se anexa a fs.        <br/>
Que en fecha              comparece la firma denunciada y formula descargo, que luce adjunto a fs.        , y sostiene que ……………………………………………………………………………………………………………………………………………………………………………………..<br/>
Que al momento de sancionar esta Autoridad de Aplicación, no puede dejar de tener en cuenta, los principios que nutren los derechos del consumidor, como: a) “In dubio pro consumidor”, esta tesitura implica que en caso de duda sobre el resolutorio a tomar, se deberá seguir el criterio más favorable para los derechos del débil jurídico, que es el consumidor. b) La aplicación de la norma o cláusula más beneficiosa para el consumidor, implica, que en caso que esté en juego la aplicación de dos o más normas para la resolución de la controversia, se deberá aplicar la que resulte más conveniente para los intereses del consumidor.-<br/>
Que atento al estado de las actuaciones, la relación sucinta de los hechos, la documental acompañada, y conforme al art. 45 (de forma) de Ley 24.240 s.s. y c.c. y del art. 18 del Decreto Pcial. Nº 373/14 Ratificado por ley 7.148 s.s. y c.c., las actuaciones se encuentran en estado de ser resueltas, debiéndose SANCIONAR mediante MULTA a la firma                                                                                                                      por infracción a los siguientes artículos de la Ley N° 24.240:</p>

<p><strong>ARTICULO 4 DE LA LEY 24.240:</strong><br/>
Que, en cuanto a la no comparecencia de la firma                                                                   a la Audiencia de Conciliación de fecha                  cuya acta corre a fs.                   pese a estar debidamente notificada de acuerdo a cedula de notificación que corre a fs.       , conforme al art. 27 del Anexo 1 del Dec. Pcial. Nº 373/14 ratificado por Ley 7.148, le corresponde MULTA POR INCOMPAREENCIA.<br/>
Que, la sumariada ha cometido hechos y omisiones que encuadran en una descripción de conducta que merece sanción, su impunidad sólo podría apoyarse en la concreta aplicación de una excusa admitida por el sistema legal vigente (Conf. C.S. fallos 278-266 y fallo en causa W-6 Wortman s/apelación del 8-6-93), la cual no se da en el caso tratado, ya que no se aprecia que la firma denunciada haya esbozado argumentos defensivos que resulten exculpatorios.<br/>
Que, la Jurisprudencia también dice: “…debe recordarse que la ley 24.240 constituye un sistema de protección del consumidor cuyo incumplimiento trae aparejadas sanciones. Entre ellas se encuentra la multa, regulada en el inciso b) del artículo 47º, la que no tiene carácter sólo retributivo sino punitivo, es decir, que se presenta como una advertencia para evitar que el infractor cometa otros daños similares de persistir en su conducta.”<br/>
Que, por todo lo expuesto la infractora, se ha hecho pasible de la sanción de multa prevista en el artículo 47 inc. b) de la ley 24.240, la cual se gradúa según las circunstancias del caso y las pautas indicadas en el artículo 49º de dicha normativa. Consecuentemente se tendrá en cuenta: 1) El perjuicio resultante de la infracción para el consumidor; 2) La posición en el mercado del infractor; 3) La cuantía del beneficio obtenido; 4) El grado de intencionalidad; 5) La gravedad de los riesgos o los perjuicios sociales derivados de la infracción y su generalización; 6) La reincidencia y las demás circunstancias relevantes del hecho (conf. Artículo 49 de la ley 24.240).<br/>
Que así, resulta menester que las sanciones que esta Autoridad impone tengan un resultado directo en lo tocante al respeto de los derechos de los usuarios.<br/>
Asimismo, resulta necesario destacar con especial énfasis que la protección que el Estado debe brindar a los consumidores excede ampliamente la mera intervención de esta Autoridad de Aplicación, tratándose en última instancia de una labor conjunta que debe forzosamente involucrar a todos los poderes estatales. Ello es así en razón de que una completa y acabada tutela de los derechos de los ciudadanos de la Nación, y sus habitantes en general, requiere la creación de leyes por parte del poder específico a tales fines, y la aplicación de las mismas por parte de los otros, en estricto marco de sus competencias y atribuciones. Al respecto, se debe tener presente que tales derechos de los consumidores se encuentran expresamente tutelados por la propia Constitución Nacional.<br/>
Que la defensa del consumidores y usuarios no se lograría imponiendo multas que, por lo insignificantes en proporción al obligado al pago, induzcan a que este considere más conveniente seguir cometiendo infracciones despreocupadamente, con la convicción fundada de que la única consecuencia que se derivará de ello es un sanción económica ínfima, en términos relativos.<br/>
Que corresponde señalar que la Sala 5 de la Cámara Nacional de Apelaciones en lo Contencioso Administrativo Federal tiene dicho que la graduación de la sanción es resorte primario de este Órgano Administrativo, dando apoyo así a las facultades del mismo para desenvolverse en el marco de la razonabilidad y la legalidad, en tanto se respeten los parámetros previstos por la legislación aplicable.<br/>
Que por ello es que se entiende que la sanción que será impuesta a la sumariada en el presente sumario resulta en un todo ajustada a los parámetros legales y los fines perseguidos, de tutelar los derechos de los consumidores argentinos.<br/>
Que, el carácter de accesoria de la publicación se sustenta en la necesidad de informar a los consumidores de las contravenciones a sus derechos y la importancia de divulgar los medios con que cuentan para defenderse, merituando también  el carácter ejemplar y disuasivo de la sanción, como surge de la propia normativa al disponer que en todos los casos deberá publicarse la sentencia condenatoria.<br/>
Del mismo modo, se solicitó informe a la Oficina de Control y Gestión de este Organismo a los fines de determinar la cantidad de denuncias en contra de la firma denunciada en los presentes actuados                                             , y que atento a lo informado por la mencionada oficina, obran en este Organismo …………………………………………………………………… conforme surge del informe anexo a fs. ………..<br/>
Que por las razones fácticas y jurídicas expuestas ut supra y por imperio de lo normado por la Ley 24.240 y Decreto Provincial Nº 373/14 ratif. por ley N° 7.148 y por tratarse de una ley de Orden Público, están dadas las condiciones para que esta autoridad de aplicación, sancione a la firma                                                                            . Asimismo, Asesoría Legal de este Organismo así lo aconseja a fs.           <br/>
Que conforme a las normas de fondo y de forma en la materia de defensa del consumidor, y en uso de las facultades conferidas a este Organismo de aplicación;</p>

<p><strong>POR ELLO;<br/>
LA DIRECTORA GENERAL DE COMERCIO<br/>
RESUELVE:</strong></p>

<p><strong>ARTÍCULO 1°.-</strong> SANCIONAR CON MULTA EN FORMA CORRECTIVA DE PESOS ($                             ) A LA FIRMA                               CUIT                  CON DOMICILIO EN                                                     DE LA CIUDAD DE LA BANDA PROVINCIA DE SANTIAGO DEL ESTERO POR INFRACCION A LOS ARTICULOS 4°, 8°, 10 BIS° Y 37° DE LA LEY NACIONAL DE DEFENSA DEL CONSUMIDOR Nº 24.240, ello, conforme a los considerando de la presente Resolución, quien deberá efectivizar el pago en la  CUENTA ESPECIAL DE LA DIRECCION GENERAL DE COMERCIO N° 2047925/22 CBU N° 3210001130002047925222 DEL BANCO SANTIAGO DEL ESTERO S.A. CUIT 30999164990 (TESORERÍA DE LA PROVINCIA) dentro de los diez días (10) de notificada la presente, y presentar el comprobante  correspondiente  por  ante esta Dirección General de Comercio de la provincia de Santiago del Estero, en el término de cinco (5) días de realizado. Los importes de las multas ingresaran el 40% con destino a la promoción de los derechos de los consumidores usuarios y el 60% a rentas generales, según art. 20 del decreto N° 0373/14, ratificado por ley N° 7148.-</p>

<p><strong>ARTÍCULO 2°.-</strong> SANCIONAR CON MULTA EN FORMA CORRECTIVA DE PESOS DIEZ MIL C/00CTVOS ($ 10.000,00) A LA FIRMA                   CUIT 30-71757440-7 CON DOMICILIO                                                            PROVINCIA DE SANTIAGO DEL ESTERO por el ART. 27 DEL DECRETO PROVINCIAL N° 373/14 RATIFICADO POR LEY N° 7.148 POR INCOMPARENCIA INJUSTIFICADA, quien deberá efectivizar el pago en la CUENTA ESPECIAL DE LA DIRECCION GENERAL DE COMERCIO N° 2047925/22 CBU N° 3210001130002047925222 del Banco Santiago del Estero S.A. dentro de los DIEZ DÍAS (10) de notificada la presente, y presentar el comprobante  correspondiente  por  ante esta Dirección General de Comercio de la provincia de Santiago del Estero, en el término de cinco (5) días de realizado. Los importes de las multas ingresaran el 40% con destino a la promoción de los derechos de los consumidores usuarios y el 60% a rentas generales, según art. 20 del decreto N° 0373/14, ratificado por ley N° 7148.</p>

<p><strong>ARTÍCULO 3°.-</strong> DISPONER y ORDENAR a la firma sancionada, la PUBLICACION de la presente Resolución o  una síntesis de los hechos que la originaron, el tipo de infracción cometida y la sanción aplicada en el Diario “Nuevo Diario” o “El Liberal” de la Provincia de Santiago del Estero por el término de un (1) día, dentro de los términos establecidos en el artículo 1°, a su costa, según lo prescribe el artículo 47° de la Ley Nº 24.240. Se hace saber que conforme al art. 44 (ullt. parraf.) del decreto 0373/14 ratif. Por ley 7.148, el incumplimiento de este deber faculta a la autoridad de aplicación a imponer sanción de multa de $ 1.000 a $ 10.000.-</p>

<p><strong>ARTÍCULO 4°.-</strong> DEJAR ABIERTA LA VIA JUDICIAL PARA LA ESTIMACION DEL DAÑO, COMUNICAR AL CONSUMIDOR.-</p>

<p><strong>ARTÍCULO 5°.-</strong> COMUNICAR A LA FIRMA SUMARIADA, que conforme lo normado en el artículo 45º de la Ley 24.240 y en el artículo 43º del Decreto 0373/14 ratificado por ley N° 7.148 la resolución condenatoria de multa podrá ser recurrida mediante el recurso de apelación ante la Sala Contencioso Administrativa del Superior Tribunal de Justicia de la provincia, el que actuará como Juez de única instancia ordinaria. El recurso deberá interponerse ante esta Dirección General Comercio dentro de los dos días de hábiles (2) de notificada la Resolución. El mismo será concedido en relación y con efecto devolutivo. A los fines de su concesión, se deberá acompañar junto con el escrito apelante, comprobante de pago de la multa establecida en el art. 1º de la presente (en el Banco Santiago del Estero  en la cuenta referida en el aquel artículo), en virtud de la máxima solve et repet  (contenido en el art.43 de la Ley Provincial N° 7.148) para su remisión a la justicia, bajo apercibimiento de tenérselo por no presentado. Serán normas de aplicación supletoria, conforme el art. 49 del decreto reglamentario Pcial. Nº 373/14 – ratificado por ley Nº 7148- las previstas en la Ley de Trámite Administrativo y en las del Código de Procedimiento Civil y Comercial de la provincia.-</p>

<p><strong>ARTÍCULO 6º.-</strong> PAGO VOLUNTARIO DE MULTA. Conforme al art. 46 del Decreto Provincial Nº 0373/14, en los casos en que corresponda sanción de multa, dentro del mismo plazo establecido para interponer el recurso previsto en la presente, el infractor puede acogerse al beneficio del régimen de pago voluntario abonando el 50% (cincuenta por ciento) del monto fijado por la Autoridad de Aplicación. El importe correspondiente al pago voluntario debe hacerse efectivo mediante depósito bancario en la CUENTA ESPECIAL DE LA DIRECCION GENERAL DE COMERCIO N° 2047925/22 CBU N° 3210001130002047925222 del Banco Santiago del Estero S.A. CUIT 30999164990 (TESORERÍA DE LA PROVINCIA). El pago voluntario no dispensa al infractor de la obligación de cumplir con el deber de publicación.-</p>

<p><strong>ARTÍCULO 7º.-</strong> REGISTRESE. NOTIFIQUESE a las PARTES. FECHO, ARCHIVESE LA PRESENTE.-</p>
  `,
};

export const PaginaModal = ({ handleSubmit, show, onClose }) => {
  const [tipo, setTipo] = useState("");
  const [texto, setTexto] = useState("");

  const handleTipoChange = (e) => {
    const value = e.target.value;
    setTipo(value);
    setTexto(textosPredeterminados[value] || "");
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Enviamos el texto CON las etiquetas HTML para preservar el formato de las plantillas
    handleSubmit({ tipo, texto }); 
};

  // nueva función para generar PDF y abrir firma
  const handleGenerarFirma = async () => {
    if (!tipo || !texto) return;

    // crear blob del PDF
    const blob = await pdf(<DocumentoPDF tipo={tipo} contenido={texto} />).toBlob();
    const pdfUrl = URL.createObjectURL(blob);

    // descargar PDF
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = "documento.pdf";
    a.click();

    // Abrir página de firma en nueva pestaña
    window.open("https://firmar.gob.ar/firmador/#/", "_blank");
  };

  return (
    <div
      className={`modal fade ${show ? "show d-block" : ""}`}
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Nuevo Documento</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleFormSubmit}>
              <div className="mb-3">
                <label className="form-label">Tipo de Documento</label>
                <select
                  className="form-select"
                  value={tipo}
                  onChange={handleTipoChange}
                  required
                >
                  <option value="">Seleccionar...</option>
                  <option value="dictamen">Dictamen Legal</option>
                  <option value="providencia">Providencia simple</option>
                  <option value="decreto">Decreto</option>
                  <option value="imputacion">Imputacion</option>
                  <option value="multa">Multa</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Contenido del Documento</label>
                <ReactQuill
                  value={texto}
                  onChange={setTexto}
                  theme="snow"
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, false] }],
                      ["bold", "italic", "underline"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      [{ align: [] }],
                      ["clean"],
                    ],
                  }}
                />
              </div>
              <div className="text-end mt-4 d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!tipo || !texto}
                >
                  Generar PDF
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleGenerarFirma}
                  disabled={!tipo || !texto}
                >
                  Generar Firma
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
