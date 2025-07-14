const express = require('express');
const router = express.Router();

module.exports = (printer) => {
  router.post('/', async (req, res) => {
    try {
      if (!req.body.id || !req.body.cliente) {
        return res.status(400).json({ success: false, error: "Dados incompletos" });
      }

      await printer.printOrder(req.body);

      res.json({ 
        success: true,
        printedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Erro na impressão:", error);
      res.status(500).json({
        success: false,
        error: "Erro na impressão",
        retry: true
      });
    }
  });

  return router;
};
