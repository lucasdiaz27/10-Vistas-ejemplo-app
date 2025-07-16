import { pdfjs } from 'react-pdf';

// Configurar el worker de PDF.js para Vite
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();