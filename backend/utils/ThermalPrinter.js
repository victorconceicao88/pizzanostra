const escpos = require('escpos');
const iconv = require('iconv-lite');
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
      const devices = escpos.USB.findPrinter();
      if (!devices || devices.length === 0) {
        throw new Error('Nenhuma impressora encontrada');
      }

      this.device = new escpos.USB(devices[0].vendorId, devices[0].productId);
      this.printer = new escpos.Printer(this.device, {
        encoding: "GB18030" // compatível com UTF-8 via iconv
      });
      this.initialized = true;
      console.log('Impressora inicializada');
    } catch (err) {
      console.error('Erro ao inicializar impressora:', err);
      this.initialized = false;
    }
  }

  formatCurrency(value) {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  }

  async printOrder(order) {
    if (!this.initialized) await this.initialize();

    return new Promise((resolve, reject) => {
      this.device.open((err) => {
        if (err) return reject(err);

        try {
          const createdDate = new Date(order.criadoEm?.seconds * 1000 || Date.now());

          const printText = (text) => this.printer.text(iconv.encode(text, 'GB18030'));

          // ----------- VIA COZINHA -----------
          this.printer.align('CT').style('B').text('*** VIA COZINHA ***');
          this.printer.align('LT').text('-----------------------------');
          printText(`PEDIDO: #${order.numeroPedido}`);
          printText(`DATA: ${createdDate.toLocaleString()}`);
          this.printer.text('-----------------------------');

          order.itens.forEach(item => {
            printText(`${item.quantidade}x ${item.nome}`);
            if (item.tamanho) printText(`  Tamanho: ${item.tamanho}`);
            if (item.extras?.length) {
              printText(`  Extras: ${item.extras.map(e => e.nome).join(', ')}`);
            }
            if (order.observacoes) printText(`  Obs: ${order.observacoes}`);
            this.printer.text('-----------------------------');
          });

          this.printer.cut();

          // ----------- VIA ENTREGADOR -----------
          this.printer.align('CT').style('B').text('*** VIA ENTREGADOR ***');
          this.printer.align('LT').text('-----------------------------');
          printText(`PEDIDO: #${order.numeroPedido}`);
          printText(`DATA: ${createdDate.toLocaleString()}`);
          this.printer.text('-----------------------------');

          const cliente = order.cliente || {};
          printText(`CLIENTE: ${cliente.nome || ''}`);
          printText(`TEL: ${cliente.telefone || ''}`);
          if (order.tipoEntrega === 'entrega') {
            printText('ENTREGA');
            printText(`ENDEREÇO: ${order.enderecoCompleto || ''}`);
          } else {
            printText('RETIRADA NO LOCAL');
          }

          this.printer.text('-----------------------------');

          order.itens.forEach(item => {
            printText(`${item.quantidade}x ${item.nome}`);
            if (item.tamanho) printText(`  Tamanho: ${item.tamanho}`);
            if (item.extras?.length) {
              printText(`  Extras: ${item.extras.map(e => e.nome).join(', ')}`);
            }
          });

          this.printer.text('-----------------------------');
          printText(`TOTAL: ${this.formatCurrency(order.total || 0)}`);
          printText(`PAGAMENTO: ${order.metodoPagamento}`);
          this.printer.text('-----------------------------');

          this.printer.align('CT').text('OBRIGADO!');
          this.printer.feed(4).cut().close(() => resolve());

        } catch (e) {
          reject(e);
        }
      });
    });
  }
}

module.exports = ThermalPrinter;
