import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 12 },
  section: { marginBottom: 12 },
  title: { fontSize: 18, marginBottom: 10, fontWeight: 'bold' },
  label: { fontWeight: 'bold' },
});

const ExpedientePDF = ({ expediente }) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Detalle de Expediente</Text>
      </View>
      <View style={styles.section}>
        <Text>
          <Text style={styles.label}>N° de Expediente: </Text>
          {expediente.nro_exp ?? '-'}
        </Text>
        <Text>
          <Text style={styles.label}>N° de Orden: </Text>
          {expediente.id}
        </Text>
        <Text>
          <Text style={styles.label}>Cant. folios: </Text>
          {expediente.cant_folios ?? '-'}
        </Text>
        <Text>
          <Text style={styles.label}>Fecha de ingreso: </Text>
          {expediente.fecha_inicio ?? '-'}
        </Text>
        <Text>
          <Text style={styles.label}>Fecha de finalización: </Text>
          {expediente.fecha_finalizacion ?? '-'}
        </Text>
        <Text>
          <Text style={styles.label}>HV: </Text>
          {expediente.hipervulnerable ?? '-'}
        </Text>
        <Text>
          <Text style={styles.label}>Delegación: </Text>
          {expediente.delegacion ?? '-'}
        </Text>
      </View>
      {/* Agregá más secciones según tus datos */}
    </Page>
  </Document>
);

export default ExpedientePDF;