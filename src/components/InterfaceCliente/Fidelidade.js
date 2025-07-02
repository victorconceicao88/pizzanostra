/* eslint-disable */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useLanguage } from './LanguageContext';
import Lottie from 'lottie-react';
import loyaltyProgramAnimation from './loyaltyProgramAnimation';
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
  FaRegStar
} from 'react-icons/fa';
import { GiPizzaCutter, GiFullPizza,GiShoppingCart,GiBigDiamondRing,GiGarlic , GiPizzaSlice, GiHalfPizza,GiPizza } from 'react-icons/gi';
import { MdLocalPizza } from "react-icons/md"; // ícone moderno

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
        className="relative"
      >
        <div className={`w-8 h-8 rounded-full border-2 ${active ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-100'} flex items-center justify-center`}>
          <FaStar 
            className={`text-lg ${active ? 'text-green-500' : 'text-gray-400'}`} 
          />
        </div>
      </motion.div>
    );
  };

const LoyaltyCard = ({ stamps, user }) => {
  const totalStamps = 12;
  const progress = ((Number(stamps) || 0) / totalStamps) * 100;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <div className="relative">
        {/* Cartão de crédito estilo fidelidade */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden text-gray-800 p-6 relative h-64" 
             style={{
               border: '4px solid black',
               borderRadius: '12px'
             }}>
          {/* Torre de Pisa como marca d'água */}
          <div className="absolute right-4 top-4 opacity-10">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/6/66/The_Leaning_Tower_of_Pisa_SB.jpeg" 
              alt="Torre de Pisa" 
              className="w-24 h-24 object-cover rounded-full"
            />
          </div>
          
          {/* Cabeçalho do cartão */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center">
                <span className="font-bold text-xl">Pizza Nostra</span>
              </div>
              <div className="w-full h-px bg-black my-2"></div>
              <p className="text-xs text-gray-500 mt-1">
                Programa de Fidelidade
              </p>
            </div>
            
            <div className="flex flex-col items-end">
              <div className="bg-gray-100 rounded-full px-3 py-1 text-sm font-medium flex items-center">
                <span className="text-green-600 font-bold">{Number(stamps) || 0}</span> 
                <span className="mx-1 text-gray-500">/</span>
                <span className="text-gray-600">{totalStamps}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Selos
              </div>
            </div>
          </div>
          
          {/* Área dos carimbos - 2 linhas de 6 carimbos cada */}
          <div className="flex flex-col items-center justify-center space-y-4 mb-6">
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
          
          {/* Rodapé do cartão */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500 mb-1">
                Titular
              </p>
              <p className="text-sm font-medium">
                {user?.displayName || user?.email?.split('@')[0]}
              </p>
            </div>
          </div>
          
          {/* Faixa holográfica */}
          <div className="absolute top-1/3 left-0 right-0 h-6 bg-gradient-to-r from-transparent via-gray-100 to-transparent opacity-30"></div>
        </div>
      </div>
    </motion.div>
  );
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
      {/* Botão Voltar */}
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

      {/* Área do Usuário - APENAS quando logado */}
      {user && (
        <div className="flex items-center space-x-3">
          {/* Email do usuário com tooltip */}
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

          {/* Selos com animação */}
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

          {/* Botão Sair */}
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
  <div className="min-h-[70vh] flex items-center justify-center px-4 bg-white">
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl border border-black rounded-lg p-8" // Adicionada borda preta fina e padding
    >
      <div className="text-center">
        {/* Animação Lottie para programa de fidelidade */}
        <motion.div
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", damping: 10, stiffness: 100 }}
          className="mb-10 flex justify-center"
        >
          <div className="relative w-64 h-64">
            <Lottie 
              animationData={loyaltyProgramAnimation}
              loop={true}
              autoplay={true}
              className="absolute inset-0"
            />
            <div className="absolute -inset-4 bg-[#009344]/10 rounded-full blur-lg"></div>
          </div>
        </motion.div>

        {/* Título totalmente preto */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold mb-6 italic text-black"
          style={{ 
            fontFamily: "'Times New Roman', Times, serif",
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)'
          }}
        >
          Programa de Fidelidade Pizza Nostra
        </motion.h2>

        {/* Subtítulo */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto"
        >
          Acumule selos em cada compra e desfrute de benefícios especiais como pizzas grátis e descontos exclusivos
        </motion.p>

        {/* Botões */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6"
        >
          <motion.button
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setShowLoginForm(true);
              setAuthView('login');
            }}
            className="px-8 py-4 bg-gradient-to-br from-[#009344] to-[#007a38] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3 min-w-[200px]"
            style={{ fontFamily: "'Times New Roman', Times, serif" }}
          >
            <FaSignInAlt className="text-xl" />
            <span className="text-lg">Entrar na Conta</span>
          </motion.button>

          <motion.button
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setShowLoginForm(true);
              setAuthView('register');
            }}
            className="px-8 py-4 bg-gradient-to-br from-black to-gray-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3 min-w-[200px]"
            style={{ fontFamily: "'Times New Roman', Times, serif" }}
          >
            <FaUserPlus className="text-xl" />
            <span className="text-lg">Criar Conta</span>
          </motion.button>
        </motion.div>

        {/* Benefícios com ícones coloridos */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto"
        >
          {[
            { icon: <FaPizzaSlice className="text-red-500 text-2xl" />, text: "Pizzas Grátis" },
            { icon: <FaCoins className="text-amber-500 text-2xl" />, text: "Descontos Exclusivos" },
            { icon: <FaStar className="text-yellow-400 text-2xl" />, text: "Benefícios VIP" }
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="bg-white p-4 rounded-xl shadow-md border border-gray-200 flex flex-col items-center"
            >
              <div className="mb-2">{item.icon}</div>
              <span 
                className="font-medium text-black"
                style={{ fontFamily: "'Times New Roman', Times, serif" }}
              >
                {item.text}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  </div>
) : (
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
      {/* Card 1 - Ganhe Selos */}
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
      {/* Ícone de selo profissional */}
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
{/* Card de Benefícios - Versão Premium Simplificada */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="bg-white rounded-xl border border-gray-100 shadow-md overflow-hidden"
>
  <div className="p-6">
    {/* Cabeçalho */}
    <div className="flex items-center mb-6">
      <div className="bg-gradient-to-r from-red-500 to-red-600 p-3 rounded-lg mr-4">
        < FaGift className="text-white text-xl" />
      </div>
      <h3 className="text-xl font-bold text-gray-800">Seus Benefícios</h3>
    </div>

    {/* Tabela de Benefícios */}
    <div className="space-y-3">
      {/* Linha 1 */}
      <div className="flex items-center py-3 px-4 bg-red-50 rounded-lg">
        <div className="w-8 h-8 flex items-center justify-center bg-red-100 text-red-600 font-bold rounded-full mr-3">5</div>
        <span className="font-medium text-gray-700">Pão de Alho Grátis</span>
        < FaPizzaSlice className="text-red-400 ml-auto" />
      </div>

      {/* Linha 2 */}
      <div className="flex items-center py-3 px-4 bg-red-50 rounded-lg">
        <div className="w-8 h-8 flex items-center justify-center bg-red-200 text-red-700 font-bold rounded-full mr-3">10</div>
        <span className="font-medium text-gray-700">Pizza Individual</span>
        < FaPizzaSlice className="text-red-500 ml-auto" />
      </div>

      {/* Linha 3 */}
      <div className="flex items-center py-3 px-4 bg-red-50 rounded-lg">
        <div className="w-8 h-8 flex items-center justify-center bg-red-300 text-white font-bold rounded-full mr-3">11</div>
        <span className="font-medium text-gray-700">Pizza Média</span>
        < FaPizzaSlice className="text-red-600 ml-auto" />
      </div>

      {/* Linha 4 */}
      <div className="flex items-center py-3 px-4 bg-red-50 rounded-lg">
        <div className="w-8 h-8 flex items-center justify-center bg-red-400 text-white font-bold rounded-full mr-3">12</div>
        <span className="font-medium text-gray-700">Pizza Família</span>
        <GiFullPizza className="text-red-700 ml-auto" />
      </div>
    </div>

    {/* Rodapé */}
    <div className="mt-4 text-sm text-gray-500 text-center">
      Resgate diretamente no carrinho de compras
    </div>
  </div>
</motion.div>

      {/* Card 3 - Resgate */}
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
        )}
      </main>
    </div>
  );
};

export default Fidelidade;