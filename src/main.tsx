import React from 'react';
import ReactDOM from 'react-dom/client';
import '../market-pulse-dashboard';
import Index from '../market-pulse-dashboard';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Index />
  </React.StrictMode>
);
