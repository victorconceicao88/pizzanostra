import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from './components/InterfaceCliente/ThemeContext'; // ✅ importado

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider> {/* ✅ envolve o App */}
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

reportWebVitals();
