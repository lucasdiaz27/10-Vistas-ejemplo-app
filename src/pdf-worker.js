import { pdfjs } from 'react-pdf';
import worker from 'pdfjs-dist/build/pdf.worker.mjs?url';
pdfjs.GlobalWorkerOptions.workerSrc = worker;