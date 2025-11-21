// importaciones necesarias para crear pdfs
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// definicion de estilos para el documento pdf
const styles = StyleSheet.create({
  // estilo general de la pagina
  page: {
    padding: 50,          // margen interior
    fontSize: 12,         // tamaño base de fuente
    lineHeight: 1.5,      // interlineado
  },
  // estilo del encabezado del documento
  header: {
    marginBottom: 20,     // espacio inferior
    textAlign: 'center',  // centrado
    borderBottom: '1px solid black', // linea separadora
    paddingTop: 10
  },
  // estilo del bloque de firma
  signature: {
    marginTop: 50,        // espacio superior
    borderTop: '1px solid #000', // linea separadora
    paddingTop: 10,       // espacio sobre la linea
    fontSize: 10,         // tamaño de texto mas pequeño
    textAlign: 'left',    // alineado a la izquierda
    marginLeft: 50,       // margen izquierdo para alinear con el contenido
  },
  // estilo para cada linea de datos de la firma
  signatureData: {
    marginBottom: 3,      // espacio entre lineas
  },
  // estilo del titulo del documento
  title: {
    fontSize: 16,         // tamaño de fuente mas grande
    marginBottom: 10,     // espacio inferior
    fontWeight: 'bold'    // texto en negrita
  },
  // estilo del contenido principal
  content: {
    marginTop: 20,        // espacio superior
    marginBottom: 20,     // espacio inferior
  },
  // estilo del pie de pagina
  footer: {
    position: 'absolute', // posicion fija
    bottom: 30,          // distancia desde abajo
    left: 50,            // margen izquierdo
    right: 50,           // margen derecho
    textAlign: 'center', // centrado
    borderTop: '1px solid black', // linea separadora
    paddingTop: 10       // espacio sobre la linea
  },
  // estilo para la fecha
  date: {
    marginBottom: 20,     // espacio inferior
    textAlign: 'right'    // alineado a la derecha
  }
});

// componente principal para generar documentos pdf
export const DocumentoPDF = ({ tipo, contenido }) => {
  // datos estaticos temporales para la firma
  const datosEstaticos = {
    nombre: "Juan Pérez",      // nombre del firmante
    area: "Departamento Legal", // area del firmante
    cargo: "Abogado",          // cargo del firmante
  };
  
  // obtencion de fecha y hora actual
  const fecha = new Date();
  const fechaFormateada = fecha.toLocaleDateString('es-AR');  // formato dd/mm/yyyy
  const horaFormateada = fecha.toLocaleTimeString('es-AR');   // formato hh:mm:ss
  
  return (
    <Document> 
      <Page size="A4" style={styles.page}>
        {/* seccion de encabezado institucional */}
        <View style={styles.header}>
          <Text>Defensoría del Pueblo</Text>
          <Text>Sistema de Gestión de Expedientes</Text>
        </View>

        {/* seccion de fecha del documento */}
        <View style={styles.date}>
          <Text>{fechaFormateada}</Text>
        </View>

        {/* titulo dinamico segun tipo de documento */}
        <View style={styles.title}>
          <Text>
            {tipo === 'dictamen' ? 'DICTAMEN LEGAL' : 
             tipo === 'providencia' ? 'PROVIDENCIA SIMPLE' : 
             tipo === 'decreto' ? 'DECRETO' :
             tipo === 'imputacion' ? 'IMPUTACION' :
             tipo === 'multa' ? 'MULTA' :
             'DOCUMENTO'}
          </Text>
        </View>

        {/* contenido principal del documento */}
        <View style={styles.content}>
          <Text>{contenido}</Text>
        </View>

        {/* bloque de firma con datos del usuario */}
        <View style={styles.signature}>
          <Text style={styles.signatureData}>{datosEstaticos.nombre}</Text>
          <Text style={styles.signatureData}>{datosEstaticos.area}</Text>
          <Text style={styles.signatureData}>{datosEstaticos.cargo}</Text>
          <Text style={styles.signatureData}>{`${fechaFormateada} ${horaFormateada}`}</Text>
        </View>

        {/* pie de pagina institucional */}
        <View style={styles.footer}>
          <Text>Defensoría del Pueblo - Documento generado automáticamente</Text>
        </View>
      </Page>
    </Document>
  );
};
