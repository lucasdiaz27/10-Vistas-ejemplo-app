// importaciones necesarias para crear pdfs
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { parseJwt, getAccessToken } from '../../../utils/auth';

// Función para procesar HTML básico a componentes de react-pdf
const parseHTML = (html) => {
  const elements = [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const processNode = (node, index = 0) => {
    if (node.nodeType === 3) {
      const text = node.textContent.trim();
      if (text) return <Text key={index}>{text}</Text>;
      return null;
    }

    if (node.nodeType === 1) {
      const tag = node.tagName.toLowerCase();
      const children = Array.from(node.childNodes).map(processNode).filter(Boolean);

      switch (tag) {
        case 'p':
          return <View key={index} style={{ marginBottom: 10 }}>{children}</View>;
        case 'strong':
        case 'b':
          return <Text key={index} style={{ fontWeight: 'bold' }}>{children}</Text>;
        case 'i':
        case 'em':
          return <Text key={index} style={{ fontStyle: 'italic' }}>{children}</Text>;
        case 'br':
          return <Text key={index}>{'\n'}</Text>;
        case 'span':
          return <Text key={index}>{children}</Text>;
        default:
          return children;
      }
    }
    return null;
  };

  return Array.from(doc.body.childNodes).map(processNode).filter(Boolean);
};

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontSize: 12,
    lineHeight: 1.5,
  },

  headerContainer: {
    height: 80,
    marginBottom: 10,
    position: 'relative',
  },

  headerLogo: {
    width: 70,
    height: 70,
    position: 'absolute',
    left: 0,
    top: 0,
  },

  headerAbsoluteCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 15,
    alignItems: 'center',
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

  date: {
    marginBottom: 20,
    textAlign: 'right',
  },

  title: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
  },

  content: {
    marginTop: 20,
    marginBottom: 20,
  },

  /* FIRMA HORIZONTAL */
  signatureRow: {
    fontSize: 10,
    textAlign: 'Left',
    marginTop: 10,
    marginBottom: 5,
  },

  footer: {
    position: 'absolute',
    bottom: 30,
    left: 50,
    right: 50,
    textAlign: 'center',
    paddingTop: 10,
    borderTop: '1px solid black',
  },

  footerText: {
    fontSize: 10,
    marginTop: 5,
  },
});

export const DocumentoPDF = ({ tipo, contenido }) => {
  // Obtener datos del usuario desde el token
  const token = getAccessToken();
  const tokenPayload = parseJwt(token);
  
  // Datos del usuario del token, con valores por defecto si no están disponibles
  const datosEstaticos = {
    nombre: tokenPayload?.nombre || tokenPayload?.name || "Usuario Desconocido",
    area: tokenPayload?.rol || tokenPayload?.role || "Sin rol asignado",
  
  };

  const fecha = new Date();
  const fechaFormateada = fecha.toLocaleDateString('es-AR');
  const horaFormateada = fecha.toLocaleTimeString('es-AR');

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        <View style={styles.headerContainer}>
          <Image src="/Logo.png" style={styles.headerLogo} />
          <View style={styles.headerAbsoluteCenter}>
            <Text style={styles.headerText}>Dirección General de Comercio</Text>
            <Text style={styles.headerSubtext}>Santiago del Estero</Text>
          </View>
        </View>

        <View style={styles.headerLine} />

        <View style={styles.date}>
          <Text>{fechaFormateada}</Text>
        </View>

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

        <View style={styles.content}>
          {parseHTML(contenido)}
        </View>

        <View style={styles.footer}>
          {/* FIRMA EN HORIZONTAL */}
          <Text style={styles.signatureRow}>
            {`${datosEstaticos.nombre} – ${datosEstaticos.area} – ${fechaFormateada} ${horaFormateada}`}
          </Text>

          <Text style={styles.footerText}>
            Documento generado automáticamente
          </Text>
        </View>

      </Page>
    </Document>
  );
};
