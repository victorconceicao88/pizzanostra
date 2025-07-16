import React, { useState, useEffect,useRef } from 'react';
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
  limit
} from 'firebase/firestore';
import { 
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
  FaTimes
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

// Componentes de UI
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

// Utilitários
const formatCurrency = (value) => new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(value);
const formatStamps = (count) => `${count} selo${count !== 1 ? 's' : ''}`;

const paymentIcons = {
  dinheiro: <FaMoneyBillWave className="text-green-500" />,
  cartão: <FaCreditCard className="text-blue-500" />, 
  mbway: <FaMobileAlt className="text-purple-500" />,
  selos: <div className="relative">
    <FaStamp className="text-amber-500 absolute animate-ping" />
    <FaStamp className="text-amber-500 relative" />
  </div>
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
useEffect(() => {
  // Flag para controlar se já estamos processando um pedido
  let isProcessing = false;

  const q = query(
    collection(db, "pedidos"),
    orderBy("criadoEm", "desc"),
    limit(50)
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    // Atualiza a lista de pedidos
    const updatedOrders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      criadoEm: doc.data().criadoEm?.toDate() || new Date()
    }));

    setOrders(updatedOrders);

    // Evita loop de carregamento chamando setLoading(false) apenas uma vez
    if (loading) {
      setLoading(false);
    }

    // Processa apenas novos pedidos não impressos
    snapshot.docChanges().forEach(async (change) => {
      if (change.type === 'added' && !isProcessing) {
        const orderData = change.doc.data();

        // Ignora pedidos já marcados como impressos
        if (orderData.status === 'impresso') return;

        isProcessing = true;

        try {
          // Marca como impresso ANTES de imprimir
          await updateDoc(doc(db, "pedidos", change.doc.id), {
            status: 'impresso',
            impressoEm: serverTimestamp(),
            impressoPor: auth.currentUser.uid
          });

          // Prepara os dados do pedido
          const orderToPrint = {
            id: change.doc.id,
            ...orderData,
            criadoEm: orderData.criadoEm?.toDate() || new Date()
          };

          // Envia para impressão
          await thermalPrinter.printOrder(orderToPrint);

        } catch (error) {
          console.error("Erro ao processar pedido:", error);

          // Reverte o status em caso de erro
          await updateDoc(doc(db, "pedidos", change.doc.id), {
            status: 'pendente',
            impressoEm: null
          });
        } finally {
          isProcessing = false;
        }
      }
    });
  });

  return () => unsubscribe();
}, []);



  const refreshOrders = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'pedidos'),
        orderBy('criadoEm', 'desc'),
        limit(50)
      );
      
      const snapshot = await getDocs(q);
      const ordersData = snapshot.docs.map(doc => {
        const data = doc.data();
        const timestamp = data.criadoEm;
        
        return {
          id: doc.id,
          ...data,
          enderecoCompleto: data.enderecoCompleto || 
                       (data.cliente?.endereco && data.cliente?.localidade 
                        ? `${data.cliente.endereco}, ${data.cliente.localidade}` 
                        : null),
          zonaEntrega: data.zonaEntrega || null,
          bairro: data.bairro || data.cliente?.localidade || null,
          tipoEntrega: data.tipoEntrega || 
                  (data.cliente?.endereco ? 'entrega' : 'retirada'),
          cliente: {
            nome: data.cliente?.nome || 'Não informado',
            telefone: data.cliente?.telefone || 'Não informado',
            endereco: data.cliente?.endereco || null,
            localidade: data.cliente?.localidade || null,
            codigoPostal: data.cliente?.codigoPostal || null,
            nif: data.cliente?.nif || null,
            userId: data.cliente?.userId || null
          },
          criadoEm: timestamp ? timestamp.toDate() : new Date()
        };
      });
      
      setOrders(ordersData);
    } catch (error) {
      console.error("Erro ao atualizar pedidos:", error);
      toast.error("Erro ao atualizar pedidos");
    } finally {
      setLoading(false);
    }
  };

  const markAsReady = async (orderId) => {
    try {
      await updateDoc(doc(db, 'pedidos', orderId), { 
        status: 'pronto',
        atualizadoEm: serverTimestamp(),
        atendidoPor: auth.currentUser.uid
      });
      toast.success('Pedido marcado como pronto!');
    } catch (error) {
      console.error("Erro ao atualizar pedido:", error);
      toast.error(`Erro ao atualizar pedido: ${error.message}`);
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
      
      // Atualiza o estado local imediatamente
      setOrders(prevOrders => prevOrders.filter(order => order.id !== orderToDelete));
      
      toast.success('Pedido removido com sucesso!');
    } catch (error) {
      console.error("Erro ao remover pedido:", error);
      toast.error(`Erro ao remover pedido: ${error.message}`);
      
      // Força um refresh em caso de erro para garantir sincronização
      refreshOrders();
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

  const getTimeDifference = (date) => {
    if (!date) return '--';
    const now = new Date();
    const orderDate = date?.toDate ? date.toDate() : new Date(date);
    const diffInMinutes = Math.floor((now - orderDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Agora mesmo';
    if (diffInMinutes < 60) return `${diffInMinutes} min atrás`;
    return `${Math.floor(diffInMinutes / 60)}h ${diffInMinutes % 60}min atrás`;
  };

  const filteredOrders = orders.filter(order => {
    if (searchTerm) {
      const matchesSearch = 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.cliente.nome && order.cliente.nome.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (order.cliente.telefone && order.cliente.telefone.toLowerCase().includes(searchTerm.toLowerCase()));
      
      if (!matchesSearch) return false;
    }
    
    if (activeTab === 'pedidos') return order.status !== 'pronto' && order.status !== 'cancelado';
    if (activeTab === 'prontos') return order.status === 'pronto';
    if (activeTab === 'cancelados') return order.status === 'cancelado';
    
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('pedidos')}
            className={`${activeTab === 'pedidos' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} py-4 px-6 border-b-2 font-medium text-sm flex items-center`}
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
            className={`${activeTab === 'prontos' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} py-4 px-6 border-b-2 font-medium text-sm flex items-center`}
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
            className={`${activeTab === 'selos' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} py-4 px-6 border-b-2 font-medium text-sm flex items-center`}
          >
            <FaStamp className="mr-2" />
            Gerenciar Selos
          </button>
        </div>

        {activeTab !== 'selos' ? (
          <ModernCard>
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="max-w-md mx-auto">
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 pr-12 py-3 border-gray-300 rounded-md"
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
                  <div key={order.id} className="relative p-6 mb-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                    
                    <div className="flex flex-col space-y-6">
                      {/* Cabeçalho */}
                      <div className="flex flex-wrap justify-between items-start gap-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 flex items-center">
                            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-md mr-3 font-mono">
                              #{order.numeroPedido || order.id.substring(0, 5)}
                            </span>
                            {order.cliente?.nome || 'Cliente não informado'}
                          </h3>
                          <div className="flex items-center space-x-3 mt-2">
                            <span className="text-sm text-gray-500 flex items-center">
                              <FaClock className="mr-1" />
                              {getTimeDifference(order.criadoEm)}
                            </span>
                            {order.pagoComSelos && (
                              <span className="bg-gradient-to-r from-amber-400 to-amber-600 text-white px-2 py-1 rounded-full text-xs flex items-center">
                                <FaStamp className="mr-1" />
                                Pago com Selos
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
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
                            onClick={() => thermalPrinter.printOrder(order)}
                            className="px-3 py-1 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-full flex items-center transition-colors shadow-sm text-xs"
                          >
                            <FaPrint className="mr-1" size={12} />
                            Reimprimir
                          </button>
                        </div>
                      </div>

                      {/* Corpo do pedido */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Coluna 1: Informações do cliente */}
                        <div className="space-y-4">
                          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                            <div className="flex items-center mb-3">
                              <div className="bg-blue-100 p-2 rounded-full mr-3">
                                <FaUserCircle className="text-blue-600 text-xl" />
                              </div>
                              <h4 className="text-lg font-semibold text-gray-800">Cliente</h4>
                            </div>
                            <div className="space-y-2 pl-11">
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
                            <div className="bg-amber-50 p-5 rounded-lg border border-amber-200">
                              <div className="flex items-center mb-2">
                                <div className="bg-amber-100 p-2 rounded-full mr-3">
                                  <FaInfoCircle className="text-amber-600 text-xl" />
                                </div>
                                <h4 className="text-lg font-semibold text-amber-800">Observações</h4>
                              </div>
                              <p className="text-sm pl-11">{order.observacoes}</p>
                            </div>
                          )}
                        </div>

                        {/* Coluna 2: Entrega e pagamento */}
                        <div className="space-y-4">
                          <div className={`p-5 rounded-lg border ${
                            order.tipoEntrega === 'entrega' 
                              ? 'bg-green-50 border-green-200' 
                              : 'bg-gray-50 border-gray-200'
                          }`}>
                            <div className="flex items-center mb-3">
                              <div className={`p-2 rounded-full mr-3 ${
                                order.tipoEntrega === 'entrega' 
                                  ? 'bg-green-100 text-green-600' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                <FaMotorcycle className="text-xl" />
                              </div>
                              <h4 className="text-lg font-semibold">
                                {order.tipoEntrega === 'entrega' ? 'Entrega' : 'Retirada'}
                              </h4>
                            </div>
                            
                            {order.tipoEntrega === 'entrega' ? (
                              <div className="space-y-3 pl-11">
                                <div>
                                  <span className="block text-xs text-gray-500 font-medium">Endereço</span>
                                  <p className="font-medium">{order.enderecoCompleto || 'Não informado'}</p>
                                </div>
                                
                                {order.cliente?.codigoPostal && (
                                  <div>
                                    <span className="block text-xs text-gray-500 font-medium">Código Postal</span>
                                    <p className="font-mono">{order.cliente.codigoPostal}</p>
                                  </div>
                                )}
                                
                                {order.zonaEntrega && (
                                  <div>
                                    <span className="block text-xs text-gray-500 font-medium">Zona de Entrega</span>
                                    <p>{order.zonaEntrega}</p>
                                  </div>
                                )}
                                
                                <div className="pt-2 border-t border-gray-200 mt-2">
                                  <span className="block text-xs text-gray-500 font-medium">Taxa de Entrega</span>
                                  <p className="text-green-600 font-bold">{formatCurrency(order.taxaEntrega || 0)}</p>
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm pl-11 text-gray-600">O cliente irá retirar no estabelecimento</p>
                            )}
                          </div>

                          <div className="bg-indigo-50 p-5 rounded-lg border border-indigo-200">
                            <div className="flex items-center mb-3">
                              <div className="bg-indigo-100 p-2 rounded-full mr-3">
                                {paymentIcons[order.metodoPagamento] || <FaMoneyBillWave className="text-indigo-600 text-xl" />}
                              </div>
                              <h4 className="text-lg font-semibold text-indigo-800">Pagamento</h4>
                            </div>
                            
                            <div className="space-y-3 pl-11">
                              <div>
                                <span className="block text-xs text-gray-500 font-medium">Método</span>
                                <p className="font-medium">{order.metodoPagamento?.toUpperCase() || 'NÃO INFORMADO'}</p>
                              </div>
                              
                              {order.metodoPagamento === 'dinheiro' && (
                                <>
                                  <div>
                                    <span className="block text-xs text-gray-500 font-medium">Valor Pago</span>
                                    <p className="font-medium">
                                      {order.detalhesPagamento?.valorPago 
                                        ? formatCurrency(order.detalhesPagamento.valorPago) 
                                        : 'Não informado'}
                                    </p>
                                  </div>
                                  <div>
                                    <span className="block text-xs text-gray-500 font-medium">Troco</span>
                                    <p className="font-medium">
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

                        {/* Coluna 3: Itens e total */}
                        <div className="space-y-4">
                          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-center mb-3">
                              <div className="bg-purple-100 p-2 rounded-full mr-3">
                                <FaListUl className="text-purple-600 text-xl" />
                              </div>
                              <h4 className="text-lg font-semibold text-gray-800">Itens do Pedido</h4>
                            </div>
                            
                            <div className="space-y-3">
                              {(order.itens || []).map((item, index) => (
                                <div 
                                  key={index} 
                                  className={`p-3 rounded-lg ${
                                    item.pagoComSelos 
                                      ? 'bg-amber-50 border border-amber-200' 
                                      : 'bg-gray-50 border border-gray-200'
                                  }`}
                                >
                                  <div className="flex justify-between">
                                    <div>
                                      <p className="font-medium flex items-center">
                                        {item.quantidade}x {item.nome}
                                        {item.pagoComSelos && (
                                          <span className="ml-2 bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-xs flex items-center">
                                            <FaStamp className="mr-1" size={10} />
                                            Selos
                                          </span>
                                        )}
                                      </p>
                                      {item.tamanho && (
                                        <p className="text-xs text-gray-500 mt-1">
                                          Tamanho: {item.tamanho.charAt(0).toUpperCase() + item.tamanho.slice(1)}
                                        </p>
                                      )}
                                      {item.halfAndHalf && (
                                        <p className="text-xs text-gray-500 mt-1">
                                          Meia a meia: {item.halfPizza1Name} + {item.halfPizza2Name}
                                        </p>
                                      )}
                                      {item.borderType && (
                                        <p className="text-xs text-gray-500 mt-1">
                                          Borda: {item.borderType === 'grossa' ? 'Grossa' : 'Fina'}
                                        </p>
                                      )}
                                      {item.extras?.length > 0 && (
                                        <p className="text-xs text-gray-500 mt-1">
                                          Extras: {item.extras.map(e => e.nome).join(', ')}
                                        </p>
                                      )}
                                    </div>
                                    <span className={`font-medium min-w-[70px] text-right ${
                                      item.pagoComSelos ? 'text-green-600' : 'text-gray-800'
                                    }`}>
                                      {item.pagoComSelos ? 'Grátis' : formatCurrency(item.preco * item.quantidade)}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Subtotal:</span>
                                <span className="font-medium">{formatCurrency(order.subtotal || 0)}</span>
                              </div>
                              
                              {order.tipoEntrega === 'entrega' && (
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Taxa de entrega:</span>
                                  <span>{formatCurrency(order.taxaEntrega || 0)}</span>
                                </div>
                              )}
                              
                              {order.selosUsados > 0 && (
                                <div className="flex justify-between text-amber-700">
                                  <span className="text-sm">Desconto (selos):</span>
                                  <span className="text-sm">-{formatCurrency((order.subtotal + (order.taxaEntrega || 0) - (order.total || 0)))}</span>
                                </div>
                              )}

                              <div className="pt-3 mt-2 border-t border-gray-200">
                                <div className="flex justify-between items-center">
                                  <span className="font-bold text-gray-800">Total:</span>
                                  <span className="text-2xl font-bold text-green-600">
                                    {formatCurrency(order.total || 0)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Rodapé com ações */}
                      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        {order.status !== 'cancelado' && (
                          <>
                            <button
                              onClick={() => handleDeleteClick(order.id)}
                              className="px-4 py-2 border border-red-200 text-red-700 bg-white hover:bg-red-50 rounded-lg flex items-center transition-colors shadow-sm"
                            >
                              <FaTrash className="mr-2" />
                              Remover Pedido
                            </button>
                            
                            {order.status !== 'pronto' && (
                              <>
                                <button
                                  onClick={() => cancelOrder(order.id)}
                                  className="px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg flex items-center transition-colors shadow-sm"
                                >
                                  <FaTimes className="mr-2" />
                                  Cancelar Pedido
                                </button>
                                <button
                                  onClick={() => markAsReady(order.id)}
                                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 rounded-lg flex items-center transition-colors shadow-sm"
                                >
                                  <FaRegCheckCircle className="mr-2" />
                                  Marcar como Pronto
                                </button>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ModernCard>
        ) : (
          <ModernCard>
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <FaStamp className="text-amber-500 mr-2" />
                Gerenciamento de Selos de Fidelidade
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <ModernCard className="p-6 border-amber-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FaSearch className="text-blue-500 mr-2" />
                      Localizar Cliente
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pesquisar por e-mail ou telefone
                        </label>
                        <div className="flex rounded-md shadow-sm">
                          <div className="relative flex-grow focus-within:z-10">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FaUser className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              className="focus:ring-blue-500 focus:border-blue-500 block w-full rounded-l-md pl-10 sm:text-sm border-gray-300 h-10"
                              placeholder="exemplo@email.com ou 912345678"
                              value={customerSearchTerm}
                              onChange={(e) => setCustomerSearchTerm(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && searchCustomer()}
                            />
                          </div>
                          <button
                            onClick={searchCustomer}
                            disabled={isSearchingCustomer}
                            className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors h-10"
                          >
                            {isSearchingCustomer ? (
                              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <FaSearch className="h-4 w-4 text-white" />
                            )}
                            <span>Buscar</span>
                          </button>
                        </div>
                      </div>
                      
                      {foundCustomer && !showSuccess && (
                        <CustomerCard customer={foundCustomer} onReset={resetCustomerSearch} />
                      )}
                    </div>
                  </ModernCard>
                </div>
                
                <div className="space-y-6">
                  <ModernCard className="p-6 h-full border-amber-100">
                    {showSuccess ? (
                      <div className="text-center py-4 animate-fade-in">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-3">
                          <FaStamp className="w-8 h-8 text-amber-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">Saldo atualizado com sucesso!</h3>
                        <p className="text-gray-600">
                          Novo saldo: {formatStamps(foundCustomer.selos)}
                        </p>
                        <button
                          onClick={() => setShowSuccess(false)}
                          className="mt-4 px-4 py-2 bg-amber-100 text-amber-800 rounded-md hover:bg-amber-200 transition-colors text-sm"
                        >
                          Voltar
                        </button>
                      </div>
                    ) : foundCustomer ? (
                      <div className="space-y-6">
                        <div className="text-center">
                          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-3">
                            <FaStamp className="w-8 h-8 text-amber-600" />
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1">
                            Saldo Atual: {formatStamps(foundCustomer.selos)}
                          </h3>
                          <p className="text-sm text-gray-500 mb-4">
                            Gerencie os selos deste cliente
                          </p>
                        </div>
                        
                        <div className="space-y-4">
                          <button
                            onClick={() => setStampChange(prev => prev - 1)}
                            disabled={foundCustomer.selos + stampChange <= 0}
                            className={`w-full py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all ${foundCustomer.selos + stampChange <= 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'}`}
                          >
                            <FaMinus className="mr-2 inline" />
                            Remover 1 Selo
                          </button>
                          
                          <button
                            onClick={() => setStampChange(prev => prev + 1)}
                            className="w-full py-3 bg-green-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all"
                          >
                            <FaPlus className="mr-2 inline" />
                            Adicionar 1 Selo
                          </button>
                          
                          {stampChange !== 0 && (
                            <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                              <p className="text-sm text-gray-700 text-center">
                                Alteração pendente: 
                                <span className={`font-bold ml-1 ${stampChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {stampChange > 0 ? '+' : ''}{stampChange} selo{Math.abs(stampChange) !== 1 ? 's' : ''}
                                </span>
                              </p>
                              <p className="text-sm text-gray-700 text-center mt-1">
                                Novo saldo: {formatStamps(foundCustomer.selos + stampChange)}
                              </p>
                            </div>
                          )}
                          
                          <button
                            onClick={updateCustomerStamps}
                            disabled={stampChange === 0 || isUpdatingStamps}
                            className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99]"
                          >
                            {isUpdatingStamps ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processando...
                              </>
                            ) : (
                              <>
                                <FaStamp className="mr-2 inline" />
                                Atualizar Saldo
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                          <FaStamp className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          Programa de Fidelidade
                        </h3>
                        <p className="text-sm text-gray-500">
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