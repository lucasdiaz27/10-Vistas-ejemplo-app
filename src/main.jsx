import React from 'react';
import ReactDOM from 'react-dom/client';
import SiteApp from './SiteApp';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './pdf-worker'
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import './swal2-custom.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SiteApp />
  </React.StrictMode>
);