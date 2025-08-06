import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '../../firebase';
import { 
  collection, 
  query, 
  onSnapshot, 
  updateDoc, 
  doc,
  orderBy,
  where,
  getDocs,
  serverTimestamp,
  deleteDoc,
  limit,
  getDoc
} from 'firebase/firestore';
import { 
  FaStore,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaPrint,
  FaMotorcycle,
  FaExclamationTriangle,
  FaCheck, 
  FaSearch, 
  FaUser, 
  FaStamp, 
  FaPlus, 
  FaMinus,
  FaClock,
  FaUtensils,
  FaListUl,
  FaUserCircle,
  FaTrash,
  FaBoxOpen,
  FaRegCheckCircle,
  FaMoneyBillWave,
  FaCreditCard,
  FaMobileAlt,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaChartLine,
  FaChartBar,
  FaChartPie,
  FaCalendarAlt,
  FaFilter,
  FaFileExport,
  FaUserTie,
  FaBiking,
  FaMoneyBillAlt,
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CSVLink } from 'react-csv';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const ModernCard = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, color = 'gray' }) => {
  const colors = {
    gray: 'bg-gray-100 text-gray-800',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    blue: 'bg-blue-100 text-blue-800',
    purple: 'bg-purple-100 text-purple-800',
    amber: 'bg-amber-100 text-amber-800',
    stamp: 'bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-md'
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color]}`}>
      {children}
    </span>
  );
};

const formatCurrency = (value) => new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(value);
const formatStamps = (count) => `${count} selo${count !== 1 ? 's' : ''}`;
const formatDate = (date) => new Date(date).toLocaleDateString('pt-PT');
const formatDateTime = (date) => new Date(date).toLocaleString('pt-PT');

const paymentIcons = {
  dinheiro: <FaMoneyBillWave className="text-green-500" />,
  cartão: <FaCreditCard className="text-blue-500" />, 
  mbway: <FaMobileAlt className="text-purple-500" />,
  selos: <div className="relative">
    <FaStamp className="text-amber-500 absolute animate-ping" />
    <FaStamp className="text-amber-500 relative" />
  </div>
};

const shouldShowBorderType = (itemName) => {
  const pizzaCategories = ['Tradicionais', 'Vegetarianas', 'Entradas', 'Doces'];
  return pizzaCategories.some(category => itemName.includes(category));
};

const getTimeDifference = (date) => {
  if (!date) return '--';
  const now = new Date();
  const orderDate = date?.toDate ? date.toDate() : new Date(date);
  const diffInMinutes = Math.floor((now - orderDate) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Agora mesmo';
  if (diffInMinutes < 60) return `${diffInMinutes} min atrás`;
  return `${Math.floor(diffInMinutes / 60)}h ${diffInMinutes % 60}min atrás`;
};

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <ModernCard className="w-full max-w-md">
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-6">{message}</p>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
            >
              Confirmar
            </button>
          </div>
        </div>
      </ModernCard>
    </div>
  );
};

const OrderItem = ({ item }) => {
  // Verifica se extras são válidos
  const hasValidExtras = item.extras && Array.isArray(item.extras) &&
    item.extras.every(extra => extra && typeof extra.preco === 'number');

  // Cálculo de preços
  const precoBase = item.preco || 0;
  const precoBorda = item.precoBorda || 0;
  const precoExtras = hasValidExtras
    ? item.extras.reduce((sum, extra) => sum + (extra.preco || 0), 0)
    : 0;
  const precoTotal = (precoBase + precoBorda + precoExtras) * item.quantidade;

  // Determina o tipo de item
 const isPizza = item.categoria === 'tradicionais' || item.categoria === 'pizzas';
 const isBebida = item.categoria === 'bebidas' || item.categoria === 'freeDrinks';


  return (
    <div className={`p-4 rounded-xl mb-3 transition-all ${item.pagoComSelos ? 
      'bg-gradient-to-br from-amber-50 to-amber-100 border-l-4 border-amber-400' : 
      'bg-white border-l-4 border-blue-500'} shadow-sm hover:shadow-md`}>

      {/* Cabeçalho do Item */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <h3 className="text-lg font-bold text-gray-800">
            {item.quantidade}x {item.nome}
          </h3>
          {item.pagoComSelos && (
            <span className="ml-3 bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs flex items-center font-medium">
              <FaStamp className="mr-1" size={12} />
              {item.selosUsados} Selos
            </span>
          )}
        </div>
        <span className={`text-xl font-bold ${item.pagoComSelos ? 'text-green-600' : 'text-gray-900'}`}>
          {item.pagoComSelos ? 'Grátis' : formatCurrency(precoTotal)}
        </span>
      </div>

      {/* Detalhes Específicos */}
      <div className="space-y-2 pl-1">
        {/* Informações para Pizzas */}
        {isPizza && (
          <>
            {item.tamanho && (
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-700">Tamanho:</span> {item.tamanho}
              </p>
            )}

            {item.tipoMassa && (
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-700">Massa:</span> {item.tipoMassa}
              </p>
            )}

            {item.halfAndHalf && (
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-700">Meia a meia:</span> {item.halfPizza1Name} + {item.halfPizza2Name}
              </p>
            )}

            {item.nomeBorda && (
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-700">Borda:</span> {item.nomeBorda} (+{formatCurrency(item.precoBorda)})
              </p>
            )}
          </>
        )}

        {/* Informações para Bebidas */}
        {isBebida && item.descricao && (
          <p className="text-sm text-gray-600">
            <span className="font-medium text-gray-700">Detalhes:</span> {item.descricao}
          </p>
        )}

        {/* Extras (comum a todos os itens) */}
        {hasValidExtras && item.extras.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-1">Extras:</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              {item.extras.map((extra, idx) => (
                <li key={idx} className="text-sm text-gray-600 flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  {extra.nome} (+{formatCurrency(extra.preco)})
                </li>
              ))}
            </ul>
            <p className="mt-2 text-sm font-semibold text-gray-800">
              Total Extras: {formatCurrency(precoExtras)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const CustomerCard = ({ customer, onReset }) => {
  return (
    <ModernCard className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center">
            <FaUserCircle className="text-blue-500 mr-2" />
            {customer.nome}
          </h3>
          <div className="mt-2 space-y-1">
            <p className="text-sm text-gray-600 flex items-center">
              <FaMobileAlt className="mr-2 text-blue-400" />
              {customer.telefone}
            </p>
            <p className="text-sm text-gray-600 flex items-center">
              <FaStamp className="mr-2 text-amber-400" />
              {formatStamps(customer.selos)} acumulados
            </p>
          </div>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-blue-600 hover:text-blue-800 bg-blue-100 hover:bg-blue-200 px-2 py-1 rounded-full transition-colors"
        >
          Nova busca
        </button>
      </div>
    </ModernCard>
  );
};

const OrderCard = ({ order, onPrint, onDelete, onCancel, onMarkAsReady, onAssignDelivery }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [deliveryPerson, setDeliveryPerson] = useState(order.entregador || '');
  const [isEditingDelivery, setIsEditingDelivery] = useState(false);

  const handleAssignDelivery = async () => {
    try {
      await onAssignDelivery(order.id, deliveryPerson);
      setIsEditingDelivery(false);
      toast.success('Entregador atribuído com sucesso!');
    } catch (error) {
      console.error("Erro ao atualizar entregador:", error);
      toast.error('Erro ao atribuir entregador');
    }
  };

  return (
    <div className="relative p-4 mb-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-700"
          >
            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          <div>
            <h3 className="text-lg font-bold text-gray-800">
              #{order.numeroPedido || order.id.substring(0, 5)} - {order.cliente?.nome || 'Cliente não informado'}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs text-gray-500 flex items-center">
                <FaClock className="mr-1" size={10} />
                {getTimeDifference(order.criadoEm)}
              </span>
              {order.pagoComSelos && (
                <Badge color="stamp" className="text-xs">
                  <FaStamp size={10} className="mr-1" />
                  Pago com Selos
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            order.status === 'pronto' 
              ? 'bg-green-100 text-green-800' 
              : order.status === 'cancelado'
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
          }`}>
            {order.status === 'pronto' 
              ? 'PRONTO' 
              : order.status === 'cancelado'
                ? 'CANCELADO'
                : 'PENDENTE'}
          </span>
          <button
            onClick={() => onPrint(order)}
            className="p-1 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-full flex items-center transition-colors shadow-sm text-xs"
          >
            <FaPrint size={12} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-3">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center mb-2">
                  <div className="bg-blue-100 p-1.5 rounded-full mr-2">
                    <FaUserCircle className="text-blue-600 text-lg" />
                  </div>
                  <h4 className="text-md font-semibold text-gray-800">Cliente</h4>
                </div>
                <div className="space-y-1 pl-9">
                  <p className="text-sm">
                    <span className="block text-xs text-gray-500 font-medium">Nome</span>
                    <span className="font-medium">{order.cliente?.nome || 'Não informado'}</span>
                  </p>
                  <p className="text-sm">
                    <span className="block text-xs text-gray-500 font-medium">Telefone</span>
                    <span className="font-medium">{order.cliente?.telefone || 'Não informado'}</span>
                  </p>
                  {order.cliente?.nif && (
                    <p className="text-sm">
                      <span className="block text-xs text-gray-500 font-medium">NIF</span>
                      <span className="font-mono">{order.cliente.nif}</span>
                    </p>
                  )}
                </div>
              </div>

              {order.observacoes && (
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <div className="flex items-center mb-1">
                    <div className="bg-amber-100 p-1.5 rounded-full mr-2">
                      <FaInfoCircle className="text-amber-600 text-lg" />
                    </div>
                    <h4 className="text-md font-semibold text-amber-800">Observações</h4>
                  </div>
                  <p className="text-sm pl-9">{order.observacoes}</p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className={`p-4 rounded-lg border ${
                order.tipoEntrega === 'entrega' 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center mb-2">
                  <div className={`p-1.5 rounded-full mr-2 ${
                    order.tipoEntrega === 'entrega' 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    <FaMotorcycle className="text-lg" />
                  </div>
                  <h4 className="text-md font-semibold">
                    {order.tipoEntrega === 'entrega' ? 'Entrega' : 'Retirada'}
                  </h4>
                </div>
                
                {order.tipoEntrega === 'entrega' ? (
                  <div className="space-y-2 pl-9">
                    <div>
                      <span className="block text-xs text-gray-500 font-medium">Endereço</span>
                      <p className="font-medium text-sm">{order.enderecoCompleto || 'Não informado'}</p>
                    </div>
                    
                    {order.cliente?.codigoPostal && (
                      <div>
                        <span className="block text-xs text-gray-500 font-medium">Código Postal</span>
                        <p className="font-mono text-sm">{order.cliente.codigoPostal}</p>
                      </div>
                    )}
                    
                    {order.zonaEntrega && (
                      <div>
                        <span className="block text-xs text-gray-500 font-medium">Zona de Entrega</span>
                        <p className="text-sm">{order.zonaEntrega}</p>
                      </div>
                    )}
                    
                    <div className="pt-1 border-t border-gray-200 mt-1">
                      <span className="block text-xs text-gray-500 font-medium">Taxa de Entrega</span>
                      <p className="text-green-600 font-bold text-sm">{formatCurrency(order.taxaEntrega || 0)}</p>
                    </div>
                    
                    {order.status === 'pronto' && (
                      <div className="pt-1 border-t border-gray-200 mt-1">
                        <span className="block text-xs text-gray-500 font-medium">Entregador</span>
                        {isEditingDelivery ? (
                          <div className="flex items-center space-x-2 mt-1">
                            <input
                              type="text"
                              value={deliveryPerson}
                              onChange={(e) => setDeliveryPerson(e.target.value)}
                              className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                              placeholder="Nome do entregador"
                            />
                            <button
                              onClick={handleAssignDelivery}
                              className="bg-green-600 text-white px-2 py-1 rounded text-xs"
                            >
                              OK
                            </button>
                            <button
                              onClick={() => setIsEditingDelivery(false)}
                              className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">
                              {order.entregador || 'Não atribuído'}
                            </p>
                            <button
                              onClick={() => {
                                setDeliveryPerson(order.entregador || '');
                                setIsEditingDelivery(true);
                              }}
                              className="text-blue-600 hover:text-blue-800 text-xs"
                            >
                              Editar
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm pl-9 text-gray-600">O cliente irá retirar no estabelecimento</p>
                )}
              </div>

              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                <div className="flex items-center mb-2">
                  <div className="bg-indigo-100 p-1.5 rounded-full mr-2">
                    {paymentIcons[order.metodoPagamento] || <FaMoneyBillWave className="text-indigo-600 text-lg" />}
                  </div>
                  <h4 className="text-md font-semibold text-indigo-800">Pagamento</h4>
                </div>
                
                <div className="space-y-2 pl-9">
                  <div>
                    <span className="block text-xs text-gray-500 font-medium">Método</span>
                    <p className="font-medium text-sm">{order.metodoPagamento?.toUpperCase() || 'NÃO INFORMADO'}</p>
                  </div>
                  
                  {order.metodoPagamento === 'dinheiro' && (
                    <>
                      <div>
                        <span className="block text-xs text-gray-500 font-medium">Valor Pago</span>
                        <p className="font-medium text-sm">
                          {order.detalhesPagamento?.valorPago 
                            ? formatCurrency(order.detalhesPagamento.valorPago) 
                            : 'Não informado'}
                        </p>
                      </div>
                      <div>
                        <span className="block text-xs text-gray-500 font-medium">Troco</span>
                        <p className="font-medium text-sm">
                          {order.detalhesPagamento?.troco 
                            ? formatCurrency(order.detalhesPagamento.troco) 
                            : '0,00€'}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center mb-2">
                  <div className="bg-purple-100 p-1.5 rounded-full mr-2">
                    <FaListUl className="text-purple-600 text-lg" />
                  </div>
                  <h4 className="text-md font-semibold text-gray-800">Itens do Pedido</h4>
                </div>
                
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {(order.itens || []).map((item, index) => (
                    <OrderItem key={index} item={item} />
                  ))}
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Subtotal:</span>
                    <span className="font-medium text-sm">{formatCurrency(order.subtotal || 0)}</span>
                  </div>
                  
                  {order.tipoEntrega === 'entrega' && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Taxa de entrega:</span>
                      <span className="text-sm">{formatCurrency(order.taxaEntrega || 0)}</span>
                    </div>
                  )}
                  
                  {order.selosUsados > 0 && (
                    <div className="flex justify-between text-amber-700">
                      <span className="text-xs">Desconto (selos):</span>
                      <span className="text-xs">-{formatCurrency((order.subtotal + (order.taxaEntrega || 0) - (order.total || 0)))}</span>
                    </div>
                  )}

                  <div className="pt-2 mt-1 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-800 text-sm">Total:</span>
                      <span className="text-xl font-bold text-green-600">
                        {formatCurrency(order.total || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-2 pt-3 border-t border-gray-200 mt-4">
            {order.status !== 'cancelado' && (
              <>
                <button
                  onClick={() => onDelete(order.id)}
                  className="px-3 py-1.5 border border-red-200 text-red-700 bg-white hover:bg-red-50 rounded-lg flex items-center transition-colors shadow-sm text-xs"
                >
                  <FaTrash className="mr-1" size={12} />
                  Remover
                </button>
                
                {order.status !== 'pronto' && (
                  <>
                    <button
                      onClick={() => onCancel(order.id)}
                      className="px-3 py-1.5 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg flex items-center transition-colors shadow-sm text-xs"
                    >
                      <FaTimes className="mr-1" size={12} />
                      Cancelar
                    </button>
                    <button
                      onClick={() => onMarkAsReady(order.id)}
                      className="px-3 py-1.5 bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 rounded-lg flex items-center transition-colors shadow-sm text-xs"
                    >
                      <FaRegCheckCircle className="mr-1" size={12} />
                      Pronto
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const DeliveryPerformance = ({ orders }) => {
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 7)));
  const [endDate, setEndDate] = useState(new Date());
  const [deliveryStats, setDeliveryStats] = useState([]);

  useEffect(() => {
    const calculateDeliveryStats = () => {
      const stats = {};
      
      // Filtra pedidos no intervalo de datas
      const filteredOrders = orders.filter(order => {
        const orderDate = order.criadoEm?.toDate ? order.criadoEm.toDate() : new Date(order.criadoEm);
        return (
          order.tipoEntrega === 'entrega' && 
          order.status === 'pronto' &&
          orderDate >= startDate && 
          orderDate <= endDate
        );
      });

      // Calcula dados para cada entregador
      filteredOrders.forEach(order => {
        // Normaliza nome do entregador para evitar duplicações
        const deliverer = order.entregador 
          ? order.entregador.trim().toLowerCase()
          : 'não atribuído';
        const displayName = order.entregador 
          ? order.entregador.trim()
          : 'Não atribuído';
        
        if (!stats[deliverer]) {
          stats[deliverer] = {
            name: displayName,
            deliveries: 0,
            totalRevenue: 0,
            orders: []
          };
        }
        
        stats[deliverer].deliveries += 1;
        if (order.metodoPagamento === 'dinheiro') {
          stats[deliverer].totalRevenue += order.total || 0;
        }
        stats[deliverer].orders.push(order);
      });

      // Converte para array e ordena por número de entregas
      return Object.values(stats)
        .sort((a, b) => b.deliveries - a.deliveries);
    };

    setDeliveryStats(calculateDeliveryStats());
  }, [orders, startDate, endDate]);

  const prepareExportData = () => {
    return deliveryStats.map(deliverer => ({
      'Entregador': deliverer.name,
      'Entregas Realizadas': deliverer.deliveries,
      'Valor Total Recebido (€)': deliverer.totalRevenue,
      'Média por Entrega (€)': (deliverer.totalRevenue / deliverer.deliveries).toFixed(2),
      'Pedidos': deliverer.orders.map(order => `#${order.numeroPedido || order.id.substring(0, 5)} - ${formatCurrency(order.total)}`).join('; ')
    }));
  };

  return (
    <ModernCard className="p-4">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center">
          <FaMotorcycle className="text-blue-500 mr-2" />
          Desempenho dos Estafetas
        </h3>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center">
            <label className="mr-2 text-sm text-gray-700">De:</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm"
            />
          </div>
          <div className="flex items-center">
            <label className="mr-2 text-sm text-gray-700">Até:</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm"
            />
          </div>
          <CSVLink
            data={prepareExportData()}
            filename={`desempenho-estafetas-${formatDate(startDate)}-a-${formatDate(endDate)}.csv`}
            className="px-3 py-1 bg-green-600 text-white rounded-md text-sm flex items-center hover:bg-green-700"
          >
            <FaFileExport className="mr-1" />
            Exportar
          </CSVLink>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estafeta</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entregas Realizadas</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor Total Recebido</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Média por Entrega</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {deliveryStats.length > 0 ? (
              deliveryStats.map((deliverer) => (
                <tr key={deliverer.name} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {deliverer.name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {deliverer.deliveries} entregas
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-green-600">
                    {formatCurrency(deliverer.totalRevenue)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(deliverer.totalRevenue / deliverer.deliveries)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-4 py-8 text-center text-sm text-gray-500">
                  Nenhum dado de entrega disponível para o período selecionado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <ModernCard className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-semibold text-gray-800 flex items-center">
              <FaChartBar className="text-blue-500 mr-2" />
              Entregas por Estafeta
            </h4>
          </div>
          <div className="h-64">
            <Bar
              data={{
                labels: deliveryStats.map(d => d.name),
                datasets: [{
                  label: 'Entregas Realizadas',
                  data: deliveryStats.map(d => d.deliveries),
                  backgroundColor: 'rgba(79, 70, 229, 0.6)',
                  borderColor: 'rgba(79, 70, 229, 1)',
                  borderWidth: 1
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      precision: 0
                    }
                  }
                }
              }}
            />
          </div>
        </ModernCard>

        <ModernCard className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-semibold text-gray-800 flex items-center">
              <FaChartBar className="text-green-500 mr-2" />
              Valor Total por Estafeta
            </h4>
          </div>
          <div className="h-64">
            <Bar
              data={{
                labels: deliveryStats.map(d => d.name),
                datasets: [{
                  label: 'Valor Total (€)',
                  data: deliveryStats.map(d => d.totalRevenue),
                  backgroundColor: 'rgba(16, 185, 129, 0.6)',
                  borderColor: 'rgba(16, 185, 129, 1)',
                  borderWidth: 1
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function(value) {
                        return formatCurrency(value);
                      }
                    }
                  }
                },
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                          label += ': ';
                        }
                        label += formatCurrency(context.raw);
                        return label;
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </ModernCard>
      </div>
    </ModernCard>
  );
};


const AnalyticsDashboard = ({ orders }) => {
  const [timeRange, setTimeRange] = useState('today');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [exportData, setExportData] = useState([]);
  const [expandedDeliverers, setExpandedDeliverers] = useState({});

  // Ajusta a data final para incluir todo o dia
  const adjustedEndDate = new Date(endDate);
  adjustedEndDate.setHours(23, 59, 59, 999);

  const filteredOrders = orders.filter(order => {
    const orderDate = order.criadoEm?.toDate ? order.criadoEm.toDate() : new Date(order.criadoEm);
    const now = new Date();
    
    switch (timeRange) {
      case 'today':
        return orderDate.toDateString() === now.toDateString();
      case 'yesterday':
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        return orderDate.toDateString() === yesterday.toDateString();
      case 'last7':
        const last7 = new Date(now);
        last7.setDate(last7.getDate() - 7);
        return orderDate >= last7;
      case 'last30':
        const last30 = new Date(now);
        last30.setDate(last30.getDate() - 30);
        return orderDate >= last30;
      case 'month':
        return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
      case 'custom':
        return orderDate >= startDate && orderDate <= adjustedEndDate;
      default:
        return true;
    }
  });

  useEffect(() => {
    setExportData(prepareExportData());
  }, [filteredOrders]);

  const prepareExportData = () => {
    const data = filteredOrders.map(order => ({
      'Número': order.numeroPedido || order.id.substring(0, 5),
      'Data': formatDateTime(order.criadoEm),
      'Cliente': order.cliente?.nome || 'Não informado',
      'Telefone': order.cliente?.telefone || 'Não informado',
      'Tipo': order.tipoEntrega === 'entrega' ? 'Entrega' : 'Retirada',
      'Entregador': order.entregador || 'Não atribuído',
      'Método Pagamento': order.metodoPagamento?.toUpperCase() || 'NÃO INFORMADO',
      'Subtotal': formatCurrency(order.subtotal || 0),
      'Taxa Entrega': order.tipoEntrega === 'entrega' ? formatCurrency(order.taxaEntrega || 0) : '0,00€',
      'Total': formatCurrency(order.total || 0),
      'Status': order.status === 'pronto' ? 'PRONTO' : order.status === 'cancelado' ? 'CANCELADO' : 'PENDENTE',
      'Itens': order.itens?.map(item => `${item.quantidade}x ${item.nome}`).join('; ') || ''
    }));
    
    setExportData(data);
    return data;
  };

  const calculateMetrics = () => {
    const metrics = {
      totalOrders: 0,
      totalRevenue: 0,
      deliveryOrders: 0,
      pickupOrders: 0,
      cancelledOrders: 0,
      paymentMethods: {},
      itemsSold: {},
      hourlySales: Array(24).fill(0),
      dailySales: Array(7).fill(0),
      deliverers: {}
    };

    filteredOrders.forEach(order => {
      if (order.status === 'cancelado') {
        metrics.cancelledOrders++;
        return;
      }

      metrics.totalOrders++;
      metrics.totalRevenue += order.total || 0;

      if (order.tipoEntrega === 'entrega') {
        metrics.deliveryOrders++;
        if (order.entregador) {
          const delivererName = order.entregador;
          if (!metrics.deliverers[delivererName]) {
            metrics.deliverers[delivererName] = {
              count: 0,
              total: 0,
              orders: [],
              paymentMethods: {}
            };
          }
          metrics.deliverers[delivererName].count++;
          metrics.deliverers[delivererName].total += order.total || 0;
          metrics.deliverers[delivererName].orders.push(order);
          
          const paymentMethod = order.metodoPagamento || 'outro';
          metrics.deliverers[delivererName].paymentMethods[paymentMethod] = 
            (metrics.deliverers[delivererName].paymentMethods[paymentMethod] || 0) + 1;
        }
      } else {
        metrics.pickupOrders++;
      }

      const paymentMethod = order.metodoPagamento || 'outro';
      metrics.paymentMethods[paymentMethod] = (metrics.paymentMethods[paymentMethod] || 0) + 1;

      order.itens?.forEach(item => {
        const itemName = item.nome;
        metrics.itemsSold[itemName] = (metrics.itemsSold[itemName] || 0) + item.quantidade;
      });

      const orderHour = new Date(order.criadoEm?.toDate ? order.criadoEm.toDate() : new Date(order.criadoEm)).getHours();
      metrics.hourlySales[orderHour] += order.total || 0;

      const orderDay = new Date(order.criadoEm?.toDate ? order.criadoEm.toDate() : new Date(order.criadoEm)).getDay();
      metrics.dailySales[orderDay] += order.total || 0;
    });

    return metrics;
  };

  const metrics = calculateMetrics();

  const prepareChartData = () => {
    const paymentData = {
      labels: Object.keys(metrics.paymentMethods).map(method => 
        method.charAt(0).toUpperCase() + method.slice(1)
      ),
      datasets: [{
        data: Object.values(metrics.paymentMethods),
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }]
    };

    const sortedItems = Object.entries(metrics.itemsSold)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    const itemsData = {
      labels: sortedItems.map(item => item[0]),
      datasets: [{
        label: 'Quantidade Vendida',
        data: sortedItems.map(item => item[1]),
        backgroundColor: 'rgba(79, 70, 229, 0.6)',
        borderColor: 'rgba(79, 70, 229, 1)',
        borderWidth: 1
      }]
    };

    const hours = Array.from({ length: 24 }, (_, i) => `${i}h`);
    const hourlyData = {
      labels: hours,
      datasets: [{
        label: 'Vendas por Hora (€)',
        data: metrics.hourlySales,
        fill: false,
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
        borderColor: 'rgba(16, 185, 129, 1)',
        tension: 0.1
      }]
    };

    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const dailyData = {
      labels: days,
      datasets: [{
        label: 'Vendas por Dia (€)',
        data: metrics.dailySales,
        backgroundColor: 'rgba(245, 158, 11, 0.6)',
        borderColor: 'rgba(245, 158, 11, 1)',
        borderWidth: 1
      }]
    };

    return { paymentData, itemsData, hourlyData, dailyData };
  };

  const { paymentData, itemsData, hourlyData, dailyData } = prepareChartData();

  const toggleDelivererExpansion = (delivererName) => {
    setExpandedDeliverers(prev => ({
      ...prev,
      [delivererName]: !prev[delivererName]
    }));
  };

  return (
    <div className="space-y-6">
      <ModernCard className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setTimeRange('today')}
              className={`px-3 py-1 rounded-full text-sm ${timeRange === 'today' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Hoje
            </button>
            <button
              onClick={() => setTimeRange('yesterday')}
              className={`px-3 py-1 rounded-full text-sm ${timeRange === 'yesterday' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Ontem
            </button>
            <button
              onClick={() => setTimeRange('last7')}
              className={`px-3 py-1 rounded-full text-sm ${timeRange === 'last7' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Últimos 7 dias
            </button>
            <button
              onClick={() => setTimeRange('last30')}
              className={`px-3 py-1 rounded-full text-sm ${timeRange === 'last30' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Últimos 30 dias
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-3 py-1 rounded-full text-sm ${timeRange === 'month' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Este mês
            </button>
            <button
              onClick={() => {
                setTimeRange('custom');
                setShowDatePicker(!showDatePicker);
              }}
              className={`px-3 py-1 rounded-full text-sm flex items-center ${timeRange === 'custom' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <FaCalendarAlt className="mr-1" />
              Personalizado
            </button>
          </div>

          <CSVLink
            data={exportData}
            filename={`relatorio-pedidos-${new Date().toISOString().slice(0, 10)}.csv`}
            className="px-3 py-1 bg-green-600 text-white rounded-full text-sm flex items-center hover:bg-green-700"
          >
            <FaFileExport className="mr-1" />
            Exportar
          </CSVLink>
        </div>

        {showDatePicker && (
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <div className="flex items-center">
              <label className="mr-2 text-sm text-gray-700">De:</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm"
              />
            </div>
            <div className="flex items-center">
              <label className="mr-2 text-sm text-gray-700">Até:</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm"
              />
            </div>
            <button
              onClick={() => setShowDatePicker(false)}
              className="ml-2 px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200"
            >
              Aplicar
            </button>
          </div>
        )}
      </ModernCard>

      <DeliveryPerformance orders={orders} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ModernCard className="p-4 bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Pedidos</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.totalOrders}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FaListUl className="text-blue-600 text-xl" />
            </div>
          </div>
        </ModernCard>

        <ModernCard className="p-4 bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Faturamento Total</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.totalRevenue)}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FaMoneyBillWave className="text-green-600 text-xl" />
            </div>
          </div>
        </ModernCard>

        <ModernCard className="p-4 bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Pedidos de Entrega</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.deliveryOrders}</p>
              <p className="text-xs text-purple-600 mt-1">
                {metrics.totalOrders > 0 ? Math.round((metrics.deliveryOrders / metrics.totalOrders) * 100) : 0}% do total
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FaMotorcycle className="text-purple-600 text-xl" />
            </div>
          </div>
        </ModernCard>

        <ModernCard className="p-4 bg-gradient-to-br from-amber-50 to-amber-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-600 font-medium">Pedidos Cancelados</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.cancelledOrders}</p>
              <p className="text-xs text-amber-600 mt-1">
                {orders.length > 0 ? Math.round((metrics.cancelledOrders / orders.length) * 100) : 0}% do total
              </p>
            </div>
            <div className="bg-amber-100 p-3 rounded-full">
              <FaTimes className="text-amber-600 text-xl" />
            </div>
          </div>
        </ModernCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ModernCard className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <FaChartPie className="text-blue-500 mr-2" />
              Métodos de Pagamento
            </h3>
          </div>
          <div className="h-64">
            <Pie 
              data={paymentData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = Math.round((value / total) * 100);
                        return `${label}: ${value} (${percentage}%)`;
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </ModernCard>

        <ModernCard className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <FaChartBar className="text-purple-500 mr-2" />
              Itens Mais Vendidos
            </h3>
          </div>
          <div className="h-64">
            <Bar 
              data={itemsData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      precision: 0
                    }
                  }
                }
              }}
            />
          </div>
        </ModernCard>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <ModernCard className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <FaChartLine className="text-green-500 mr-2" />
              Vendas por Hora do Dia
            </h3>
          </div>
          <div className="h-64">
            <Line 
              data={hourlyData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          </div>
        </ModernCard>

        <ModernCard className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <FaChartBar className="text-amber-500 mr-2" />
              Vendas por Dia da Semana
            </h3>
          </div>
          <div className="h-64">
            <Bar 
              data={dailyData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          </div>
        </ModernCard>
      </div>

      <ModernCard className="p-4 overflow-x-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center">
            <FaMotorcycle className="text-gray-500 mr-2" />
            Desempenho dos Entregadores ({Object.keys(metrics.deliverers).length})
          </h3>
        </div>
        
        <div className="space-y-4">
          {Object.entries(metrics.deliverers).map(([delivererName, delivererData]) => (
            <div key={delivererName} className="border border-gray-200 rounded-lg overflow-hidden">
              <div 
                className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100"
                onClick={() => toggleDelivererExpansion(delivererName)}
              >
                <div className="flex items-center">
                  <FaUser className="text-gray-500 mr-3" />
                  <div>
                    <h4 className="font-bold text-gray-900">{delivererName}</h4>
                    <p className="text-sm text-gray-500">
                      {delivererData.count} entrega{delivererData.count !== 1 ? 's' : ''} • 
                      Total: {formatCurrency(delivererData.total)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex space-x-2 mr-4">
                    {Object.entries(delivererData.paymentMethods).map(([method, count]) => (
                      <span key={method} className="text-xs font-medium px-2 py-1 bg-gray-200 rounded-full">
                        {method.toUpperCase()}: {count}
                      </span>
                    ))}
                  </div>
                  <FaChevronDown className={`text-gray-500 transition-transform ${expandedDeliverers[delivererName] ? 'transform rotate-180' : ''}`} />
                </div>
              </div>
              
              {expandedDeliverers[delivererName] && (
                <div className="bg-white divide-y divide-gray-200">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pedido</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data/Hora</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pagamento</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {delivererData.orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{order.numeroPedido || order.id.substring(0, 5)}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {formatDateTime(order.criadoEm)}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {order.cliente?.nome || 'Não informado'}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {order.metodoPagamento?.toUpperCase() || 'NÃO INFORMADO'}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatCurrency(order.total || 0)}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {order.status === 'pronto' ? (
                              <Badge color="green">PRONTO</Badge>
                            ) : order.status === 'cancelado' ? (
                              <Badge color="red">CANCELADO</Badge>
                            ) : (
                              <Badge color="yellow">PENDENTE</Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
          
          {/* Pedidos sem entregador (retiradas) */}
          {metrics.pickupOrders > 0 && (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div 
                className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100"
                onClick={() => toggleDelivererExpansion('retiradas')}
              >
                <div className="flex items-center">
                  <FaStore className="text-gray-500 mr-3" />
                  <div>
                    <h4 className="font-bold text-gray-900">Pedidos de Retirada</h4>
                    <p className="text-sm text-gray-500">
                      {metrics.pickupOrders} pedido{metrics.pickupOrders !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <FaChevronDown className={`text-gray-500 transition-transform ${expandedDeliverers['retiradas'] ? 'transform rotate-180' : ''}`} />
              </div>
              
              {expandedDeliverers['retiradas'] && (
                <div className="bg-white divide-y divide-gray-200">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pedido</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data/Hora</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pagamento</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders
                        .filter(order => order.tipoEntrega !== 'entrega')
                        .map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                              #{order.numeroPedido || order.id.substring(0, 5)}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                              {formatDateTime(order.criadoEm)}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                              {order.cliente?.nome || 'Não informado'}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                              {order.metodoPagamento?.toUpperCase() || 'NÃO INFORMADO'}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                              {formatCurrency(order.total || 0)}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                              {order.status === 'pronto' ? (
                                <Badge color="green">PRONTO</Badge>
                              ) : order.status === 'cancelado' ? (
                                <Badge color="red">CANCELADO</Badge>
                              ) : (
                                <Badge color="yellow">PENDENTE</Badge>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </ModernCard>
    </div>
  );
};
const InterfaceAdmin = () => {
  const [activeTab, setActiveTab] = useState('pedidos');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [foundCustomer, setFoundCustomer] = useState(null);
  const [isSearchingCustomer, setIsSearchingCustomer] = useState(false);
  const [isUpdatingStamps, setIsUpdatingStamps] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [stampChange, setStampChange] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const listenerMounted = useRef(false);
  const [printingQueue, setPrintingQueue] = useState(new Set());
  const [internalOrders, setInternalOrders] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);

  const thermalPrinter = {
    printOrder: async (order) => {
      try {
        await axios.post('http://localhost:3001/api/print', order);
        toast.success('Pedido enviado para impressão!');
      } catch (error) {
        console.error('Erro ao imprimir:', error);
        toast.error('Erro ao enviar para impressão');
      }
    }
  };

const isProcessing = useRef(false);
const isInitialLoad = useRef(true);
const processedOrders = useRef(new Set());

useEffect(() => {
  const q = query(
    collection(db, "pedidos"),
    orderBy("criadoEm", "desc"),
    limit(50)
  );

  const unsubscribe = onSnapshot(q, async (snapshot) => {
    const updatedOrders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      criadoEm: doc.data().criadoEm?.toDate() || new Date()
    }));

    setOrders(updatedOrders);

    if (loading && isInitialLoad.current) {
      setLoading(false);
      isInitialLoad.current = false;
    }

    for (const change of snapshot.docChanges()) {
      if (change.type === 'added' && !isProcessing.current && !isInitialLoad.current) {
        const orderData = change.doc.data();
        const orderId = change.doc.id;

        if (orderData.status === 'impresso' || processedOrders.current.has(orderId)) continue;
        processedOrders.current.add(orderId);

        isProcessing.current = true;

        const pedidoRef = doc(db, "pedidos", orderId);

        try {
          await updateDoc(pedidoRef, {
            status: 'impresso',
            impressoEm: serverTimestamp(),
            impressoPor: auth.currentUser.uid
          });

          const orderToPrint = {
            id: orderId,
            ...orderData,
            criadoEm: orderData.criadoEm?.toDate() || new Date()
          };

          await thermalPrinter.printOrder(orderToPrint);

        } catch (error) {
          console.error("Erro ao processar pedido:", error);
          await updateDoc(pedidoRef, {
            status: 'pendente',
            impressoEm: null
          });
          processedOrders.current.delete(orderId);
        } finally {
          isProcessing.current = false;
        }
      }
    }
  });

  return () => unsubscribe();
}, [loading, thermalPrinter]);


const refreshOrders = async () => {
  setIsSyncing(true);
  try {
    const q = query(
      collection(db, 'pedidos'),
      orderBy('criadoEm', 'desc'),
      limit(50)
    );
    const snapshot = await getDocs(q);

    const firestoreOrders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      criadoEm: doc.data().criadoEm?.toDate() || new Date()
    }));

    setInternalOrders(firestoreOrders);
    
    setOrders(prevOrders => {
      const prevOrdersMap = new Map(prevOrders.map(o => [o.id, o]));
      
      return firestoreOrders.map(fsOrder => ({
        ...fsOrder,
        status: prevOrdersMap.get(fsOrder.id)?.status || fsOrder.status || 'pendente'
      }));
    });
  } catch (error) {
    console.error('Falha na sincronização:', error);
    setOrders(prevOrders => prevOrders);
  } finally {
    setIsSyncing(false);
  }
};

  useEffect(() => {
    refreshOrders();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'pedidos'), 
      (snapshot) => {
        if (!isSyncing) {
          refreshOrders();
        }
      }
    ));
    return () => unsubscribe();
  }, [isSyncing]);

  const markAsReady = async (orderId) => {
    try {
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: 'pronto' } : order
        )
      );

      await updateDoc(doc(db, 'pedidos', orderId), { 
        status: 'pronto',
        atualizadoEm: serverTimestamp(),
        atendidoPor: auth.currentUser.uid
      });

      console.log(`Pedido ${orderId} marcado como pronto`);
    } catch (error) {
      console.error("Erro ao atualizar pedido:", error);
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: 'pendente' } : order
        )
      );
    }
  };

  const assignDeliveryPerson = async (orderId, deliveryPerson) => {
    try {
      await updateDoc(doc(db, 'pedidos', orderId), {
        entregador: deliveryPerson,
        atualizadoEm: serverTimestamp()
      });
      
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, entregador: deliveryPerson } : order
        )
      );
      toast.success(`Entregador ${deliveryPerson} atribuído ao pedido`);
    } catch (error) {
      console.error("Erro ao atribuir entregador:", error);
      toast.error('Erro ao atribuir entregador');
      throw error;
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      await updateDoc(doc(db, 'pedidos', orderId), {
        status: 'cancelado',
        atualizadoEm: serverTimestamp(),
        canceladoPor: auth.currentUser.uid
      });
      toast.success('Pedido cancelado com sucesso!');
    } catch (error) {
      console.error("Erro ao cancelar pedido:", error);
      toast.error(`Erro ao cancelar pedido: ${error.message}`);
    }
  };

  const handleDeleteClick = (orderId) => {
    setOrderToDelete(orderId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!orderToDelete) return;
    
    try {
      await deleteDoc(doc(db, 'pedidos', orderToDelete));
      setOrders(prevOrders => prevOrders.filter(order => order.id !== orderToDelete));
      toast.success('Pedido removido com sucesso!');
    } catch (error) {
      console.error("Erro ao remover pedido:", error);
      toast.error(`Erro ao remover pedido: ${error.message}`);
    } finally {
      setShowDeleteConfirm(false);
      setOrderToDelete(null);
    }
  };

  const searchCustomer = async () => {
    if (!customerSearchTerm.trim()) {
      toast.warn('Por favor, insira um email ou telefone para buscar');
      return;
    }

    setIsSearchingCustomer(true);
    try {
      const usersRef = collection(db, 'users');
      
      let q = query(
        usersRef, 
        where('email', '>=', customerSearchTerm.trim().toLowerCase()),
        where('email', '<=', customerSearchTerm.trim().toLowerCase() + '\uf8ff')
      );
      let snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        q = query(usersRef, where('phone', '==', customerSearchTerm.trim()));
        snapshot = await getDocs(q);
      }
      
      if (snapshot.empty) {
        toast.warn('Nenhum cliente encontrado com os dados informados');
        setFoundCustomer(null);
        return;
      }
      
      const userDoc = snapshot.docs[0];
      const customerData = userDoc.data();
      
      setFoundCustomer({
        id: userDoc.id,
        nome: `${customerData.firstName || ''} ${customerData.lastName || ''}`.trim() || 'Não informado',
        email: customerData.email || 'Não informado',
        telefone: customerData.phone || 'Não informado',
        selos: parseInt(customerData.selos) || 0
      });
      
      setStampChange(0);
      setShowSuccess(false);
      toast.success('Cliente encontrado com sucesso!');

    } catch (error) {
      console.error('Erro na busca:', error);
      toast.error(`Erro ao buscar cliente: ${error.message}`);
    } finally {
      setIsSearchingCustomer(false);
    }
  };

  const updateCustomerStamps = async () => {
    if (!foundCustomer || stampChange === 0) {
      toast.warn('Nenhuma alteração para salvar');
      return;
    }

    const newStampsCount = foundCustomer.selos + stampChange;
    if (newStampsCount < 0) {
      toast.warn('O número de selos não pode ser negativo');
      return;
    }

    setIsUpdatingStamps(true);
    try {
      await updateDoc(doc(db, 'users', foundCustomer.id), { 
        selos: newStampsCount,
        selosAtualizadoEm: serverTimestamp(),
        selosAtualizadoPor: auth.currentUser.uid
      });
      
      setFoundCustomer({
        ...foundCustomer,
        selos: newStampsCount
      });
      setStampChange(0);
      setShowSuccess(true);
      
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Erro ao atualizar selos:', error);
      toast.error(`Erro ao atualizar selos: ${error.message}`);
    } finally {
      setIsUpdatingStamps(false);
    }
  };

  const resetCustomerSearch = () => {
    setFoundCustomer(null);
    setCustomerSearchTerm('');
    setStampChange(0);
    setShowSuccess(false);
  };

  const filteredOrders = orders.filter(order => {
    if (searchTerm) {
      const matchesSearch = 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.cliente.nome && order.cliente.nome.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (order.cliente.telefone && order.cliente.telefone.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (order.entregador && order.entregador.toLowerCase().includes(searchTerm.toLowerCase()));
      
      if (!matchesSearch) return false;
    }
    
    if (activeTab === 'pedidos') return order.status !== 'pronto' && order.status !== 'cancelado';
    if (activeTab === 'prontos') return order.status === 'pronto';
    if (activeTab === 'cancelados') return order.status === 'cancelado';
    if (activeTab === 'relatorios') return true;
    
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Confirmar Remoção"
        message="Tem certeza que deseja remover este pedido permanentemente? Esta ação não pode ser desfeita."
      />

      <header className="bg-gradient-to-r from-green-600 to-green-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg shadow">
                <FaUtensils className="text-green-600 text-xl" />
              </div>
              <h1 className="text-xl font-bold text-white">Painel Administrativo</h1>
            </div>
            <button 
              onClick={refreshOrders}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Atualizar
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4">
        <div className="flex overflow-x-auto border-b border-gray-200 mb-4">
          <button
            onClick={() => setActiveTab('pedidos')}
            className={`${activeTab === 'pedidos' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} py-3 px-4 border-b-2 font-medium text-sm flex items-center whitespace-nowrap`}
          >
            <FaListUl className="mr-2" />
            Pedidos
            {orders.filter(o => o.status !== 'pronto' && o.status !== 'cancelado').length > 0 && (
              <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                {orders.filter(o => o.status !== 'pronto' && o.status !== 'cancelado').length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('prontos')}
            className={`${activeTab === 'prontos' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} py-3 px-4 border-b-2 font-medium text-sm flex items-center whitespace-nowrap`}
          >
            <FaCheck className="mr-2" />
            Prontos
            {orders.filter(o => o.status === 'pronto').length > 0 && (
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                {orders.filter(o => o.status === 'pronto').length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('selos')}
            className={`${activeTab === 'selos' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} py-3 px-4 border-b-2 font-medium text-sm flex items-center whitespace-nowrap`}
          >
            <FaStamp className="mr-2" />
            Gerenciar Selos
          </button>
          <button
            onClick={() => setActiveTab('relatorios')}
            className={`${activeTab === 'relatorios' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} py-3 px-4 border-b-2 font-medium text-sm flex items-center whitespace-nowrap`}
          >
            <FaChartLine className="mr-2" />
            Relatórios
          </button>
        </div>

        {activeTab === 'relatorios' ? (
          <AnalyticsDashboard orders={orders} />
        ) : activeTab !== 'selos' ? (
          <ModernCard>
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="max-w-md mx-auto">
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 pr-12 py-2 border-gray-300 rounded-md text-sm"
                    placeholder="Buscar pedidos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {loading ? (
              <div className="py-12 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="py-12 text-center">
                <FaBoxOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">
                  {searchTerm ? 'Nenhum pedido encontrado' : `Nenhum pedido ${activeTab === 'prontos' ? 'pronto' : 'pendente'}`}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm ? 'Tente ajustar sua busca' : 'Novos pedidos aparecerão aqui automaticamente'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onPrint={thermalPrinter.printOrder}
                    onDelete={handleDeleteClick}
                    onCancel={cancelOrder}
                    onMarkAsReady={markAsReady}
                    onAssignDelivery={assignDeliveryPerson}
                  />
                ))}
              </div>
            )}
          </ModernCard>
        ) : (
          <ModernCard>
            <div className="p-4">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 flex items-center">
                <FaStamp className="text-amber-500 mr-2" />
                Gerenciamento de Selos de Fidelidade
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                  <ModernCard className="p-4 border-amber-100">
                    <h3 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                      <FaSearch className="text-blue-500 mr-2" />
                      Localizar Cliente
                    </h3>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Pesquisar por e-mail ou telefone
                        </label>
                        <div className="flex rounded-md shadow-sm">
                          <div className="relative flex-grow focus-within:z-10">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FaUser className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              className="focus:ring-blue-500 focus:border-blue-500 block w-full rounded-l-md pl-10 sm:text-sm border-gray-300 h-9"
                              placeholder="exemplo@email.com ou 912345678"
                              value={customerSearchTerm}
                              onChange={(e) => setCustomerSearchTerm(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && searchCustomer()}
                            />
                          </div>
                          <button
                            onClick={searchCustomer}
                            disabled={isSearchingCustomer}
                            className="-ml-px relative inline-flex items-center space-x-1 px-3 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors h-9"
                          >
                            {isSearchingCustomer ? (
                              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <FaSearch className="h-4 w-4 text-white" />
                            )}
                            <span className="hidden sm:inline">Buscar</span>
                          </button>
                        </div>
                      </div>
                      
                      {foundCustomer && !showSuccess && (
                        <CustomerCard customer={foundCustomer} onReset={resetCustomerSearch} />
                      )}
                    </div>
                  </ModernCard>
                </div>
                
                <div className="space-y-4">
                  <ModernCard className="p-4 h-full border-amber-100">
                    {showSuccess ? (
                      <div className="text-center py-3 animate-fade-in">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full mb-2">
                          <FaStamp className="w-6 h-6 text-amber-600" />
                        </div>
                        <h3 className="text-md font-bold text-gray-900 mb-1">Saldo atualizado com sucesso!</h3>
                        <p className="text-sm text-gray-600">
                          Novo saldo: {formatStamps(foundCustomer.selos)}
                        </p>
                        <button
                          onClick={() => setShowSuccess(false)}
                          className="mt-3 px-3 py-1 bg-amber-100 text-amber-800 rounded-md hover:bg-amber-200 transition-colors text-xs"
                        >
                          Voltar
                        </button>
                      </div>
                    ) : foundCustomer ? (
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full mb-2">
                            <FaStamp className="w-6 w-6 text-amber-600" />
                          </div>
                          <h3 className="text-md font-bold text-gray-900 mb-1">
                            Saldo Atual: {formatStamps(foundCustomer.selos)}
                          </h3>
                          <p className="text-xs text-gray-500 mb-3">
                            Gerencie os selos deste cliente
                          </p>
                        </div>
                        
                        <div className="space-y-3">
                          <button
                            onClick={() => setStampChange(prev => prev - 1)}
                            disabled={foundCustomer.selos + stampChange <= 0}
                            className={`w-full py-2 border border-transparent rounded-md shadow-sm text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all ${foundCustomer.selos + stampChange <= 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'}`}
                          >
                            <FaMinus className="mr-1 inline" />
                            Remover 1 Selo
                          </button>
                          
                          <button
                            onClick={() => setStampChange(prev => prev + 1)}
                            className="w-full py-2 bg-green-600 border border-transparent rounded-md shadow-sm text-xs font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all"
                          >
                            <FaPlus className="mr-1 inline" />
                            Adicionar 1 Selo
                          </button>
                          
                          {stampChange !== 0 && (
                            <div className="bg-gray-50 p-2 rounded-md border border-gray-200">
                              <p className="text-xs text-gray-700 text-center">
                                Alteração pendente: 
                                <span className={`font-bold ml-1 ${stampChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {stampChange > 0 ? '+' : ''}{stampChange} selo{Math.abs(stampChange) !== 1 ? 's' : ''}
                                </span>
                              </p>
                              <p className="text-xs text-gray-700 text-center mt-1">
                                Novo saldo: {formatStamps(foundCustomer.selos + stampChange)}
                              </p>
                            </div>
                          )}
                          
                          <button
                            onClick={updateCustomerStamps}
                            disabled={stampChange === 0 || isUpdatingStamps}
                            className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 border border-transparent rounded-md shadow-sm text-xs font-medium text-white hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99]"
                          >
                            {isUpdatingStamps ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processando...
                              </>
                            ) : (
                              <>
                                <FaStamp className="mr-1 inline" />
                                Atualizar Saldo
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-2">
                          <FaStamp className="w-6 h-6 text-gray-400" />
                        </div>
                        <h3 className="text-md font-bold text-gray-900 mb-1">
                          Programa de Fidelidade
                        </h3>
                        <p className="text-xs text-gray-500">
                          Busque um cliente para visualizar e gerenciar seus selos de fidelidade
                        </p>
                      </div>
                    )}
                  </ModernCard>
                </div>
              </div>
            </div>
          </ModernCard>
        )}
      </main>
    </div>
  );
};

export default InterfaceAdmin;