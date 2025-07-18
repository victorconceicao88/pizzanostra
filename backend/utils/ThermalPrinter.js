const escpos = require('escpos');
const iconv = require('iconv-lite');
escpos.USB = require('escpos-usb');

class ThermalPrinter {
  constructor() {
    this.device = null;
    this.printer = null;
    this.initialized = false;
  }

  async initialize() {
    try {
      const devices = escpos.USB.findPrinter();
      if (!devices || devices.length === 0) {
        throw new Error('Nenhuma impressora encontrada');
      }

      this.device = new escpos.USB(devices[0].vendorId, devices[0].productId);
      this.printer = new escpos.Printer(this.device, {
        encoding: "CP860",
        width: 42
      });

      this.initialized = true;
      return true;
    } catch (err) {
      console.error('Erro ao inicializar impressora:', err);
      this.initialized = false;
      return false;
    }
  }

  sanitizeText(text) {
    if (!text) return '';
    return text
      .replace(/[ãáâ]/g, 'a')
      .replace(/[éê]/g, 'e')
      .replace(/í/g, 'i')
      .replace(/[óô]/g, 'o')
      .replace(/ú/g, 'u')
      .replace(/ç/g, 'c')
      .replace(/[º°]/g, 'o');
  }

  formatCurrency(value) {
    return value.toFixed(2).replace('.', ',');
  }

  printLine(leftText, rightText = '') {
    const lineLength = 42;
    const spaces = ' '.repeat(lineLength - leftText.length - rightText.length);
    return `${leftText}${spaces}${rightText}`;
  }

  async printOrder(order) {
    if (!this.initialized) {
      const initSuccess = await this.initialize();
      if (!initSuccess) {
        throw new Error('Não foi possível inicializar a impressora');
      }
    }

    return new Promise((resolve, reject) => {
      this.device.open((error) => {
        if (error) {
          console.error('Erro ao abrir conexão com a impressora:', error);
          return reject(error);
        }

        try {
          const createdDate = new Date(order.criadoEm?.seconds * 1000 || Date.now());
          const cliente = order.cliente || {};
          const isDelivery = order.tipoEntrega === 'entrega';
          const pizzaCategories = ['tradicionais', 'entradas', 'vegetarianas', 'doces'];
          const printSizeAndBorderCategories = ['tradicionais', 'vegetarianas'];

          // ============ VIA COZINHA ============

          this.printer
            .align('CT')
            .style('B')
            .text('==============================')
            .text('        PIZZA NOSTRA         ')
            .text('        COPIA COZINHA        ')
            .text('==============================')
            .style('NORMAL')
            .feed(1)
            .align('LT')
            .style('B')
            .size(1, 1)
            .text(`PEDIDO Nº: #${order.numeroPedido || order.id?.substring(0, 6) || '000000'}`)
            .size(0, 0)
            .style('NORMAL')
            .text(`CLIENTE: ${this.sanitizeText(cliente.nome || 'NAO INFORMADO')}`.toUpperCase())
            .text(`TIPO: ${isDelivery ? 'ENTREGA' : 'RETIRADA'}`)
            .text(`DATA: ${createdDate.toLocaleDateString('pt-PT')} - HORA: ${createdDate.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}`)
            .feed(1)
            .style('B')
            .text('ITENS:')
            .style('NORMAL')
            .text('-------------------------------------------');

          if (Array.isArray(order.itens)) {
            order.itens.forEach((item, index) => {
              if (item.halfAndHalf) {
                this.printer.text(`1x MEIA A MEIA: ${this.sanitizeText(item.halfPizza1Name)} + ${this.sanitizeText(item.halfPizza2Name)}`);
              } else {
                const itemNome = this.sanitizeText(item.nome).toUpperCase();
                this.printer.text(`${item.quantidade}x ${itemNome}`);

                if (item.categoria === 'hamburgueres') {
                  this.printer.text(`  Tipo carne: ${item.meatType === 'frango' ? 'FRANGO' : 'VACA'}`);
                  if (item.withMenu) {
                    this.printer.text('  COM MENU (BEBIDA + BATATAS)');
                  }
                } else if (printSizeAndBorderCategories.includes(item.categoria)) {
                  this.printer.text(`  Tamanho: ${item.tamanho?.toLowerCase() || 'padrao'}`);
                  if (item.borderType) {
                    this.printer.text(`  Borda: ${item.borderType === 'grossa' ? 'GROSSA' : 'FINA'}`);
                  }
                }

                if (item.extras?.length) {
                  this.printer.text(`  Extras: ${this.sanitizeText(item.extras.map(e => e.nome).join(', '))}`);
                }
              }

              if (index < order.itens.length - 1) {
                this.printer.text('-------------------------------------------');
              }
            });
          }

          if (order.observacoes) {
            this.printer
              .feed(1)
              .style('B')
              .text('OBSERVAÇÕES:')
              .style('NORMAL')
              .text('-------------------------------------------')
              .text(this.sanitizeText(order.observacoes))
              .feed(1);
          }

          this.printer
            .feed(1)
            .align('CT')
            .style('B')
            .text('>>> VIA SEM VALOR FISCAL <<<')
            .style('NORMAL')
            .feed(2)
            .cut();

          // ============ VIA ENTREGADOR ============

          this.printer
            .align('CT')
            .style('B')
            .text('==============================')
            .text('        PIZZA NOSTRA         ')
            .text('          DELIVERY           ')
            .text('==============================')
            .style('NORMAL')
            .feed(1)
            .align('LT')
            .style('B')
            .size(1, 1)
            .text(`PEDIDO Nº: #${order.numeroPedido || order.id?.substring(0, 6) || '000000'}`)
            .size(0, 0)
            .style('NORMAL')
            .text(`DATA: ${createdDate.toLocaleDateString('pt-PT')}`)
            .text(`HORA: ${createdDate.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}`)
            .text(`CLIENTE: ${this.sanitizeText(cliente.nome || 'NAO INFORMADO')}`.toUpperCase())
            .text(`TELEFONE: ${cliente.telefone || 'NAO INFORMADO'}`)
            .text(`NIF: ${cliente.nif || 'NAO INFORMADO'}`)
            .feed(1)
            .text('-------------------------------------------')
            .style('B')
            .text(this.printLine(`TIPO: ${isDelivery ? 'ENTREGA' : 'RETIRADA'}`))
            .style('NORMAL');

          if (isDelivery) {
            this.printer
              .text('-------------------------------------------')
              .style('B')
              .text('ENDEREÇO:')
              .style('NORMAL')
              .text(this.sanitizeText(order.enderecoCompleto || 'NAO INFORMADO'))
              .text(cliente.codigoPostal ? `CODIGO POSTAL: ${cliente.codigoPostal}` : '')
              .text('-------------------------------------------');
          }

          this.printer
            .feed(1)
            .style('B')
            .text('ITENS:')
            .style('NORMAL')
            .text('-------------------------------------------');

          if (Array.isArray(order.itens)) {
            order.itens.forEach(item => {
              const itemText = item.halfAndHalf ? 
                `1x MEIA A MEIA` : 
                `${item.quantidade}x ${this.sanitizeText(item.nome)}`;
              
              const priceText = item.pagoComSelos ? 'GRÁTIS (SELOS)' : `${this.formatCurrency(item.preco || 0)} EUR`;
              this.printer.text(this.printLine(itemText, priceText));

              if (item.halfAndHalf) {
                this.printer.text(`  ${this.sanitizeText(item.halfPizza1Name)} + ${this.sanitizeText(item.halfPizza2Name)}`);
              } else if (item.categoria === 'hamburgueres') {
                this.printer.text(`  Tipo carne: ${item.meatType === 'frango' ? 'FRANGO' : 'VACA'}`);
                if (item.withMenu) {
                  this.printer.text('  COM MENU (BEBIDA + BATATAS)');
                }
              } else if (pizzaCategories.includes(item.categoria)) {
                const sizeText = item.tamanho ? ` (${item.tamanho.toLowerCase()})` : '';
                this.printer.text(`  Tamanho: ${item.tamanho?.toLowerCase() || 'padrao'}${sizeText}`);
                if (item.borderType) {
                  this.printer.text(`  Borda: ${item.borderType === 'grossa' ? 'GROSSA' : 'FINA'}`);
                }
              }

              if (item.extras?.length) {
                const extrasText = item.extras
                  .map(e => `${this.sanitizeText(e.nome)} (+${this.formatCurrency(e.preco || 0)} EUR)`)
                  .join(', ');
                this.printer.text(`  Extras: ${extrasText}`);
              }

              this.printer.text('-------------------------------------------');
            });
          }

          this.printer.text(this.printLine('Subtotal:', `${this.formatCurrency(order.subtotal || 0)} EUR`));

          if (isDelivery && order.taxaEntrega) {
            this.printer.text(this.printLine('Taxa de Entrega:', `${this.formatCurrency(order.taxaEntrega)} EUR`));
          }

          if (order.selosUsados > 0) {
            this.printer.text(this.printLine('Desconto (Selos):', `-${this.formatCurrency(order.subtotal + (order.taxaEntrega || 0) - order.total)} EUR`));
          }

          this.printer.text('-------------------------------------------')
            .style('B')
            .text(this.printLine('TOTAL:', `${this.formatCurrency(order.total || 0)} EUR`))
            .style('NORMAL')
            .text('-------------------------------------------')
            .style('B')
            .text('FORMA DE PAGAMENTO:')
            .style('NORMAL')
            .text(order.metodoPagamento?.toUpperCase() || 'NAO INFORMADO')
            .text('-------------------------------------------');

          if (order.metodoPagamento === 'dinheiro' && order.detalhesPagamento) {
            this.printer
              .text(this.printLine('Valor Pago:', `${this.formatCurrency(order.detalhesPagamento.valorPago || 0)} EUR`))
              .text(this.printLine('Troco:', `${this.formatCurrency(order.detalhesPagamento.troco || 0)} EUR`))
              .text('-------------------------------------------');
          }

          if (order.observacoes) {
            this.printer
              .feed(1)
              .style('B')
              .text('OBSERVAÇÕES:')
              .style('NORMAL')
              .text(this.sanitizeText(order.observacoes))
              .text('-------------------------------------------');
          }

          this.printer
            .feed(1)
            .align('CT')
            .style('B')
            .text('FAÇA SEUS PEDIDOS ONLINE')
            .text('https://pizza-nostra.pt/')
            .feed(1)
            .text('* Programa de Fidelidade')
            .text('* Ofertas Exclusivas')
            .feed(1)
            .text('Rápido, fácil e direto com a PIZZA NOSTRA!')
            .style('NORMAL')
            .feed(1)
            .text('OBRIGADO PELA PREFERENCIA!')
            .feed(2)
            .cut();

          this.printer.close(() => {
            resolve();
          });

        } catch (e) {
          this.printer.close(() => {
            reject(e);
          });
        }
      });
    });
  }
}

module.exports = ThermalPrinter;
