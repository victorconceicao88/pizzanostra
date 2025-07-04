import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LanguageProvider } from './components/InterfaceCliente/LanguageContext';
import InterfaceCliente from './components/InterfaceCliente/InterfaceCliente';
import InterfaceAdmin from './components/InterfaceAdmin/InterfaceAdmin';
import Fidelidade from './components/InterfaceCliente/Fidelidade';
import Footer from './components/Footer/Footer';

// ✅ Importações das novas páginas
import Termos from './components/InterfaceCliente/Termos';
import Politica from './components/InterfaceCliente/Politica';

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
              <Route path="/login" element={<InterfaceCliente />} />
              {/* ✅ Novas rotas adicionadas */}
              <Route path="/termos" element={<Termos />} />
              <Route path="/politica" element={<Politica />} />
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
