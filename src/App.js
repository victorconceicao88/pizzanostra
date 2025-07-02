import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LanguageProvider } from './components/InterfaceCliente/LanguageContext';
import InterfaceCliente from './components/InterfaceCliente/InterfaceCliente';
import InterfaceAdmin from './components/InterfaceAdmin/InterfaceAdmin';
import Fidelidade from './components/InterfaceCliente/Fidelidade';
import Footer from './components/Footer/Footer';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<InterfaceCliente />} />
              <Route path="/admin" element={<InterfaceAdmin />} />
              <Route path="/fidelidade" element={<Fidelidade />} />
              {/* Adicione esta nova rota */}
              <Route path="/login" element={<InterfaceCliente />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster position="top-center" />
      </Router>
    </LanguageProvider>
  );
}

export default App;