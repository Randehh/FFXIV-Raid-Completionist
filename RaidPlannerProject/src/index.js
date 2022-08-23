import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { HashRouter } from "react-router-dom";
import { initSheets } from './SheetsAPI/SheetsAPI'
import { Helmet } from "react-helmet";

import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
initSheets(() => { });

root.render(
  <>
    <Helmet>
      <title>FFXIV Raid Completionist</title>
      <meta name="description" content="You can use this tool to create a team and track which trials and raids every member has done in order to assist finding something new to do."></meta>
    </Helmet>
    <HashRouter>
      <div style={{ minWidth: "fit-content" }}>
        <App />
      </div>
    </HashRouter>
  </>
);