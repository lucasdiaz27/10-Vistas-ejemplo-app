import React from 'react';
import ReactDOM from 'react-dom/client';
import SiteApp from './SiteApp';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './pdf-worker'
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SiteApp />
  </React.StrictMode>
);