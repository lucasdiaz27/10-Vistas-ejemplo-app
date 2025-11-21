// importaciones necesarias para crear pdfs
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// definicion de estilos para el documento pdf
const styles = StyleSheet.create({
  // estilo general de la pagina
  page: {
    padding: 50,
    fontSize: 12,
    lineHeight: 1.5,
  },

  /* =====================
     ENCABEZADO
     ===================== */
  headerContainer: {
    height: 80,            // reserva espacio para logo + texto
    marginBottom: 10,
    position: 'relative',  // permite posicionamiento absoluto interno
  },

  headerLogo: {
    width: 70,
    height: 70,
    position: 'absolute',
    left: 0,               // SIEMPRE alineado a la izquierda
    top: 0,
  },

  headerAbsoluteCenter: {
    position: 'absolute',
    left: 0,
    right: 0,              // ocupa todo el ancho de la hoja
    top: 15,
    alignItems: 'center',  // centra el texto horizontalmente
  },

  headerText: {
    fontSize: 12,
    fontWeight: 'bold',
  },

  headerSubtext: {
    fontSize: 11,
  },

  headerLine: {
    borderBottom: '1px solid black',
    marginTop: 5,
    marginBottom: 15,
  },

  /* =====================
     FECHA
     ===================== */
  date: {
    marginBottom: 20,
    textAlign: 'right',
  },

  /* =====================
     TITULO
     ===================== */
  title: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
  },

  /* =====================
     CONTENIDO
     ===================== */
  content: {
    marginTop: 20,
    marginBottom: 20,
  },

  /* =====================
     FIRMA
     ===================== */
  signature: {
    marginTop: 50,
    borderTop: '1px solid #000',
    paddingTop: 10,
    fontSize: 10,
    textAlign: 'left',
    marginLeft: 50,
  },
  signatureData: {
    marginBottom: 3,
  },

  /* =====================
     FOOTER
     ===================== */
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 50,
    right: 50,
    textAlign: 'center',
    paddingTop: 10,
    borderTop: '1px solid black', // línea del footer
  },
  footerText: {
    fontSize: 10,
    textAlign: 'center',
  },
});

// componente principal para generar documentos pdf
export const DocumentoPDF = ({ tipo, contenido }) => {
  // datos estaticos temporales para la firma
  const datosEstaticos = {
    nombre: "Juan Pérez",
    area: "Departamento Legal",
    cargo: "Abogado",
  };

  // fecha y hora actual
  const fecha = new Date();
  const fechaFormateada = fecha.toLocaleDateString('es-AR');
  const horaFormateada = fecha.toLocaleTimeString('es-AR');

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* =====================
            ENCABEZADO
           ===================== */}
        <View style={styles.headerContainer}>
          <Image src="/Logo.png" style={styles.headerLogo} />

          {/* Texto centrado global */}
          <View style={styles.headerAbsoluteCenter}>
            <Text style={styles.headerText}>Dirección General de Comercio</Text>
            <Text style={styles.headerSubtext}>Santiago del Estero</Text>
          </View>
        </View>

        {/* LINEA SEPARADORA */}
        <View style={styles.headerLine} />

        {/* FECHA */}
        <View style={styles.date}>
          <Text>{fechaFormateada}</Text>
        </View>

        {/* TITULO SEGÚN TIPO */}
        <View style={styles.title}>
          <Text>
            {tipo === 'dictamen' ? 'DICTAMEN LEGAL' :
            tipo === 'providencia' ? 'PROVIDENCIA SIMPLE' :
            tipo === 'decreto' ? 'DECRETO' :
            tipo === 'imputacion' ? 'IMPUTACIÓN' :
            tipo === 'multa' ? 'MULTA' :
            'DOCUMENTO'}
          </Text>
        </View>

        {/* CONTENIDO PRINCIPAL */}
        <View style={styles.content}>
          <Text>{contenido}</Text>
        </View>

        {/* FIRMA */}
        <View style={styles.signature}>
          <Text style={styles.signatureData}>{datosEstaticos.nombre}</Text>
          <Text style={styles.signatureData}>{datosEstaticos.area}</Text>
          <Text style={styles.signatureData}>{datosEstaticos.cargo}</Text>
          <Text style={styles.signatureData}>
            {`${fechaFormateada} ${horaFormateada}`}
          </Text>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Defensoría del Pueblo - Documento generado automáticamente
          </Text>
        </View>

      </Page>
    </Document>
  );
};
