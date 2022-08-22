import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import { initSheets } from './SheetsAPI/SheetsAPI'

import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
initSheets(() => {});

root.render(
  <BrowserRouter>
    <div style={{ minWidth: "fit-content" }}>
      <App />
    </div>
  </BrowserRouter>
);