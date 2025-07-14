const express = require('express');
const cors = require('cors');
const app = express();
const printRoute = require('./routes/print');
const ThermalPrinter = require('./utils/ThermalPrinter');

// Configurações básicas
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Inicializa a impressora
const printer = new ThermalPrinter();

// Rotas
app.use('/api/print', printRoute(printer));

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'online',
    printer: printer.initialized ? 'conectada' : 'desconectada'
  });
});

// Inicia servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}/api/health para verificar o status`);
});

// Tratamento de erros global
process.on('unhandledRejection', (err) => {
  console.error('Erro não tratado:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Erro não tratado:', err);
  printer.initialized = false;
});

setInterval(() => {
  if (!printer.initialized) {
    printer.initialize();
  }
}, 30000); // Tenta reconectar a cada 30 segundos