const express = require('express');
const cors = require('cors');
const app = express();
const printRoute = require('./routes/print');
const ThermalPrinter = require('./utils/ThermalPrinter');

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const printer = new ThermalPrinter();
app.use('/api/print', printRoute(printer));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    printer: printer.initialized ? 'conectada' : 'desconectada'
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}/api/health para verificar o status`);
});

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
}, 30000);
