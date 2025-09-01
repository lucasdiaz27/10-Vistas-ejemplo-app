// se instalo esto npm install @react-pdf/renderer react-quill
//comento para que no lloren dsp
// importacion de react pdf (no lo pienso desarrollar)
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

//estilos pal pdf papilos
const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontSize: 12,
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
    borderBottom: '1px solid black',
    paddingBottom: 10
  },
  title: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold'
  },
  content: {
    marginTop: 20,
    marginBottom: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 50,
    right: 50,
    textAlign: 'center',
    borderTop: '1px solid black',
    paddingTop: 10
  },
  date: {
    marginBottom: 20,
    textAlign: 'right'
  }
});

//componente principalñ del pdf
export const DocumentoPDF = ({ tipo, contenido }) => {
  const fecha = new Date().toLocaleDateString('es-AR'); //fecha actual
  
  return ( //estrucutra del coso
    <Document> 
      <Page size="A4" style={styles.page}>
        {/* encabezado */}
        <View style={styles.header}>
          <Text>Defensoría del Pueblo</Text>
          <Text>Sistema de Gestión de Expedientes</Text>
        </View>

        {/* fecha */}
        <View style={styles.date}>
          <Text>{fecha}</Text>
        </View>

        {/* titulo segun tipo */}
        <View style={styles.title}>
          <Text>
            {tipo === 'dictamen' ? 'DICTAMEN' : 
             tipo === 'nota' ? 'NOTA' : 
             'DOCUMENTO'}
          </Text>
        </View>

        {/* contenido principal */}
        <View style={styles.content}>
          <Text>{contenido}</Text>
        </View>

        {/* pie de pagina */}
        <View style={styles.footer}>
          <Text>Defensoría del Pueblo - Documento generado automáticamente</Text>
        </View>
      </Page>
    </Document>
  );
};
