/* eslint-disable */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useLanguage } from './LanguageContext';
import Lottie from 'lottie-react';
import { FaRegCircleCheck,FaCrown  } from 'react-icons/fa6';
import loyaltyProgramAnimation from './loyaltyProgramAnimation';
import pisaprojeto4 from '../../assets/pisaprojeto4.jpg';
import logo from './logo.jpg';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { 
  doc, 
  setDoc,
  getDoc,
  serverTimestamp,
  updateDoc,
  onSnapshot,
  increment,
  collection,
  query,
  where,
  orderBy,
  getDocs
} from 'firebase/firestore';
import { 
  FaCoins, 
  FaArrowLeft,
  FaUser,
  FaLock,
  FaSignInAlt,
  FaTimes,
  FaInfoCircle,
  FaStar,
  FaEnvelope,
  FaPhone,
  FaBirthdayCake,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaFacebook,
  FaUserPlus,
  FaPizzaSlice,
  FaGift,
  FaRegStar,
  FaMedal,
  FaClock,
  FaBolt,
  FaGem,
  FaStamp,
  FaReceipt,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaTruck,
  FaChevronDown
} from 'react-icons/fa';
import { IoRestaurantSharp } from 'react-icons/io5';
import { GiPizzaCutter, GiFullPizza,GiShoppingCart,GiBigDiamondRing,GiGarlic , GiPizzaSlice, GiHalfPizza,GiPizza,GiOlive} from 'react-icons/gi';
import { MdLocalPizza } from "react-icons/md";
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Fidelidade = () => {
  const [loading, setLoading] = useState(true);
  const [stamps, setStamps] = useState(0);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showStampDetails, setShowStampDetails] = useState(false);
  const [authView, setAuthView] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [activeTab, setActiveTab] = useState('fidelidade');
  const [expandedOrders, setExpandedOrders] = useState({});

  const toggleOrder = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  useEffect(() => {
    if (!user) {
      setStamps(0);
      setLoading(false);
      return;
    }

    const userRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userRef, async (doc) => {
      try {
        if (doc.exists()) {
          const userData = doc.data();
          const stampsData = typeof userData.selos === 'number' ? userData.selos : 0;
          setStamps(stampsData);
        } else {
          await setDoc(userRef, {
            selos: 0,
            criadoEm: serverTimestamp(),
            userId: user.uid,
            email: user.email
          });
          setStamps(0);
        }
      } catch (error) {
        console.error("Erro ao carregar selos:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (user && activeTab === 'historico') {
      fetchUserOrders();
    }
  }, [user, activeTab]);

  const fetchUserOrders = async () => {
    setLoadingOrders(true);
    try {
      const ordersRef = collection(db, 'pedidos');
      const q = query(
        ordersRef,
        where('cliente.userId', '==', user.uid),
        orderBy('criadoEm', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const ordersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().criadoEm?.toDate() || null,
        deliveredAt: doc.data().deliveredAt?.toDate() || null
      }));

      setOrders(ordersData);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
      toast.error('Erro ao carregar histórico de pedidos');
    } finally {
      setLoadingOrders(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (authView === 'register') {
      if (!formData.firstName.trim()) newErrors.firstName = 'Nome é obrigatório';
      if (!formData.lastName.trim()) newErrors.lastName = 'Sobrenome é obrigatório';
      if (!formData.email.trim()) newErrors.email = 'Email é obrigatório';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email inválido';
      
      if (!formData.phone.trim()) newErrors.phone = 'Telefone é obrigatório';
      if (!formData.birthDate) newErrors.birthDate = 'Data de nascimento é obrigatória';
      
      if (!formData.password) newErrors.password = 'Senha é obrigatória';
      else if (formData.password.length < 6) newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
      
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Senhas não coincidem';
    } else if (authView === 'login') {
      if (!loginEmail.trim()) newErrors.loginEmail = 'Email é obrigatório';
      if (!loginPassword) newErrors.loginPassword = 'Senha é obrigatória';
    } else if (authView === 'forgot') {
      if (!loginEmail.trim()) newErrors.loginEmail = 'Email é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      setShowLoginForm(false);
      toast.success('Login realizado com sucesso!');
    } catch (error) {
      let errorMessage = 'Erro ao fazer login';
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Usuário não encontrado';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Senha incorreta';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Muitas tentativas. Tente novamente mais tarde';
          break;
      }
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      
      await updateProfile(userCredential.user, {
        displayName: `${formData.firstName} ${formData.lastName}`
      });
      
      const userRef = doc(db, 'users', userCredential.user.uid);
      await setDoc(userRef, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        birthDate: formData.birthDate,
        selos: 0,
        criadoEm: serverTimestamp(),
        lastLogin: serverTimestamp()
      });
      
      setShowLoginForm(false);
      toast.success('Cadastro realizado com sucesso!');
    } catch (error) {
      let errorMessage = 'Erro ao cadastrar';
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Email já está em uso';
          break;
        case 'auth/weak-password':
          errorMessage = 'Senha muito fraca';
          break;
      }
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      await sendPasswordResetEmail(auth, loginEmail);
      toast.success('Email de recuperação enviado! Verifique sua caixa de entrada.');
      setAuthView('login');
    } catch (error) {
      toast.error('Erro ao enviar email de recuperação');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logout realizado com sucesso');
    } catch (error) {
      toast.error('Erro ao fazer logout');
    }
  };

  const Stamp = ({ active, index }) => {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ 
          scale: active ? 1 : 0.9,
          opacity: active ? 1 : 0.7
        }}
        transition={{ 
          duration: 0.3, 
          delay: index * 0.05,
          type: "spring",
          stiffness: 500
        }}
        className="relative z-20"
      >
        <div 
          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-md`}
          style={{
            backgroundColor: active ? '#009344' : '#cf2734',
            borderColor: active ? '#009344' : '#cf2734'
          }}
        >
          <FaStar 
            className="text-lg text-white" 
          />
        </div>
      </motion.div>
    );
  };

  const LoyaltyCard = ({ stamps, user }) => {
    const totalStamps = 12;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="relative">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden text-gray-800 p-6 relative h-64" 
               style={{
                 border: '4px solid black',
                 borderRadius: '12px'
               }}>
            
            <div className="absolute right-0 top-0 h-full w-1/2 overflow-hidden opacity-20">
              <img 
                src={pisaprojeto4} 
                alt="Torre de Pisa" 
                className="h-full w-full object-cover"
              />
            </div>
            
            <div className="relative z-10 h-full flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <div className="w-full">
                  <h2 className="font-bold text-xl">Pizza Nostra</h2>
                 <div className="w-[calc(100%+2rem)]  h-px bg-black my-1"></div>
                  <p className="text-xs text-gray-500">Programa de Fidelidade</p>
                </div>        
                <div className="flex flex-col items-end">
                  <div className="text-sm font-medium">
                    <span className="text-green-600 font-bold">{Number(stamps) || 0}</span>
                    <span className="text-gray-500">/</span>
                    <span className="text-gray-600">{totalStamps}</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                <div className="flex justify-center space-x-4">
                  {[...Array(6)].map((_, index) => (
                    <Stamp key={`star-${index}`} active={index < (Number(stamps) || 0)} index={index} />
                  ))}
                </div>
                <div className="flex justify-center space-x-4">
                  {[...Array(6)].map((_, index) => (
                    <Stamp key={`star-${index+6}`} active={index+6 < (Number(stamps) || 0)} index={index+6} />
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {user?.displayName || user?.email?.split('@')[0]}
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute top-1/3 left-0 right-0 h-6 bg-gradient-to-r from-transparent via-gray-100 to-transparent opacity-30"></div>
          </div>
        </div>
      </motion.div>
    );
  };

  const OrderStatusBadge = ({ status }) => {
    const statusConfig = {
      'pending': { color: 'bg-amber-100 text-amber-800', icon: <FaClock className="mr-1" />, text: 'Em Preparação' },
      'preparing': { color: 'bg-blue-100 text-blue-800', icon: <GiPizzaCutter className="mr-1" />, text: 'Preparando' },
      'on-the-way': { color: 'bg-purple-100 text-purple-800', icon: <FaTruck className="mr-1" />, text: 'A Caminho' },
      'delivered': { color: 'bg-green-100 text-green-800', icon: <FaCheckCircle className="mr-1" />, text: 'Entregue' },
      'cancelled': { color: 'bg-red-100 text-red-800', icon: <FaTimes className="mr-1" />, text: 'Cancelado' }
    };

    const config = statusConfig[status] || statusConfig['pending'];

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.icon}
        {config.text}
      </span>
    );
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };

  const formatDate = (date) => {
    if (!date) return '--/--/---- --:--';
    const d = date.toDate ? date.toDate() : date;
    return new Intl.DateTimeFormat('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(d);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AnimatePresence>
        {showStampDetails && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-amber-50 border-b border-amber-200 py-2 px-4"
          >
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div className="text-amber-800 text-sm">
                <p>Total de selos: <span className="font-bold">{stamps}</span></p>
              </div>
              <button 
                onClick={() => setShowStampDetails(false)}
                className="text-amber-600 hover:text-amber-800"
              >
                <FaTimes />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLoginForm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-2 sm:p-4"
            onClick={(e) => e.target === e.currentTarget && setShowLoginForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-lg sm:rounded-xl w-full max-w-md mx-2 sm:mx-0 overflow-hidden shadow-2xl"
              style={{ maxHeight: '95vh', overflowY: 'auto' }}
            >
              {/* Header */}
              <div className="bg-black p-4 sm:p-6 text-white sticky top-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold">
                      {authView === 'login' && 'Acesse sua conta'}
                      {authView === 'register' && 'Crie sua conta'}
                      {authView === 'forgot' && 'Recuperar senha'}
                    </h3>
                    <p className="text-gray-300 text-xs sm:text-sm mt-1">
                      {authView === 'login' && 'Entre para fazer seu pedido'}
                      {authView === 'register' && 'Cadastre-se em minutos'}
                      {authView === 'forgot' && 'Redefina sua senha'}
                    </p>
                  </div>
                  <button 
                    onClick={() => setShowLoginForm(false)}
                    className="p-1 rounded-full hover:bg-white/10 transition-colors ml-2"
                  >
                    <FaTimes className="text-base sm:text-lg" />
                  </button>
                </div>
                
                <div className="flex mt-4 sm:mt-6 border-b border-gray-700">
                  <button
                    onClick={() => setAuthView('login')}
                    className={`px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium ${authView === 'login' ? 'text-white border-b-2 border-green-500' : 'text-gray-400 hover:text-white'}`}
                  >
                    ENTRAR
                  </button>
                  <button
                    onClick={() => setAuthView('register')}
                    className={`px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium ${authView === 'register' ? 'text-white border-b-2 border-green-500' : 'text-gray-400 hover:text-white'}`}
                  >
                    CADASTRAR
                  </button>
                </div>
              </div>
              
              {/* Form Content */}
              <div className="p-4 sm:p-6">
                {authView === 'login' && (
                  <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-gray-800 mb-1 sm:mb-2 text-xs sm:text-sm font-semibold">
                        E-MAIL
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className={`w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border ${errors.loginEmail ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                          placeholder="Digite seu e-mail"
                        />
                        <div className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2">
                          <FaEnvelope className="text-gray-500 text-xs sm:text-sm" />
                        </div>
                      </div>
                      {errors.loginEmail && (
                        <p className="mt-1 text-xs text-red-500">{errors.loginEmail}</p>
                      )}
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1 sm:mb-2">
                        <label className="block text-gray-800 text-xs sm:text-sm font-semibold">
                          SENHA
                        </label>
                        <button
                          type="button"
                          onClick={() => setAuthView('forgot')}
                          className="text-xs font-medium text-green-600 hover:text-green-500"
                        >
                          Esqueceu a senha?
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className={`w-full pl-8 sm:pl-10 pr-8 sm:pr-10 py-2 sm:py-3 text-sm sm:text-base border ${errors.loginPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                          placeholder="Digite sua senha"
                        />
                        <div className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2">
                          <FaLock className="text-gray-500 text-xs sm:text-sm" />
                        </div>
                        <button
                          type="button"
                          className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <FaEyeSlash className="text-xs sm:text-sm" /> : <FaEye className="text-xs sm:text-sm" />}
                        </button>
                      </div>
                      {errors.loginPassword && (
                        <p className="mt-1 text-xs text-red-500">{errors.loginPassword}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-xs sm:text-sm text-gray-700">
                        Manter conectado
                      </label>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2 sm:py-3 bg-green-600 rounded-lg text-white font-bold hover:bg-green-700 transition-colors disabled:opacity-70 flex items-center justify-center shadow-md text-sm sm:text-base"
                    >
                      {isSubmitting ? (
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <FaSignInAlt className="mr-1 sm:mr-2 text-xs sm:text-sm" />
                      )}
                      ENTRAR
                    </button>
                    
                    <div className="text-center text-xs sm:text-sm text-gray-600 mt-3 sm:mt-4">
                      Não tem uma conta?{' '}
                      <button
                        type="button"
                        onClick={() => setAuthView('register')}
                        className="font-semibold text-green-600 hover:text-green-500"
                      >
                        Cadastre-se
                      </button>
                    </div>
                  </form>
                )}
                
                {authView === 'register' && (
                  <form onSubmit={handleRegister} className="space-y-3 sm:space-y-4">
                    <div className="grid grid-cols-2 gap-2 sm:gap-4">
                      <div>
                        <label className="block text-gray-800 mb-1 sm:mb-2 text-xs sm:text-sm font-semibold">
                          NOME
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                            className={`w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                            placeholder="Seu nome"
                          />
                          <div className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2">
                            <FaUser className="text-gray-500 text-xs sm:text-sm" />
                          </div>
                        </div>
                        {errors.firstName && (
                          <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-gray-800 mb-1 sm:mb-2 text-xs sm:text-sm font-semibold">
                          SOBRENOME
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                            className={`w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                            placeholder="Seu sobrenome"
                          />
                          <div className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2">
                            <FaUser className="text-gray-500 text-xs sm:text-sm" />
                          </div>
                        </div>
                        {errors.lastName && (
                          <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-800 mb-1 sm:mb-2 text-xs sm:text-sm font-semibold">
                        E-MAIL
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className={`w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                          placeholder="seu@email.com"
                        />
                        <div className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2">
                          <FaEnvelope className="text-gray-500 text-xs sm:text-sm" />
                        </div>
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-gray-800 mb-1 sm:mb-2 text-xs sm:text-sm font-semibold">
                        TELEFONE
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className={`w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                          placeholder="(00) 00000-0000"
                        />
                        <div className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2">
                          <FaPhone className="text-gray-500 text-xs sm:text-sm" />
                        </div>
                      </div>
                      {errors.phone && (
                        <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-gray-800 mb-1 sm:mb-2 text-xs sm:text-sm font-semibold">
                        DATA DE NASCIMENTO
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={formData.birthDate}
                          onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                          className={`w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border ${errors.birthDate ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                        />
                        <div className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2">
                          <FaBirthdayCake className="text-gray-500 text-xs sm:text-sm" />
                        </div>
                      </div>
                      {errors.birthDate && (
                        <p className="mt-1 text-xs text-red-500">{errors.birthDate}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-gray-800 mb-1 sm:mb-2 text-xs sm:text-sm font-semibold">
                        SENHA
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                          className={`w-full pl-8 sm:pl-10 pr-8 sm:pr-10 py-2 sm:py-3 text-sm sm:text-base border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                          placeholder="Crie uma senha"
                        />
                        <div className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2">
                          <FaLock className="text-gray-500 text-xs sm:text-sm" />
                        </div>
                        <button
                          type="button"
                          className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <FaEyeSlash className="text-xs sm:text-sm" /> : <FaEye className="text-xs sm:text-sm" />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-gray-800 mb-1 sm:mb-2 text-xs sm:text-sm font-semibold">
                        CONFIRMAR SENHA
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                          className={`w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                          placeholder="Confirme sua senha"
                        />
                        <div className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2">
                          <FaLock className="text-gray-500 text-xs sm:text-sm" />
                        </div>
                      </div>
                      {errors.confirmPassword && (
                        <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
                      )}
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-4">
                        <input
                          id="terms"
                          name="terms"
                          type="checkbox"
                          className="focus:ring-green-500 h-3 w-3 sm:h-4 sm:w-4 text-green-600 border-gray-300 rounded"
                          required
                        />
                      </div>
                      <div className="ml-2 text-xs sm:text-sm">
                        <label htmlFor="terms" className="font-medium text-gray-700">
                          Eu concordo com os{' '}
                          <a href="#" className="text-green-600 hover:text-green-500">
                            Termos
                          </a>{' '}
                          e{' '}
                          <a href="#" className="text-green-600 hover:text-green-500">
                            Política
                          </a>
                        </label>
                      </div>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2 sm:py-3 bg-green-600 rounded-lg text-white font-bold hover:bg-green-700 transition-colors disabled:opacity-70 flex items-center justify-center shadow-md text-sm sm:text-base"
                    >
                      {isSubmitting ? (
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <FaUserPlus className="mr-1 sm:mr-2 text-xs sm:text-sm" />
                      )}
                      CADASTRAR
                    </button>
                    
                    <div className="text-center text-xs sm:text-sm text-gray-600 mt-3 sm:mt-4">
                      Já tem uma conta?{' '}
                      <button
                        type="button"
                        onClick={() => setAuthView('login')}
                        className="font-semibold text-green-600 hover:text-green-500"
                      >
                        Faça login
                      </button>
                    </div>
                  </form>
                )}
                
                {authView === 'forgot' && (
                  <form onSubmit={handleForgotPassword} className="space-y-3 sm:space-y-4">
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 sm:p-4 mb-3 sm:mb-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <FaInfoCircle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
                        </div>
                        <div className="ml-2 sm:ml-3">
                          <p className="text-xs sm:text-sm text-yellow-700">
                            Insira seu e-mail e enviaremos um link para redefinir sua senha.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-800 mb-1 sm:mb-2 text-xs sm:text-sm font-semibold">
                        E-MAIL
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className={`w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border ${errors.loginEmail ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                          placeholder="Digite seu e-mail"
                        />
                        <div className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2">
                          <FaEnvelope className="text-gray-500 text-xs sm:text-sm" />
                        </div>
                      </div>
                      {errors.loginEmail && (
                        <p className="mt-1 text-xs text-red-500">{errors.loginEmail}</p>
                      )}
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2 sm:py-3 bg-green-600 rounded-lg text-white font-bold hover:bg-green-700 transition-colors disabled:opacity-70 flex items-center justify-center shadow-md text-sm sm:text-base"
                    >
                      {isSubmitting ? (
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <FaEnvelope className="mr-1 sm:mr-2 text-xs sm:text-sm" />
                      )}
                      ENVIAR LINK
                    </button>
                    
                    <div className="text-center text-xs sm:text-sm text-gray-600 mt-3 sm:mt-4">
                      Lembrou sua senha?{' '}
                      <button
                        type="button"
                        onClick={() => setAuthView('login')}
                        className="font-semibold text-green-600 hover:text-green-500"
                      >
                        Faça login
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.button
              whileHover={{ x: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all 
                        bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200
                        text-gray-700 hover:text-gray-900 shadow-sm border border-gray-200"
            >
              <FaArrowLeft className="text-gray-600" />
              <span className="font-medium">Voltar ao Menu</span>
            </motion.button>

            {user && (
              <div className="flex items-center space-x-3">
                <div className="hidden md:block relative group">
                  <div className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-full">
                    {user.email?.split('@')[0]}
                  </div>
                  <div className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 
                                bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 
                                bg-gray-800 text-white text-xs rounded whitespace-nowrap transition-all">
                    {user.email}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowStampDetails(!showStampDetails)}
                  className="flex items-center px-3 py-1.5 rounded-full shadow-sm
                            bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700
                            text-white font-medium transition-all"
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                  >
                    <FaCoins className="mr-2" />
                  </motion.div>
                  <span>{stamps} Selos</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg font-medium transition-all
                            bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900
                            border border-gray-200 shadow-sm"
                >
                  Sair
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {!user ? (
          <div className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.6,
                ease: "easeOut"
              }}
              className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
            >
              <div className="p-8 sm:p-10">
                <div className="flex flex-col items-center mb-12">
                  <motion.div className="flex flex-col items-center mb-12">
                    <div className="w-24 h-24 rounded-[1.75rem] border-[3px] border-black relative overflow-hidden">
                      <img 
                        src={logo} 
                        alt="Logo do Restaurante"
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{ borderRadius: 'calc(1.75rem - 3px)' }}
                      />
                    </div>

                    <motion.h1 
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, ease: "easeOut" }}
                      className="text-4xl font-bold text-gray-900 font-serif tracking-tight mt-6"
                    >
                      PIZZA NOSTRA
                    </motion.h1>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.75 }}
                      transition={{ delay: 0.45, ease: "easeOut" }}
                      className="text-xs text-gray-500 mt-2 tracking-[0.2em] uppercase font-medium"
                    >
                      Desde 1996
                    </motion.p>
                  </motion.div>
                </div>

                <div className="space-y-5">
                  <motion.button
                    whileHover={{ 
                      y: -2, 
                      boxShadow: "0 10px 25px -5px rgba(0, 147, 68, 0.25)",
                    }}
                    whileTap={{ 
                      scale: 0.985,
                      boxShadow: "0 5px 15px -5px rgba(0, 147, 68, 0.2)"
                    }}
                    onClick={() => {
                      setShowLoginForm(true);
                      setAuthView('login');
                    }}
                    className="w-full py-4 px-6 bg-gradient-to-br from-[#009344] to-[#006b32] text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-3 border-2 border-black/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#009344]/50"
                  >
                    <FaSignInAlt className="text-xl flex-shrink-0" />
                    <span className="tracking-wide text-lg">ACESSAR CONTA</span>
                  </motion.button>

                  <div className="relative flex items-center justify-center my-7">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative bg-white px-4 text-sm text-gray-400 rounded-full border border-gray-200 font-medium tracking-wider">
                      OU
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ 
                      y: -2,
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.08)",
                    }}
                    whileTap={{ 
                      scale: 0.985,
                      boxShadow: "0 5px 15px -5px rgba(0, 0, 0, 0.05)"
                    }}
                    onClick={() => {
                      setShowLoginForm(true);
                      setAuthView('register');
                    }}
                    className="w-full py-4 px-6 bg-white text-gray-900 font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-3 border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300/50"
                  >
                    <FaUserPlus className="text-xl flex-shrink-0" />
                    <span className="tracking-wide text-lg">CRIAR CONTA</span>
                  </motion.button>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ 
                    delay: 0.7,
                    ease: "easeOut"
                  }}
                  className="mt-14 text-center border-t border-gray-100 pt-6"
                >
                  <p className="text-xs text-gray-400 tracking-wider font-medium">
                    © {new Date().getFullYear()} PIZZA NOSTRA GROUP. ALL RIGHTS RESERVED.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        ) : (
          <>
            {/* Abas de Navegação */}
            <div className="flex justify-center mb-12">
              <div className="inline-flex rounded-xl bg-gray-100 p-1 shadow-inner">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab('fidelidade')}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${activeTab === 'fidelidade' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-600 hover:text-gray-800'}`}
                >
                  <div className="flex items-center">
                    <FaCoins className="mr-2" />
                    Programa de Fidelidade
                  </div>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab('historico')}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${activeTab === 'historico' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-600 hover:text-gray-800'}`}
                >
                  <div className="flex items-center">
                    <FaReceipt className="mr-2" />
                    Histórico de Pedidos
                  </div>
                </motion.button>
              </div>
            </div>

            {activeTab === 'fidelidade' ? (
              <>
                <div className="flex flex-col items-center mb-12">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
                    Seu Cartão de Fidelidade
                  </h1>
                  <LoyaltyCard stamps={stamps} user={user} />
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                  <div className="p-10">
                    <motion.h2 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-amber-500"
                    >
                      Como Funciona Nosso Programa
                    </motion.h2>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        whileHover={{ y: -10 }}
                        className="relative p-8 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden"
                      >
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-amber-100 rounded-full opacity-20 group-hover:opacity-30 transition-all duration-500"></div>
                        <div className="relative z-10">
                          <div className="flex items-center mb-6">
                            <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-4 rounded-full shadow-md mr-5">
                              <FaCoins className="text-white text-2xl" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">
                              Ganhe Selos
                            </h3>
                          </div>
                          <p className="text-gray-600 mb-6">
                            A cada <span className="font-semibold text-amber-600">€15 gastos</span> em pedidos, você ganha automaticamente:
                          </p>
                          <div className="flex flex-col items-center justify-center bg-amber-50 rounded-xl p-5 border-2 border-amber-200 shadow-inner">
                            <div className="relative">
                              <svg 
                                className="w-16 h-16 text-amber-500 mb-2" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                              >
                                <circle cx="12" cy="12" r="10" className="fill-amber-100 stroke-amber-400" />
                                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
                                      className="fill-amber-400 stroke-amber-600" />
                                <text 
                                  x="12" 
                                  y="14" 
                                  textAnchor="middle" 
                                  className="text-lg font-bold fill-white stroke-amber-700 stroke-[0.5px]"
                                  dominantBaseline="middle"
                                >1</text>
                              </svg>
                            </div>
                            <span className="text-amber-600 font-bold mt-2">1 Selo</span>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white rounded-xl border border-gray-100 shadow-md overflow-hidden"
                      >
                        <div className="p-6">
                          <div className="flex items-center mb-6">
                            <div className="bg-gradient-to-r from-red-500 to-red-600 p-3 rounded-lg mr-4">
                              <FaGift className="text-white text-xl" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Seus Benefícios</h3>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center py-3 px-4 bg-red-50 rounded-lg">
                              <div className="w-8 h-8 flex items-center justify-center bg-red-100 text-red-600 font-bold rounded-full mr-3">5</div>
                              <span className="font-medium text-gray-700">Pão de Alho Grátis</span>
                              <FaPizzaSlice className="text-red-400 ml-auto" />
                            </div>

                            <div className="flex items-center py-3 px-4 bg-red-50 rounded-lg">
                              <div className="w-8 h-8 flex items-center justify-center bg-red-200 text-red-700 font-bold rounded-full mr-3">10</div>
                              <span className="font-medium text-gray-700">Pizza Individual</span>
                              <FaPizzaSlice className="text-red-500 ml-auto" />
                            </div>

                            <div className="flex items-center py-3 px-4 bg-red-50 rounded-lg">
                              <div className="w-8 h-8 flex items-center justify-center bg-red-300 text-white font-bold rounded-full mr-3">11</div>
                              <span className="font-medium text-gray-700">Pizza Média</span>
                              <FaPizzaSlice className="text-red-600 ml-auto" />
                            </div>

                            <div className="flex items-center py-3 px-4 bg-red-50 rounded-lg">
                              <div className="w-8 h-8 flex items-center justify-center bg-red-400 text-white font-bold rounded-full mr-3">12</div>
                              <span className="font-medium text-gray-700">Pizza Família</span>
                              <GiFullPizza className="text-red-700 ml-auto" />
                            </div>
                          </div>

                          <div className="mt-4 text-sm text-gray-500 text-center">
                            Resgate diretamente no carrinho de compras
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        whileHover={{ y: -10 }}
                        className="relative p-8 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden"
                      >
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-green-100 rounded-full opacity-20 group-hover:opacity-30 transition-all duration-500"></div>
                        <div className="relative z-10">
                          <div className="flex items-center mb-6">
                            <div className="bg-gradient-to-br from-green-400 to-green-600 p-4 rounded-full shadow-md mr-5">
                              <FaStar className="text-white text-2xl" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">
                              Resgate Seus Prêmios
                            </h3>
                          </div>
                          <p className="text-gray-600 mb-6">
                            Ao fazer um pedido, você pode resgatar seus selos diretamente no carrinho de compras.
                          </p>
                          <div className="bg-green-50 rounded-lg p-4 border border-green-100 flex items-center">
                            <GiShoppingCart className="text-green-500 text-3xl mr-3" />
                            <span className="text-green-700 font-medium">Basta selecionar "Pagar Com selos" antes de finalizar!</span>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="p-8 sm:p-10">
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-amber-500"
                  >
                    Seu Histórico de Pedidos
                  </motion.h2>

                  {loadingOrders ? (
                    <div className="flex justify-center items-center py-20">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                        <FaReceipt className="text-gray-400 text-3xl" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum pedido encontrado</h3>
                      <p className="text-gray-500 max-w-md mx-auto">
                        Você ainda não fez nenhum pedido. Quando fizer, eles aparecerão aqui.
                      </p>
                      <button
                        onClick={() => navigate('/')}
                        className="mt-6 px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Fazer Pedido Agora
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                        >
                          {/* Cabeçalho do Pedido */}
                          <div 
                            className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex justify-between items-center cursor-pointer"
                            onClick={() => toggleOrder(order.id)}
                          >
                            <div className="flex items-center">
                              <div className="bg-red-100 p-2 rounded-lg mr-3 sm:mr-4">
                                <FaReceipt className="text-red-600 text-sm sm:text-base" />
                              </div>
                              <div>
                                <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                                  Pedido #{order.numeroPedido || order.id.slice(0, 8).toUpperCase()}
                                </h3>
                                <div className="flex items-center text-xs sm:text-sm text-gray-500 mt-1">
                                  <FaCalendarAlt className="mr-1" />
                                  <span>
                                    {order.atualizadoEm ? 
                                      formatDate(order.atualizadoEm) : 
                                      order.criadoEm ? 
                                        formatDate(order.criadoEm) : 
                                        '--/--/---- --:--'
                                    }
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3 sm:space-x-4">
                              {order.status && order.status !== 'delivered' && (
                                <OrderStatusBadge status={order.status} />
                              )}
                              <div className="text-base sm:text-lg font-bold text-gray-900">
                                {formatCurrency(order.total || 0)}
                              </div>
                              <motion.div
                                animate={{ rotate: expandedOrders[order.id] ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <FaChevronDown className="text-gray-500" />
                              </motion.div>
                            </div>
                          </div>

                          {/* Corpo do Pedido - Apenas mostra se expandido */}
                          {expandedOrders[order.id] && (
                            <div className="p-4 sm:p-6">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6">
                                {/* Seção de Endereço */}
                                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                                  <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3 flex items-center">
                                    <FaMapMarkerAlt className="mr-2 text-red-500" />
                                    <span>Dados de Entrega</span>
                                  </h4>
                                  <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                                    <div className="flex">
                                      <div className="min-w-[60px] sm:min-w-[80px] text-gray-500">Endereço:</div>
                                      <div className="text-gray-800 break-words">
                                        {order.enderecoCompleto || 'Não informado'}
                                      </div>
                                    </div>
                                    <div className="flex">
                                      <div className="min-w-[60px] sm:min-w-[80px] text-gray-500">Zona:</div>
                                      <div className="text-gray-800">{order.zonaEntrega || '--'}</div>
                                    </div>
                                    {order.cliente?.nome && (
                                      <div className="flex">
                                        <div className="min-w-[60px] sm:min-w-[80px] text-gray-500">Cliente:</div>
                                        <div className="text-gray-800">{order.cliente.nome}</div>
                                      </div>
                                    )}
                                    {order.cliente?.telefone && (
                                      <div className="flex">
                                        <div className="min-w-[60px] sm:min-w-[80px] text-gray-500">Contato:</div>
                                        <div className="text-gray-800">{order.cliente.telefone}</div>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Seção de Pagamento */}
                                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                                  <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3 flex items-center">
                                    <FaMoneyBillWave className="mr-2 text-green-500" />
                                    <span>Pagamento</span>
                                  </h4>
                                  <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Método:</span>
                                      <span className="font-medium text-gray-800 capitalize">
                                        {order.metodoPagamento ? order.metodoPagamento.replace(/_/g, ' ') : '--'}
                                      </span>
                                    </div>
                                    {order.troco && (
                                      <div className="flex justify-between">
                                        <span className="text-gray-500">Troco para:</span>
                                        <span className="font-medium text-gray-800">{formatCurrency(order.troco)}</span>
                                      </div>
                                    )}
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Taxa entrega:</span>
                                      <span className="font-medium text-gray-800">{formatCurrency(order.taxaEntrega || 0)}</span>
                                    </div>
                                    <div className="pt-2 mt-2 border-t border-gray-200">
                                      <div className="flex justify-between">
                                        <span className="text-gray-700 font-semibold">Total:</span>
                                        <span className="text-gray-900 font-bold">{formatCurrency(order.total || 0)}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Seção de Selos */}
                                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                                  <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3 flex items-center">
                                    <FaCoins className="mr-2 text-amber-500" />
                                    <span>Fidelidade</span>
                                  </h4>
                                  <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                                    <div className="flex justify-between items-center">
                                      <span className="text-gray-500">Selos usados:</span>
                                      <div className="flex items-center">
                                        {order.selosUsados > 0 ? (
                                          <>
                                            <span className="font-medium text-amber-600 mr-1 sm:mr-2">{order.selosUsados}</span>
                                            <FaStamp className="text-amber-500 text-sm" />
                                          </>
                                        ) : (
                                          <span className="text-gray-400">Nenhum</span>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span className="text-gray-500">Selos ganhos:</span>
                                      <div className="flex items-center">
                                        {order.selosGanhos > 0 ? (
                                          <>
                                            <span className="font-medium text-green-600 mr-1 sm:mr-2">{order.selosGanhos}</span>
                                            <FaStar className="text-green-500 text-sm" />
                                          </>
                                        ) : (
                                          <span className="text-gray-400">Nenhum</span>
                                        )}
                                      </div>
                                    </div>
                                    <div className="pt-2 mt-2 border-t border-gray-200">
                                      <div className="flex justify-between">
                                        <span className="text-gray-500">Saldo:</span>
                                        <span className="font-medium text-gray-800">
                                          {order.selosGanhos - order.selosUsados} selos
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Seção de Itens */}
                              <div className="mb-4 sm:mb-6">
                                <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3 flex items-center">
                                  <IoRestaurantSharp className="mr-2 text-red-500" />
                                  <span>Itens do Pedido</span>
                                </h4>
                                <div className="space-y-2 sm:space-y-3">
                                  {order.itens?.map((item, index) => (
                                    <div key={index} className="flex justify-between items-start py-2 sm:py-3 px-3 sm:px-4 bg-white rounded-lg border border-gray-100 hover:bg-gray-50">
                                      <div className="flex items-start flex-1 min-w-0">
                                        <div className="bg-red-50 p-1 sm:p-2 rounded-lg mr-2 sm:mr-3 flex-shrink-0">
                                          {item.categoria === 'pizza' ? (
                                            <GiPizzaSlice className="text-red-500 text-sm sm:text-lg" />
                                          ) : item.categoria === 'bebida' ? (
                                            <FaBolt className="text-blue-500 text-sm sm:text-lg" />
                                          ) : (
                                            <IoRestaurantSharp className="text-amber-500 text-sm sm:text-lg" />
                                          )}
                                        </div>
                                        <div className="min-w-0">
                                          <h5 className="font-medium text-gray-900 text-sm sm:text-base truncate">{item.nome || 'Item sem nome'}</h5>
                                          <div className="text-xs text-gray-500 space-y-0.5 sm:space-y-1 mt-1">
                                            {item.tamanho && <div>Tamanho: {item.tamanho}</div>}
                                            {item.borderType && <div>Borda: {item.borderType}</div>}
                                            {item.halfPizza1Name && item.halfPizza2Name && (
                                              <div>Meia pizza: {item.halfPizza1Name} + {item.halfPizza2Name}</div>
                                            )}
                                            {item.pagoComSelos && (
                                              <div className="text-amber-600 font-medium">Pago com selos</div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="ml-2 sm:ml-4 text-right flex-shrink-0">
                                        <p className="font-medium text-gray-900 text-sm sm:text-base whitespace-nowrap">
                                          {formatCurrency(item.preco || 0)}
                                        </p>
                                        <p className="text-xs text-gray-500">x{item.quantidade || 1}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Observações */}
                              {order.observacoes && (
                                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-100 mb-4 sm:mb-6">
                                  <h4 className="text-xs sm:text-sm font-medium text-blue-800 mb-1 sm:mb-2 flex items-center">
                                    <FaInfoCircle className="mr-2 text-blue-500" />
                                    <span>Observações</span>
                                  </h4>
                                  <p className="text-blue-700 text-xs sm:text-sm whitespace-pre-line">{order.observacoes}</p>
                                </div>
                              )}

                              {/* Mensagem de Ajuda */}
                              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200 text-center">
                                <p className="text-xs sm:text-sm text-gray-600 mb-1">
                                  Tem alguma dúvida sobre o seu pedido?
                                </p>
                                <a 
                                  href="tel:+351282046810" 
                                  className="text-red-600 hover:text-red-700 font-medium text-sm sm:text-base inline-flex items-center"
                                >
                                  <FaPhone className="mr-1 sm:mr-2" />
                                  Ligue para o restaurante: +351 282 046 810
                                </a>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Fidelidade;