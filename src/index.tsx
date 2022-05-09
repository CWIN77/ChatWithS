import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Router from './Router';

import {BrowserRouter} from 'react-router-dom'

// sessionStorage.clear();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render
(
  <React.StrictMode>
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  </React.StrictMode>
);