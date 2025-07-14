const escpos = require('escpos');
escpos.USB = require('escpos-usb');

class ThermalPrinter {
  constructor() {
    this.device = null;
    this.printer = null;
    this.initialized = false;
    this.initialize();
  }

  async initialize() {
    try {
      this.device = await escpos.USB.findPrinter();
      this.printer = new escpos.Printer(this.device);
      this.initialized = true;
      console.log('Impressora térmica inicializada com sucesso');
    } catch (error) {
      console.error('Erro ao inicializar impressora:', error);
      this.initialized = false;
      // Tenta reconectar a cada 30 segundos
      setTimeout(() => this.initialize(), 30000);
    }
  }

  async printOrder(order) {
    if (!this.initialized) {
      await this.initialize();
      if (!this.initialized) {
        throw new Error('Impressora não inicializada');
      }
    }

    return new Promise((resolve, reject) => {
      this.device.open(async (error) => {
        if (error) {
          console.error('Erro ao abrir conexão com impressora:', error);
          reject(error);
          return;
        }

        try {
          this.printer
            .font('a')
            .align('ct')
            .size(1, 1)
            .text('PIZZA NOSTRA')
            .size(0, 0)
            .text('--------------------------------')
            .align('lt')
            .text(`Pedido: #${order.numeroPedido || order.id.substring(0, 5)}`)
            .text(`Data: ${order.criadoEm.toLocaleString('pt-BR')}`)
            .text(`Cliente: ${order.cliente.nome}`)
            .text(`Telefone: ${order.cliente.telefone}`)
            .text('--------------------------------');

          if (order.tipoEntrega === 'entrega') {
            this.printer
              .text('ENTREGA')
              .text(`Endereço: ${order.enderecoCompleto}`)
              .text(`Taxa: ${this.formatCurrency(order.taxaEntrega || 0)}`);
          } else {
            this.printer.text('RETIRADA NO LOCAL');
          }

          this.printer.text('--------------------------------');

          // Itens do pedido
          order.itens.forEach(item => {
            this.printer
              .text(`${item.quantidade}x ${item.nome}`)
              .text(`  ${this.formatCurrency(item.preco * item.quantidade)}`);

            if (item.tamanho) {
              this.printer.text(`  Tamanho: ${item.tamanho}`);
            }

            if (item.extras?.length > 0) {
              this.printer.text(`  Extras: ${item.extras.map(e => e.nome).join(', ')}`);
            }
          });

          this.printer.text('--------------------------------');

          // Totais
          this.printer
            .text(`Subtotal: ${this.formatCurrency(order.subtotal || 0)}`);

          if (order.tipoEntrega === 'entrega') {
            this.printer.text(`Taxa entrega: ${this.formatCurrency(order.taxaEntrega || 0)}`);
          }

          if (order.selosUsados > 0) {
            this.printer.text(`Desconto (selos): -${this.formatCurrency((order.subtotal + (order.taxaEntrega || 0) - (order.total || 0)))}`);
          }

          this.printer
            .text('--------------------------------')
            .align('rt')
            .text(`TOTAL: ${this.formatCurrency(order.total || 0)}`)
            .align('lt')
            .text('--------------------------------')
            .align('ct')
            .text('Obrigado pela preferência!')
            .text('Volte sempre :)')
            .cut()
            .close(() => {
              console.log('Pedido impresso com sucesso');
              resolve();
            });
        } catch (printError) {
          console.error('Erro durante a impressão:', printError);
          reject(printError);
        }
      });
    });
  }

  formatCurrency(value) {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(value);
  }
}

module.exports = new ThermalPrinter();