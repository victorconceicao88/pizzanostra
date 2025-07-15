const express = require('express');
const router = express.Router();

module.exports = (printer) => {
  router.post('/', async (req, res) => {
    try {
      const { numeroPedido, itens, cliente } = req.body;

      if (!numeroPedido || !itens || !cliente) {
        return res.status(400).json({ success: false, error: "Dados do pedido incompletos" });
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
