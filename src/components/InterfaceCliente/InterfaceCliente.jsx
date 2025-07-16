import React, { useState, useEffect, useRef, useMemo, Fragment } from 'react';
import { FaPizzaSlice, FaClipboardList,FaCopy,FaAddressBook,FaLeaf, FaIceCream, FaBreadSlice, FaWineGlassAlt, FaShoppingCart, FaMapMarkerAlt, FaMoneyBillWave, FaCreditCard, FaQrcode, FaRegStar, FaStar, FaChevronDown, FaChevronUp, FaRegClock, FaMotorcycle, FaGlobe, FaPhone, FaCheck, FaCoins, FaTicketAlt, FaTimes, FaCheckCircle, FaExclamationTriangle, FaGift, FaInfoCircle, FaUser, FaStore, FaAngleDown, FaAngleRight, FaShieldAlt, FaPlus, FaUserPlus } from 'react-icons/fa';
import { Pizza, Leaf, IceCream, Hamburger, Wine, X, Check, Plus, Minus, MapPin, CreditCard, CurrencyEur, DeviceMobile, Money} from '@phosphor-icons/react';
import { motion, AnimatePresence, useAnimation, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, setDoc, getDoc, getDocs, updateDoc, arrayUnion, serverTimestamp, Timestamp, arrayRemove, increment, onSnapshot, query, orderBy, limit, addDoc, writeBatch } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { LanguageProvider, useLanguage } from './LanguageContext';
import { menuData, deliveryAreas } from './menuData';
import logo from './logo.jpg';
import { t } from './translations';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import WelcomeModal from './WelcomeModal';
import { Combobox, Transition } from '@headlessui/react';

// Imagens de categoria
const categoryImages = {
  tradicionais: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  vegetarianas: 'https://images.unsplash.com/photo-1571066811602-716837d681de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  entradas: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  petiscos: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  doces: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  bordas: 'https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  massas: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  sobremesas: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  bebidas: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  vinhos: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
};

// Adicionais para pizzas
const pizzaExtras = [
  { id: 'alcaparras', name: { pt: 'Alcaparras', en: 'Capers', es: 'Alcaparras' }, price: 2.50 },
  { id: 'ananas', name: { pt: 'Ananás', en: 'Pineapple', es: 'Piña' }, price: 1.50 },
  { id: 'atum', name: { pt: 'Atum', en: 'Tuna', es: 'Atún' }, price: 2.50 },
  { id: 'azeitona', name: { pt: 'Azeitona', en: 'Olives', es: 'Aceitunas' }, price: 1.00 },
  { id: 'bacon', name: { pt: 'Bacon', en: 'Bacon', es: 'Tocino' }, price: 2.50 },
  { id: 'camarao', name: { pt: 'Camarão', en: 'Shrimp', es: 'Camarón' }, price: 3.50 },
  { id: 'catupiry', name: { pt: 'Catupiry', en: 'Catupiry', es: 'Catupiry' }, price: 2.00 },
  { id: 'cebola', name: { pt: 'Cebola', en: 'Onion', es: 'Cebolla' }, price: 1.50 },
  { id: 'chourico', name: { pt: 'Chouriço Alentejano', en: 'Portuguese Sausage', es: 'Chorizo Alentejano' }, price: 2.50 },
  { id: 'cogumelos', name: { pt: 'Cogumelos', en: 'Mushrooms', es: 'Champiñones' }, price: 2.50 },
  { id: 'delicias', name: { pt: 'Delícias do Mar', en: 'Seafood Mix', es: 'Delicias del Mar' }, price: 2.50 },
  { id: 'fiambre', name: { pt: 'Fiambre', en: 'Ham', es: 'Jamón' }, price: 2.50 },
  { id: 'frango', name: { pt: 'Frango', en: 'Chicken', es: 'Pollo' }, price: 2.50 },
  { id: 'gorgonzola', name: { pt: 'Gorgonzola', en: 'Gorgonzola', es: 'Gorgonzola' }, price: 2.50 },
  { id: 'linguica', name: { pt: 'Linguiça Calabresa', en: 'Calabrese Sausage', es: 'Longaniza Calabresa' }, price: 2.50 },
  { id: 'milho', name: { pt: 'Milho', en: 'Corn', es: 'Maíz' }, price: 1.50 },
  { id: 'mozzarella', name: { pt: 'Mozzarella', en: 'Mozzarella', es: 'Mozzarella' }, price: 2.50 },
  { id: 'ovo', name: { pt: 'Ovo', en: 'Egg', es: 'Huevo' }, price: 1.00 },
  { id: 'pepperoni', name: { pt: 'Pepperoni', en: 'Pepperoni', es: 'Pepperoni' }, price: 2.50 },
  { id: 'pimento', name: { pt: 'Pimento Verde', en: 'Green Pepper', es: 'Pimiento Verde' }, price: 1.50 },
  { id: 'rucula', name: { pt: 'Rúcula', en: 'Arugula', es: 'Rúcula' }, price: 1.50 },
  { id: 'tomate', name: { pt: 'Tomate', en: 'Tomato', es: 'Tomate' }, price: 1.50 }
];

// Definir as recompensas de selos
const STAMP_REWARDS = {
  pizzas: {
    individual: { selos: 10, label: { pt: "Pizza Individual", en: "Individual Pizza", es: "Pizza Individual" } },
    media: { selos: 11, label: { pt: "Pizza Média", en: "Medium Pizza", es: "Pizza Mediana" } },
    familia: { selos: 12, label: { pt: "Pizza Família", en: "Family Pizza", es: "Pizza Familiar" } }
  },
  entradas: {
    pao_alho: { selos: 5, label: { pt: "Pão de Alho", en: "Garlic Bread", es: "Pan de Ajo" } }
  }
};

const OrderConfirmationModal = ({ 
  orderNumber, 
  onClose, 
  onNewOrder,
  language,
  user,
  navigate
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isPhoneSaved, setIsPhoneSaved] = useState(false);
  const phoneNumber = "+351282046810";

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(orderNumber);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const savePhoneNumber = () => {
    const vCard = `BEGIN:VCARD\nVERSION:3.0\nFN:Pizzaria Delícia\nTEL;TYPE=WORK,VOICE:${phoneNumber}\nEND:VCARD`;
    const blob = new Blob([vCard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'contato-pizzaria.vcf';
    link.click();
    setIsPhoneSaved(true);
    setTimeout(() => setIsPhoneSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl w-full max-w-md overflow-hidden shadow-xl border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-center">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <FaCheckCircle className="text-white text-4xl" />
          </div>
          <h3 className="text-2xl font-bold text-white">
            {t(language, 'orderSentSuccess')}!
          </h3>
          <p className="text-white/90 mt-2">
            Seu pedido está sendo preparado com carinho
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Order Number Card */}
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <FaClipboardList className="text-green-600 mr-3" size={20} />
                <h4 className="font-semibold text-gray-800">
                  {t(language, 'orderNumber')}
                </h4>
              </div>
              <button
                onClick={copyOrderNumber}
                className={`px-3 py-1 rounded-full text-sm flex items-center ${
                  isCopied 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {isCopied ? (
                  <>
                    <FaCheck className="mr-1" size={14} />
                    Copiado
                  </>
                ) : (
                  <>
                    <FaCopy className="mr-1" size={14} />
                    Copiar
                  </>
                )}
              </button>
            </div>
            <div className="bg-white p-3 rounded border border-gray-300 text-center">
              <p className="text-2xl font-bold text-gray-900 font-mono tracking-wider">
                #{orderNumber}
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Guarde este número para referência futura
            </p>
          </div>

          {/* Contact Card */}
          <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <FaPhone className="text-blue-600 mr-3" size={20} />
                <h4 className="font-semibold text-gray-800">
                  Contato da Pizzaria
                </h4>
              </div>
              <button
                onClick={savePhoneNumber}
                className={`px-3 py-1 rounded-full text-sm flex items-center ${
                  isPhoneSaved 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-blue-200 text-blue-700 hover:bg-blue-300'
                }`}
              >
                {isPhoneSaved ? (
                  <>
                    <FaCheck className="mr-1" size={14} />
                    Salvo
                  </>
                ) : (
                  <>
                    <FaAddressBook className="mr-1" size={14} />
                    Salvar
                  </>
                )}
              </button>
            </div>
            <div className="bg-white p-3 rounded border border-blue-300 text-center">
              <a 
                href={`tel:${phoneNumber}`} 
                className="text-xl font-semibold text-blue-800 hover:text-blue-900 flex items-center justify-center"
              >
                <FaPhone className="mr-2" />
                {phoneNumber}
              </a>
            </div>
            <p className="text-xs text-blue-600 mt-2 text-center">
              Ligue em caso de dúvidas sobre seu pedido
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-4">
            <button
              onClick={onClose}
              className="py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <FaTimes /> Fechar
            </button>
            
            {!user ? (
              <button
                onClick={() => {
                  onClose();
                  navigate('/fidelidade');
                }}
                className="py-3 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg text-white hover:from-amber-600 hover:to-amber-700 transition-colors flex items-center justify-center gap-2"
              >
                <FaUserPlus /> Registrar Agora
              </button>
            ) : (
              <button
                onClick={onNewOrder}
                className="py-3 bg-gradient-to-r from-green-600 to-green-700 rounded-lg text-white hover:from-green-700 hover:to-green-800 transition-colors flex items-center justify-center gap-2"
              >
                <FaPlus /> Novo Pedido
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();
  
  return (
    <div className="flex items-center ml-2">
      <button 
        onClick={() => setLanguage('pt')}
        className={`px-2 py-1 rounded-md text-xs sm:text-sm font-medium ${
          language === 'pt' ? 'bg-[#016730] text-white' : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        PT
      </button>
      <button 
        onClick={() => setLanguage('en')}
        className={`px-2 py-1 rounded-md text-xs sm:text-sm font-medium ${
          language === 'en' ? 'bg-[#016730] text-white' : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        EN
      </button>
      <button 
        onClick={() => setLanguage('es')}
        className={`px-2 py-1 rounded-md text-xs sm:text-sm font-medium ${
          language === 'es' ? 'bg-[#016730] text-white' : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        ES
      </button>
    </div>
  );
};

const CategoryHeader = ({ category, language }) => {
  return (
    <div className="relative rounded-2xl overflow-hidden mb-8 h-64">
      <img 
        src={categoryImages[category.id]} 
        alt={typeof category.name === 'object' ? category.name[language] : category.name}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30 flex items-end p-6">
        <h2 className="text-3xl font-bold text-white">
          {typeof category.name === 'object' ? category.name[language] : category.name}
        </h2>
      </div>
    </div>
  );
};

const CustomizationModal = ({ 
  product, 
  onClose, 
  onAddToCart,
  language,
  initialSelection = {
    size: 'media',
    border: null,
    quantity: 1,
    extras: [],
    halfAndHalf: false,
    halfPizza1: null,
    halfPizza2: null,
    borderType: 'fina'
  }
}) => {
  const [selection, setSelection] = useState(initialSelection);
  const [activeTab, setActiveTab] = useState('size');
  const isFamilySize = product.sizes && selection.size === 'familia';
  const isPizza = ['tradicionais', 'vegetarianas'].includes(product.category);
  
  const getBasePrice = () => {
    if (selection.halfAndHalf && isFamilySize) {
      const pizza1 = menuData.tradicionais.concat(menuData.vegetarianas)
        .find(p => p.id === (selection.halfPizza1 || product.id));
      const pizza2 = menuData.tradicionais.concat(menuData.vegetarianas)
        .find(p => p.id === selection.halfPizza2);
      
      const price1 = pizza1?.sizes?.[selection.size] || 0;
      const price2 = pizza2?.sizes?.[selection.size] || 0;
      return (price1 + price2) / 2;
    }
    return product.sizes ? (product.sizes[selection.size] || product.sizes.media) : product.price;
  };

  const basePrice = getBasePrice();
  const extrasTotal = selection.extras.reduce((sum, extra) => sum + extra.price, 0);
  const totalPrice = (basePrice + extrasTotal) * selection.quantity;
  
  const handleSizeChange = (size) => {
    setSelection(prev => ({ 
      ...prev, 
      size,
      halfAndHalf: size === 'familia' ? prev.halfAndHalf : false,
      halfPizza1: size === 'familia' ? (prev.halfPizza1 || product.id) : null,
      halfPizza2: size === 'familia' ? prev.halfPizza2 : null
    }));
  };
  
  const handleBorderChange = (border) => {
    setSelection(prev => ({ ...prev, border }));
  };
  
  const toggleExtra = (extra) => {
    setSelection(prev => {
      const extras = prev.extras || [];
      const extraIndex = extras.findIndex(e => e.id === extra.id);
      
      if (extraIndex >= 0) {
        const newExtras = [...extras];
        newExtras.splice(extraIndex, 1);
        return { ...prev, extras: newExtras };
      } else {
        return { ...prev, extras: [...extras, extra] };
      }
    });
  };
  
  const toggleHalfAndHalf = () => {
    setSelection(prev => ({
      ...prev,
      halfAndHalf: !prev.halfAndHalf,
      halfPizza1: !prev.halfAndHalf ? product.id : prev.halfPizza1,
      halfPizza2: !prev.halfAndHalf ? null : prev.halfPizza2
    }));
  };

  const selectHalfPizza = (pizzaId) => {
    setSelection(prev => ({
      ...prev,
      halfPizza2: pizzaId
    }));
  };

  const handleBorderTypeChange = (type) => {
    setSelection(prev => ({ ...prev, borderType: type }));
  };

  const handleQuantityChange = (newQuantity) => {
    setSelection(prev => ({ ...prev, quantity: Math.max(1, newQuantity) }));
  };
  
  const handleAddToCart = () => {
    onAddToCart(product, selection);
    onClose();
  };

  const renderHalfAndHalfSection = () => {
    const firstHalfPizza = menuData.tradicionais.concat(menuData.vegetarianas)
      .find(p => p.id === (selection.halfPizza1 || product.id));
    const secondHalfPizza = selection.halfPizza2 
      ? menuData.tradicionais.concat(menuData.vegetarianas)
          .find(p => p.id === selection.halfPizza2)
      : null;

    const firstHalfPrice = firstHalfPizza?.sizes?.[selection.size] || 0;
    const secondHalfPrice = secondHalfPizza?.sizes?.[selection.size] || 0;

    return (
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="font-medium text-gray-700">
            {t(language, 'halfAndHalf')}
          </label>
          <button
            onClick={toggleHalfAndHalf}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              selection.halfAndHalf ? 'bg-green-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                selection.halfAndHalf ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        {selection.halfAndHalf && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-3 rounded-lg mb-2">
              <p className="text-sm font-medium text-gray-700">
                {t(language, 'firstHalf')}: 
                <span className="ml-2 font-bold">
                  {typeof firstHalfPizza.name === 'object' 
                    ? firstHalfPizza.name[language] 
                    : firstHalfPizza.name} ({(firstHalfPrice / 2).toFixed(2)}€)
                </span>
              </p>
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                {t(language, 'secondHalf')}
              </label>
              <select
                value={selection.halfPizza2 || ''}
                onChange={(e) => selectHalfPizza(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="">{t(language, 'selectHalf')}</option>
                {menuData.tradicionais.concat(menuData.vegetarianas)
                  .filter(p => p.id !== (selection.halfPizza1 || product.id))
                  .map(pizza => (
                    <option key={`half2-${pizza.id}`} value={pizza.id}>
                      {typeof pizza.name === 'object' ? pizza.name[language] : pizza.name} ({(pizza.sizes?.[selection.size] / 2 || 0).toFixed(2)}€)
                    </option>
                  ))}
              </select>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderBorderTypeSection = () => (
    <div className="mb-4">
      <label className="block text-gray-700 mb-2 font-medium">
        {t(language, 'borderType')}
      </label>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => handleBorderTypeChange('fina')}
          className={`py-2 rounded-lg transition-all ${
            selection.borderType === 'fina'
              ? 'bg-white border-2 border-[#016730] text-gray-800'
              : 'bg-white border border-gray-200 text-gray-800 hover:border-gray-300'
          }`}
        >
          {t(language, 'thinBorder')}
        </button>
        <button
          onClick={() => handleBorderTypeChange('grossa')}
          className={`py-2 rounded-lg transition-all ${
            selection.borderType === 'grossa'
              ? 'bg-white border-2 border-[#016730] text-gray-800'
              : 'bg-white border border-gray-200 text-gray-800 hover:border-gray-300'
          }`}
        >
          {t(language, 'thickBorder')}
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Italian flag lines at the top */}
        <div className="h-2 w-full bg-green-600"></div>
        <div className="h-2 w-full bg-white"></div>
        <div className="h-2 w-full bg-red-600"></div>
        
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">
              {typeof product.name === 'object' ? product.name[language] : product.name}
            </h3>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
              <X size={20} />
            </button>
          </div>
          
          {product.description && (
            <p className="text-gray-600 text-sm mb-4">
              {typeof product.description === 'object' ? product.description[language] : product.description}
            </p>
          )}
          
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-4">
            <button
              onClick={() => setActiveTab('size')}
              className={`py-2 px-4 font-medium text-sm ${activeTab === 'size' ? 'text-[#016730] border-b-2 border-[#016730]' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {t(language, 'Size')}
            </button>
            {product.sizes && menuData.bordas.length > 0 && (
              <button
                onClick={() => setActiveTab('border')}
                className={`py-2 px-4 font-medium text-sm ${activeTab === 'border' ? 'text-[#016730] border-b-2 border-[#016730]' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {t(language, 'Stuffed')}
              </button>
            )}
            <button
              onClick={() => setActiveTab('extras')}
              className={`py-2 px-4 font-medium text-sm ${activeTab === 'extras' ? 'text-[#016730] border-b-2 border-[#016730]' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {t(language, 'extras')} ({selection.extras.length})
            </button>
          </div>
        
          {/* Tab Content */}
          <div className="mb-6">
            {activeTab === 'size' && product.sizes && (
              <div>
                <div className="grid grid-cols-3 gap-2">
                  {['individual', 'media', 'familia'].map(size => (
                    <button
                      key={size}
                      onClick={() => handleSizeChange(size)}
                      className={`py-3 rounded-lg transition-all flex flex-col items-center ${
                        selection.size === size
                          ? 'bg-white border-2 border-[#016730] text-gray-800 shadow-md'
                          : 'bg-white border border-gray-200 text-gray-800 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-xs font-medium">{t(language, size)}</div>
                      <div className="font-bold text-sm">
                        {product.sizes[size]?.toFixed(2) || '0.00'}€
                      </div>
                    </button>
                  ))}
                </div>
                
                {/* Seção Meio a Meio (apenas para pizzas de 41cm) */}
                {isPizza && isFamilySize && renderHalfAndHalfSection()}
                
                {/* Seção Tipo de Borda (apenas para pizzas de 41cm) */}
                {isPizza && isFamilySize && renderBorderTypeSection()}
              </div>
            )}
            
            {activeTab === 'border' && product.sizes && menuData.bordas.length > 0 && (
              <div className="space-y-2">
                <button
                  onClick={() => handleBorderChange(null)}
                  className={`w-full px-3 py-2 rounded-lg flex items-center justify-between transition-all ${
                    selection.border === null
                      ? 'bg-white border-2 border-[#016730] text-gray-800'
                      : 'bg-white border border-gray-200 text-gray-800 hover:border-gray-300'
                  }`}
                >
                  <span className="text-sm">{t(language, 'noBorder')}</span>
                  <span className="text-xs text-gray-500">+0.00€</span>
                </button>
                {menuData.bordas.map(border => (
                  <button
                    key={border.id}
                    onClick={() => handleBorderChange(border.id)}
                    className={`w-full px-3 py-2 rounded-lg flex items-center justify-between transition-all ${
                      selection.border === border.id
                        ? 'bg-white border-2 border-[#016730] text-gray-800'
                        : 'bg-white border border-gray-200 text-gray-800 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-sm">
                        {typeof border.name === 'object' ? border.name[language] : border.name}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      +{border.sizes[selection.size || 'media'].toFixed(2)}€
                    </span>
                  </button>
                ))}
              </div>
            )}
            
            {activeTab === 'extras' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto p-1">
                {pizzaExtras.map(extra => {
                  const isSelected = selection.extras.some(e => e.id === extra.id);
                  return (
                    <button
                      key={extra.id}
                      onClick={() => toggleExtra(extra)}
                      className={`p-2 rounded-lg flex flex-col items-start transition-all border ${
                        isSelected
                          ? 'bg-green-50 border-[#016730]'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center w-full">
                        {isSelected && (
                          <FaCheck className="text-[#016730] mr-1 flex-shrink-0" size={12} />
                        )}
                        <span className="text-xs font-medium text-left truncate">
                          {typeof extra.name === 'object' ? extra.name[language] : extra.name}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 mt-1">
                        +{extra.price.toFixed(2)}€
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          
          {selection.extras.length > 0 && activeTab !== 'extras' && (
            <div className="mb-4 text-xs text-[#016730] font-medium">
              {t(language, 'extrasTotal')}: +{selection.extras.reduce((sum, extra) => sum + extra.price, 0).toFixed(2)}€
            </div>
          )}
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-1">{t(language, 'quantity')}</h4>
              <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => handleQuantityChange(selection.quantity - 1)}
                  disabled={selection.quantity <= 1}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 h-8 flex items-center justify-center text-sm font-medium border-l border-r border-gray-200">
                  {selection.quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(selection.quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-gray-500">{t(language, 'total')}</div>
              <div className="text-2xl font-bold text-[#016730]">
                {totalPrice.toFixed(2)}€
              </div>
            </div>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={isPizza && isFamilySize && selection.halfAndHalf && !selection.halfPizza2}
            className={`w-full py-3 bg-gradient-to-r from-red-600 to-[#016730] rounded-xl text-white font-bold hover:from-red-700 hover:to-[#02803c] transition-colors flex items-center justify-center ${
              isPizza && isFamilySize && selection.halfAndHalf && !selection.halfPizza2 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <FaShoppingCart className="mr-2" size={16} />
            {t(language, 'addToCart')}
          </button>

          {isPizza && isFamilySize && selection.halfAndHalf && !selection.halfPizza2 && (
            <p className="text-red-500 text-xs mt-2 text-center">
              Por favor, selecione o sabor para a segunda metade
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({ product, language, onAddToCart }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddClick = (e) => {
    e.stopPropagation();
    
    if (product.sizes) {
      setIsModalOpen(true);
    } else {
      onAddToCart(product, {
        size: null,
        border: null,
        quantity: 1,
        extras: []
      });
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow border-2 border-[#016730]">
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800 mb-1">
                {typeof product.name === 'object' ? product.name[language] : product.name}
              </h3>
              {product.description && (
                <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                  {typeof product.description === 'object' ? product.description[language] : product.description}
                </p>
              )}
            </div>
            
            <div className="text-right ml-2">
              <span className="text-lg font-bold text-red-600">
                {product.sizes ? product.sizes.media.toFixed(2) : product.price.toFixed(2)}€
              </span>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-3">
            {product.rating && (
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  i < Math.floor(product.rating) ? 
                    <FaStar key={i} className="text-amber-400 text-sm" /> : 
                    <FaRegStar key={i} className="text-amber-400 text-sm" />
                ))}
                <span className="ml-1 text-xs text-gray-500">({product.ratingCount || 0})</span>
              </div>
            )}
            
            <button
              onClick={handleAddClick}
              className="px-3 py-1 bg-white border border-[#016730] text-gray-800 rounded-lg font-medium flex items-center justify-center gap-1 shadow-sm hover:shadow-md transition-all text-sm"
            >
              <Plus size={14} weight="bold" className="text-[#016730]" />
              {t(language, 'add')}
            </button>
          </div>
        </div>
      </div>
      
      {isModalOpen && (
        <CustomizationModal
          product={product}
          onClose={() => setIsModalOpen(false)}
          onAddToCart={onAddToCart}
          language={language}
        />
      )}
    </>
  );
};

const StampRewardPreview = ({ cartTotal, language }) => {
  const stampsEarned = Math.floor(cartTotal / 15);

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-amber-800 flex items-center">
          <FaCoins className="mr-2 text-amber-600" />
          {t(language, 'stampsEarned')}
        </h4>
        <span className="bg-amber-200 text-amber-800 px-2 py-1 rounded-full text-xs">
          +{stampsEarned} {t(language, 'stamps')}
        </span>
      </div>
      
      <div className="flex items-center">
        {[...Array(Math.min(5, stampsEarned))].map((_, i) => (
          <div
            key={i}
            className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white shadow-md mx-1"
          >
            <FaCoins size={14} />
          </div>
        ))}
        {stampsEarned > 5 && (
          <span className="ml-2 text-amber-600 font-medium">+{stampsEarned - 5}</span>
        )}
      </div>
    </div>
  );
};

const CartItem = ({ 
  item, 
  language, 
  onRemove, 
  onQuantityChange,
  selosDisponiveis,
  onToggleUseStamps,
  itemsWithStamps,
}) => {
  // Verifica se o item é elegível para selos
const isEligibleForStamps = () => {
  const category = item.category?.toLowerCase();

  // Corrige categorias válidas
  const categoriasValidas = ['tradicionais', 'vegetarianas'];

  // Pizzas meia a meia tamanho família — elegível
  if (item.halfAndHalf && item.selectedSize === 'familia') return true;

  // Pizzas normais elegíveis
  if (categoriasValidas.includes(category) && !item.isBorder) {
    if (['individual', 'media', 'familia'].includes(item.selectedSize)) return true;
  }

  // Entradas — elegíveis
  if (category === 'entradas') return true;

  return false;
};


  const getPizzaName = (id) => {
    const pizza = [...menuData.tradicionais, ...menuData.vegetarianas].find(p => p.id === id);
    return typeof pizza?.name === 'object' ? pizza.name[language] : pizza?.name || 'Desconhecido';
  };

  const calculateStampsNeeded = () => {
    // Meia-a-meia família usa 12 selos (como pizza família normal)
    if (item.halfAndHalf && item.selectedSize === 'familia') return 12 * item.quantity;
    
    // Entradas usam 5 selos cada
    if (item.category === 'entradas') return 5 * item.quantity;
    
    // Pizzas normais
    const size = item.selectedSize || 'media';
    if (size === 'individual') return 10 * item.quantity;
    if (size === 'media') return 11 * item.quantity;
    if (size === 'familia') return 12 * item.quantity;
    
    return 0;
  };

  const handleToggleUseStamps = () => {
    const needed = calculateStampsNeeded();
    if (!itemsWithStamps[item.id] && needed > selosDisponiveis) {
      toast.error(t(language, 'notEnoughStamps'));
      return;
    }
    onToggleUseStamps(item.id, !itemsWithStamps[item.id], needed);
  };

  const useStamps = itemsWithStamps[item.id] || false;

  // Renderização para pizza meia a meia
// Renderização para pizza meia a meia
if (item.halfAndHalf && item.selectedSize === 'familia') {
  console.log('é elegível?', isEligibleForStamps());

  const pizza1 = getPizzaName(item.halfPizza1 || item.id);
  const pizza2 = getPizzaName(item.halfPizza2);

  return (
    <div className="py-4 flex justify-between items-start border-b border-gray-100">
      <div className="flex items-start flex-1 gap-4">
        <div className="relative">
          <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-[#016730] rounded-lg flex items-center justify-center">
            <Pizza size={20} className="text-white" />
          </div>
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
            {item.quantity}
          </span>
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-gray-900 text-sm">
              {typeof item.name === 'object' ? item.name[language] : item.name}
            </h3>
          </div>

          <div className="mt-2 flex flex-col gap-2">
            <div className="flex items-start">
              <span className="w-16 text-xs text-gray-500">Tamanho:</span>
              <span className="text-sm font-medium">{t(language, item.selectedSize)}</span>
            </div>

            <div className="flex items-start">
              <span className="w-16 text-xs text-gray-500">1ª Metade:</span>
              <span className="text-sm font-medium">{pizza1}</span>
            </div>

            <div className="flex items-start">
              <span className="w-16 text-xs text-gray-500">2ª Metade:</span>
              <span className="text-sm font-medium">{pizza2}</span>
            </div>

            {item.borderType && (
              <div className="flex items-start">
                <span className="w-16 text-xs text-gray-500">Borda:</span>
                <span className="text-sm font-medium">
                  {item.borderType === 'grossa' ? 'Grossa' : 'Fina'}
                </span>
              </div>
            )}

            {item.extras?.length > 0 && (
              <div className="flex items-start">
                <span className="w-16 text-xs text-gray-500">Extras:</span>
                <span className="text-sm font-medium">
                  {item.extras.map(extra =>
                    typeof extra.name === 'object' ? extra.name[language] : extra.name
                  ).join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end ml-2">
        {!useStamps && (
          <div className="flex items-center gap-2">
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
              <button
                onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                className="w-7 h-7 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Minus size={12} />
              </button>
              <span className="w-8 h-7 flex items-center justify-center border-l border-r border-gray-200 text-sm">
                {item.quantity}
              </span>
              <button
                onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                className="w-7 h-7 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Plus size={12} />
              </button>
            </div>
            <button
              onClick={() => onRemove(item.id)}
              className="w-7 h-7 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {isEligibleForStamps() && (
        <div className="mt-3 flex items-center justify-between bg-amber-50 p-3 rounded-lg">
          <div className="flex items-center">
            <FaCoins className="text-amber-500 mr-2" />
            <span className="text-sm font-medium text-amber-800">
              {t(language, 'stampsAvailable')}: {selosDisponiveis}
            </span>
          </div>
          
          <button
            onClick={handleToggleUseStamps}
            className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${
              useStamps
                ? 'bg-green-100 text-green-800'
                : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
            } transition-colors`}
          >
            {useStamps ? (
              <>
                <FaCheck className="mr-1" size={10} />
                {t(language, 'usingStamps')} ({calculateStampsNeeded()})
              </>
            ) : (
              <>
                <FaCoins className="mr-1" size={10} />
                {t(language, 'useStamps')} ({calculateStampsNeeded()})
              </>
            )}
          </button>
        </div>
      )}
      </div>
    </div>
  );
}
  // Renderização normal para outros itens
  return (
    <div className="py-4 flex justify-between items-start border-b border-gray-100">
      <div className="flex items-start flex-1 gap-4">
        <div className="relative">
          <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-[#016730] rounded-lg flex items-center justify-center">
            {item.category === 'bebidas' ? (
              <Wine size={20} className="text-white" />
            ) : (
              <Pizza size={20} className="text-white" />
            )}
          </div>
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
            {item.quantity}
          </span>
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-gray-900 text-sm">
              {typeof item.name === 'object' ? item.name[language] : item.name}
            </h3>
            <div className="text-sm font-bold text-[#016730]">
              {useStamps ? (
                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                  {calculateStampsNeeded()} selos
                </span>
              ) : (
                `${(item.price * item.quantity).toFixed(2)}€`
              )}
            </div>
          </div>

          <div className="mt-2 flex flex-col gap-2">
            {item.selectedSize && (
              <div className="flex items-start">
                <span className="w-16 text-xs text-gray-500">Tamanho:</span>
                <span className="text-sm font-medium">{t(language, item.selectedSize)}</span>
              </div>
            )}
            
            {item.borderType && (
              <div className="flex items-start">
                <span className="w-16 text-xs text-gray-500">Borda:</span>
                <span className="text-sm font-medium">
                  {item.borderType === 'grossa' ? 'Grossa' : 'Fina'}
                </span>
              </div>
            )}
            
            {item.extras?.length > 0 && (
              <div className="flex items-start">
                <span className="w-16 text-xs text-gray-500">Extras:</span>
                <span className="text-sm font-medium">
                  {item.extras.map(extra => 
                    typeof extra.name === 'object' ? extra.name[language] : extra.name
                  ).join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end ml-2">
        {!useStamps && (
          <div className="flex items-center gap-2">
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
              <button 
                onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                className="w-7 h-7 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Minus size={12} />
              </button>
              <span className="w-8 h-7 flex items-center justify-center border-l border-r border-gray-200 text-sm">
                {item.quantity}
              </span>
              <button 
                onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                className="w-7 h-7 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Plus size={12} />
              </button>
            </div>
            <button 
              onClick={() => onRemove(item.id)}
              className="w-7 h-7 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        )}
        
        {isEligibleForStamps() && (
            <button 
              onClick={handleToggleUseStamps}
              className={`mt-2 text-xs px-3 py-1 rounded-full ${
                useStamps 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              } transition-colors`}
            >
              {useStamps 
                ? `Usando ${calculateStampsNeeded()} selos` 
                : `Usar selos (${calculateStampsNeeded()})`}
            </button>
          )}

      </div>
    </div>
  );
};

const ExpandableCategorySection = ({ title, products, language, onAddToCart }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="mb-8">
      <div 
        className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm cursor-pointer border border-gray-200 hover:border-[#016730] transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-2">
            {products.length} {t(language, 'items')}
          </span>
          {isExpanded ? (
            <FaAngleDown className="text-gray-500" />
          ) : (
            <FaAngleRight className="text-gray-500" />
          )}
        </div>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ 
              type: "tween",
              duration: 0.3 
            }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {products.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  language={language} 
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CheckoutFlow = ({ 
  cart, 
  setCart, 
  deliveryAreas, 
  language, 
  t, 
  customerInfo, 
  setCustomerInfo, 
  paymentMethod, 
  setPaymentMethod, 
  mbwayNumber, 
  setMbwayNumber, 
  trocoPara, 
  setTrocoPara, 
  selosDisponiveis, 
  setSelosDisponiveis, 
  finalizarPedido, 
  onClose,
  canCheckout,
  user,
  itemsWithStamps,
  setItemsWithStamps
}) => {
  const [step, setStep] = useState(1);
  const [deliveryOption, setDeliveryOption] = useState('retirada');
  const [selectedZone, setSelectedZone] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState("15-25 min");
  const [isZonesExpanded, setIsZonesExpanded] = useState(false);
  const [isAddressFocused, setIsAddressFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [includeNif, setIncludeNif] = useState(false);
  const [nifNumber, setNifNumber] = useState('');
  const [codigoPostal, setCodigoPostal] = useState('');
  const [showZoneAlert, setShowZoneAlert] = useState(false);
  const itemsWithStampsRef = useRef(itemsWithStamps);
  const [query, setQuery] = useState('');
  const [valorPago, setValorPago] = useState('');

  useEffect(() => {
    itemsWithStampsRef.current = itemsWithStamps;
  }, [itemsWithStamps]);

  useEffect(() => {
    if (customerInfo.localidade && deliveryOption === 'entrega') {
      setShowZoneAlert(true);
    }
  }, [customerInfo.localidade, deliveryOption]);

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => {
      if (itemsWithStamps[item.id]) {
        return total;
      }
      
      const basePrice = (item.price || item.sizes?.[item.selectedSize] || 0) * item.quantity;
      const extrasTotal = item.extras?.reduce((sum, extra) => sum + (extra.price * item.quantity), 0) || 0;
      return total + basePrice + extrasTotal;
    }, 0);
  }, [cart, itemsWithStamps]);
  
  const deliveryFee = deliveryOption === 'entrega' && customerInfo.localidade ? 
    (deliveryAreas[selectedZone]?.taxa || 0) : 0;
  
  const finalTotal = cartTotal + deliveryFee;
  
  const troco = paymentMethod === 'dinheiro' && valorPago ? 
    (parseFloat(valorPago) - finalTotal ): 0;

  const selosUsados = useMemo(() => {
    return Object.keys(itemsWithStamps).reduce((total, itemId) => {
      const item = cart.find(i => i.id === itemId);
      if (!item) return total;
      
      if (item.category === 'entradas') {
        return total + (5 * item.quantity);
      }
      
      const size = item.selectedSize || 'media';
      if (size === 'individual') return total + (10 * item.quantity);
      if (size === 'media') return total + (11 * item.quantity);
      if (size === 'familia') return total + (12 * item.quantity);
      return total;
    }, 0);
  }, [cart, itemsWithStamps]);

  const toggleUseStamps = (itemId, use, needed) => {
    setItemsWithStamps(prev => {
      const updated = { ...prev };
      if (use) {
        updated[itemId] = needed;
      } else {
        delete updated[itemId];
      }
      return updated;
    });
  };
  
  const removeFromCart = (itemId) => {
    if (itemsWithStamps[itemId]) {
      const item = cart.find(i => i.id === itemId);
      let stampsToReturn = 0;
      
      if (item.category === 'entradas') {
        stampsToReturn = 5 * item.quantity;
      } else {
        const size = item.selectedSize || 'media';
        if (size === 'individual') stampsToReturn = 10 * item.quantity;
        if (size === 'media') stampsToReturn = 11 * item.quantity;
        if (size === 'familia') stampsToReturn = 12 * item.quantity;
      }
      
      setSelosDisponiveis(prev => prev + stampsToReturn);
    }
    
    const newItemsWithStamps = { ...itemsWithStamps };
    delete newItemsWithStamps[itemId];
    setItemsWithStamps(newItemsWithStamps);
    
    setCart(prev => prev.filter(item => item.id !== itemId));
  };
  
  const adjustQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    if (itemsWithStamps[productId]) {
      const item = cart.find(i => i.id === productId);
      const oldQuantity = item.quantity;
      const quantityDiff = newQuantity - oldQuantity;
      
      let stampsDiff = 0;
      if (item.category === 'entradas') {
        stampsDiff = 5 * quantityDiff;
      } else {
        const size = item.selectedSize || 'media';
        if (size === 'individual') stampsDiff = 10 * quantityDiff;
        if (size === 'media') stampsDiff = 11 * quantityDiff;
        if (size === 'familia') stampsDiff = 12 * quantityDiff;
      }
      
      if (stampsDiff > 0 && stampsDiff > selosDisponiveis) {
        toast.error(t(language, 'notEnoughStamps'));
        return;
      }
      
      setSelosDisponiveis(prev => prev - stampsDiff);
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  };

  const handleTelefoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 9);
    setCustomerInfo({...customerInfo, telefone: value});
  };

  const handleCodigoPostalChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 7);
    setCodigoPostal(value);
    
    if (value.length > 4) {
      const formatted = `${value.slice(0, 4)}-${value.slice(4)}`;
      setCustomerInfo({
        ...customerInfo,
        codigoPostal: formatted
      });
    } else {
      setCustomerInfo({
        ...customerInfo,
        codigoPostal: value
      });
    }
  };

  const handleNifChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 9);
    setNifNumber(value);
  };

  const canProceedToPayment = () => {
    const hasBasicInfo = customerInfo.nome && customerInfo.telefone?.length === 9;
    
    if (deliveryOption === 'entrega') {
      return hasBasicInfo && 
             customerInfo.endereco && 
             customerInfo.localidade && 
             customerInfo.codigoPostal;
    }
    
    return hasBasicInfo;
  };

  

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-gray-500">
                {cart.reduce((total, item) => total + item.quantity, 0)} {t(language, 'items')}
              </span>
            </div>
            
            {cart.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <div className="animate-bounce">
                  <Pizza size={48} className="mx-auto text-gray-300 mb-3 sm:mb-4" />
                </div>
                <h3 className="text-lg sm:text-xl font-medium text-gray-700 mb-1 sm:mb-2">{t(language, 'emptyCart')}</h3>
                <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">{t(language, 'emptyCartMessage')}</p>
                <button
                  onClick={onClose}
                  className="px-6 py-2 sm:px-8 sm:py-3 bg-gradient-to-r from-red-600 to-[#016730] rounded-lg text-white font-bold hover:from-red-700 hover:to-[#02803c] transition-colors text-sm sm:text-base"
                >
                  {t(language, 'exploreMenu')}
                </button>
              </div>
            ) : (
              <>
                <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto pr-2 -mr-2">
                  {cart.map(item => (
                    <CartItem
                      key={`${item.id}-${item.selectedSize}-${item.selectedBorder}-${item.extras?.map(e => e.id).join('-')}`}
                      item={item}
                      language={language}
                      onRemove={removeFromCart}
                      onQuantityChange={adjustQuantity}
                      selosDisponiveis={selosDisponiveis}
                      onToggleUseStamps={toggleUseStamps}
                      itemsWithStamps={itemsWithStamps}
                    />
                  ))}
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4 sm:p-5 mt-4 sm:mt-6 border border-gray-200">
                  <div className="flex justify-between py-1 sm:py-2 text-sm sm:text-base">
                    <span className="text-gray-700">{t(language, 'subtotal')}:</span>
                    <span className="font-medium">{cartTotal.toFixed(2)}€</span>
                  </div>
                  
                  {deliveryOption === 'entrega' && (
                    <div className="flex justify-between py-1 sm:py-2 text-xs sm:text-sm text-gray-500">
                      <span>{t(language, 'deliveryFee')}:</span>
                      <span>{deliveryFee.toFixed(2)}€</span>
                    </div>
                  )}
                  
                  {selosUsados > 0 && (
                    <div className="flex justify-between py-1 sm:py-2 text-[#016730]">
                      <span className="flex items-center">
                        {t(language, 'stampsUsed')} ({selosUsados} {t(language, 'stamps')})
                        <FaCoins className="ml-1" size={14} />
                      </span>
                      <span className="font-bold">-{(cartTotal + deliveryFee - finalTotal).toFixed(2)}€</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between py-2 sm:py-3 border-t border-gray-200 mt-1 sm:mt-2">
                    <span className="font-bold text-sm sm:text-base">{t(language, 'estimatedTotal')}:</span>
                    <span className="font-bold text-xl sm:text-2xl text-[#016730]">
                      {finalTotal.toFixed(2)}€
                    </span>
                  </div>
                                  {selosUsados > 0 && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <FaCoins className="text-amber-600 mr-2" />
                            <span className="font-medium text-amber-800">
                              {t(language, 'stampsUsed')}: {selosUsados}
                            </span>
                          </div>
                          <span className="bg-amber-200 text-amber-800 px-3 py-1 rounded-full text-sm font-bold">
                            {t(language, 'paidWithStamps')}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-3">
                          {cart.filter(item => itemsWithStamps[item.id]).map(item => (
                            <div key={item.id} className="bg-amber-100 p-2 rounded-lg">
                              <p className="text-xs font-medium text-amber-800 truncate">
                                {typeof item.name === 'object' ? item.name[language] : item.name}
                              </p>
                              <p className="text-xs text-amber-600">
                                {itemsWithStamps[item.id]} {t(language, 'stamps')}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}          
                  {Math.floor(cartTotal / 15) > 0 && (
                    <StampRewardPreview cartTotal={cartTotal} language={language} />
                  )}
                  {!user && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
                      <FaInfoCircle className="inline mr-2" />
                      {t(language, 'guestStampNotice')}
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => setStep(2)}
                  className="w-full mt-4 sm:mt-6 py-3 sm:py-4 bg-gradient-to-r from-red-600 to-[#016730] rounded-xl text-white font-bold hover:from-red-700 hover:to-[#02803c] transition-colors flex items-center justify-center text-sm sm:text-base"
                >
                  <FaShoppingCart className="mr-2" size={16} />
                  {t(language, 'proceedToCheckout')}
                </button>
              </>
            )}
          </div>
        );
      
      case 2: {
        const validarDados = () => {
          const dadosObrigatorios = customerInfo.nome?.trim() && 
                                  customerInfo.telefone?.trim() && 
                                  customerInfo.telefone.length === 9;
          
          if (deliveryOption === 'entrega') {
            return (
              dadosObrigatorios &&
              customerInfo.endereco?.trim() &&
              customerInfo.localidade &&
              selectedZone &&
              codigoPostal.length === 7
            );
          }
          return dadosObrigatorios;
        };

        return (
          <div className="space-y-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                {[1, 2, 3, 4].map((stepNum) => (
                  <div key={stepNum} className="flex flex-col items-center relative">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        stepNum < 2
                          ? 'bg-green-600 text-white'
                          : stepNum === 2
                          ? 'bg-white border-2 border-green-600 text-green-600 font-bold'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {stepNum}
                    </div>
                    {stepNum < 4 && (
                      <div className="absolute top-4 left-14 w-16 h-0.5 bg-gray-200">
                        <div
                          className={`h-full ${
                            stepNum < 2 ? 'bg-green-600' : 'bg-gray-200'
                          }`}
                        ></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500 px-2">
                <span>Carrinho</span>
                <span className="text-green-600 font-medium">Informações</span>
                <span>Pagamento</span>
                <span>Confirmação</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => setDeliveryOption('retirada')}
                className={`p-4 rounded-xl border-2 flex flex-col items-center transition-all ${
                  deliveryOption === 'retirada'
                    ? 'border-green-600 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <FaStore className="text-xl mb-2" />
                <span className="font-bold">Retirada</span>
                <span className="text-xs text-gray-500 mt-1">Sem taxa</span>
              </button>

              <button
                onClick={() => setDeliveryOption('entrega')}
                className={`p-4 rounded-xl border-2 flex flex-col items-center transition-all ${
                  deliveryOption === 'entrega'
                    ? 'border-green-600 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <FaMotorcycle className="text-xl mb-2" />
                <span className="font-bold">Entrega</span>
                <span className="text-xs text-gray-500 mt-1">Taxa: {selectedZone ? deliveryAreas[selectedZone]?.taxa.toFixed(2) + '€' : '--'}</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Nome Completo*</label>
                <input
                  type="text"
                  value={customerInfo.nome}
                  onChange={(e) => setCustomerInfo({...customerInfo, nome: e.target.value})}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Seu nome completo"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">Telefone*</label>
                <input
                  type="tel"
                  value={customerInfo.telefone}
                  onChange={handleTelefoneChange}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="912345678"
                  required
                />
                {customerInfo.telefone && customerInfo.telefone.length !== 9 && (
                  <p className="text-red-500 text-xs mt-1">O telefone deve ter 9 dígitos</p>
                )}
              </div>

              {deliveryOption === 'entrega' && (
                <>
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Endereço Completo*</label>
                    <input
                      type="text"
                      value={customerInfo.endereco}
                      onChange={(e) =>
                        setCustomerInfo({ ...customerInfo, endereco: e.target.value })
                      }
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="Rua, número, complemento, apartamento..."
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2 font-medium">Código Postal*</label>
                    <input
                      type="text"
                      value={codigoPostal}
                      onChange={handleCodigoPostalChange}
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="Ex: 1234-567"
                      required
                    />
                  </div>

                  <label className="block text-gray-700 mb-2 font-medium">Zona de Entrega*</label>
                  <div className="relative">
                    <Combobox
                      value={customerInfo.localidade}
                      onChange={(bairro) => {
                        const zona = Object.keys(deliveryAreas).find(
                          (z) => deliveryAreas[z].bairros[language].includes(bairro)
                        );
                        setSelectedZone(zona);
                        setCustomerInfo({ ...customerInfo, localidade: bairro });
                      }}
                    >
                      <div className="relative">
                        <Combobox.Input
                          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="Busque sua zona ou bairro"
                          displayValue={(bairro) => bairro}
                          onChange={(event) => setQuery(event.target.value)}
                        />
                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-4">
                          <FaChevronDown className="text-gray-400" />
                        </Combobox.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        afterLeave={() => setQuery('')}
                      >
                        <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                          {Object.entries(deliveryAreas).map(([zona, dados]) => (
                            <div key={zona}>
                              <div className="px-4 py-2 text-sm text-gray-500 bg-gray-50">
                                {zona}
                              </div>
                              {dados.bairros[language]
                                .filter((bairro) =>
                                  query === '' ||
                                  bairro.toLowerCase().includes(query.toLowerCase()) ||
                                  zona.toLowerCase().includes(query.toLowerCase())
                                )
                                .map((bairro) => (
                                  <Combobox.Option
                                    key={bairro}
                                    value={bairro}
                                    className={({ active }) =>
                                      `px-4 py-2 cursor-pointer ${active ? 'bg-green-100' : 'bg-white'}`
                                    }
                                  >
                                    {({ selected }) => (
                                      <div className="flex items-center">
                                        {selected && <FaCheck className="text-green-500 mr-2" />}
                                        <span className={`${selected ? 'font-medium' : 'font-normal'}`}>
                                          {bairro}
                                        </span>
                                      </div>
                                    )}
                                  </Combobox.Option>
                                ))}
                            </div>
                          ))}
                        </Combobox.Options>
                      </Transition>
                    </Combobox>
                  </div>
                </>
              )}

              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-medium">NIF (Opcional)</label>
                <input
                  type="text"
                  value={customerInfo.nif}
                  onChange={(e) => setCustomerInfo({
                    ...customerInfo,
                    nif: e.target.value
                  })}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Digite o NIF"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">Observações</label>
                <textarea
                  value={customerInfo.observacoes}
                  onChange={(e) => setCustomerInfo({...customerInfo, observacoes: e.target.value})}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Pontos de referência, instruções especiais..."
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-between gap-4 pt-6 border-t border-gray-200">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!validarDados()}
                className={`flex-1 py-3 rounded-xl text-white font-bold transition-colors ${
                  validarDados()
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Continuar para Pagamento
              </button>
            </div>
          </div>
        );
      }
      case 3:
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                {[1, 2, 3, 4].map((stepNum) => (
                  <div key={stepNum} className="flex flex-col items-center relative">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        stepNum < 3
                          ? 'bg-green-600 text-white'
                          : stepNum === 3
                          ? 'bg-white border-2 border-green-600 text-green-600 font-bold'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {stepNum}
                    </div>
                    {stepNum < 4 && (
                      <div className="absolute top-4 left-14 w-16 h-0.5 bg-gray-200">
                        <div
                          className={`h-full ${
                            stepNum < 3 ? 'bg-green-600' : 'bg-gray-200'
                          }`}
                        ></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500 px-2">
                <span>Carrinho</span>
                <span>Informações</span>
                <span className="text-green-600 font-medium">Pagamento</span>
                <span>Confirmação</span>
              </div>
            </div>

            {user && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaCoins className="text-amber-600 mr-2" />
                    <span className="font-medium text-amber-800">
                      {selosDisponiveis} {t(language, 'stampsAvailable')}
                    </span>
                  </div>
                  {selosUsados > 0 && (
                    <span className="text-sm bg-amber-200 text-amber-800 px-2 py-1 rounded-full">
                      {t(language, 'stampsUsed')}: {selosUsados}
                    </span>
                  )}
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              <button
                onClick={() => setPaymentMethod('mbway')}
                className={`p-4 rounded-xl border-2 flex flex-col items-center transition-all ${
                  paymentMethod === 'mbway' ? 'border-[#016730] bg-green-100 text-[#016730]' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mb-2">
                  <DeviceMobile size={20} weight={paymentMethod === 'mbway' ? 'fill' : 'regular'} />
                </div>
                <span className="font-bold text-sm">{t(language, 'mbway')}</span>
                <span className="text-xs text-gray-500 mt-1">{t(language, 'mbwayDescription')}</span>
              </button>
              
              <button
                onClick={() => setPaymentMethod('dinheiro')}
                className={`p-4 rounded-xl border-2 flex flex-col items-center transition-all ${
                  paymentMethod === 'dinheiro' ? 'border-[#016730] bg-green-100 text-[#016730]' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center mb-2">
                  <Money size={20} weight={paymentMethod === 'dinheiro' ? 'fill' : 'regular'} />
                </div>
                <span className="font-bold text-sm">{t(language, 'cash')}</span>
                <span className="text-xs text-gray-500 mt-1">{t(language, 'cashDescription')}</span>
              </button>
              
              <button
                onClick={() => setPaymentMethod('cartao')}
                className={`p-4 rounded-xl border-2 flex flex-col items-center transition-all ${
                  paymentMethod === 'cartao' ? 'border-[#016730] bg-green-100 text-[#016730]' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center mb-2">
                  <CreditCard size={20} weight={paymentMethod === 'cartao' ? 'fill' : 'regular'} />
                </div>
                <span className="font-bold text-sm">{t(language, 'card')}</span>
                <span className="text-xs text-gray-500 mt-1">{t(language, 'cardDescription')}</span>
              </button>

              <button
                onClick={() => setPaymentMethod('multibanco')}
                className={`p-4 rounded-xl border-2 flex flex-col items-center transition-all ${
                  paymentMethod === 'multibanco' ? 'border-[#016730] bg-green-100 text-[#016730]' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mb-2">
                  <FaMoneyBillWave size={20} />
                </div>
                <span className="font-bold text-sm">Multibanco</span>
                <span className="text-xs text-gray-500 mt-1">Pague na entrega</span>
              </button>
            </div>

            {paymentMethod === 'mbway' && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <label className="block text-gray-700 mb-2 font-medium text-sm sm:text-base">{t(language, 'mbwayNumber')}</label>
                <div className="flex items-center border border-blue-300 bg-white rounded-lg overflow-hidden">
                  <span className="px-3 py-2 bg-blue-100 text-blue-800 text-sm">+351</span>
                  <input
                    type="tel"
                    value={mbwayNumber}
                    onChange={(e) => setMbwayNumber(e.target.value)}
                    className="flex-1 p-2 sm:p-3 focus:outline-none text-sm sm:text-base"
                    placeholder="912 345 678"
                    required
                  />
                </div>
                <p className="text-xs sm:text-sm text-blue-700 mt-2 flex items-center">
                  <FaQrcode className="mr-1" /> {t(language, 'mbwayDescription')}
                </p>
              </div>
            )}
            
            {paymentMethod === 'dinheiro' && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium text-sm sm:text-base">{t(language, 'changeFor')}</label>
                  <div className="flex items-center border border-green-300 bg-white rounded-lg overflow-hidden">
                    <span className="px-3 py-2 bg-green-100 text-green-800">
                      <CurrencyEur size={18} />
                    </span>
                    <input
                       type="number"
                        value={valorPago}
                        onChange={(e) => setValorPago(e.target.value)}
                      className="flex-1 p-2 sm:p-3 focus:outline-none text-sm sm:text-base"
                      placeholder={t(language, 'changeExample')}
                      required
                    />
                  </div>
                </div>
                
                {valorPago && (
                  <div className="bg-white p-3 rounded-lg border border-green-200">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">Valor pago:</span>
                      <span className="font-bold">{parseFloat(valorPago).toFixed(2)}€</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="font-medium text-gray-700">Total do pedido:</span>
                      <span className="font-medium">{finalTotal.toFixed(2)}€</span>
                    </div>
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-green-100">
                      <span className="font-bold text-green-700">Troco:</span>
                      <span className="font-bold text-green-700">
                        {troco >= 0 ? troco.toFixed(2) + '€' : 'Valor insuficiente'}
                      </span>
                    </div>
                    {troco >= 0 ? (
                      <p className="text-xs text-green-600 mt-2 flex items-center">
                        <FaInfoCircle className="mr-1" />
                        O entregador estará preparado com o troco de {troco.toFixed(2)}€
                      </p>
                    ) : (
                      <p className="text-xs text-red-500 mt-2 flex items-center">
                        <FaExclamationTriangle className="mr-1" />
                        O valor pago deve ser maior ou igual ao total do pedido
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {paymentMethod === 'multibanco' && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center">
                  <FaInfoCircle className="text-blue-600 mr-2" />
                  <p className="text-sm text-blue-700">
                    Você pode pagar com Multibanco quando o entregador chegar. O valor total será {finalTotal.toFixed(2)}€.
                  </p>
                </div>
              </div>
            )}

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <h3 className="font-bold text-gray-800 mb-3 text-sm sm:text-base">{t(language, 'orderSummary')}</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm sm:text-base">{t(language, 'subtotal')} ({cart.reduce((total, item) => total + item.quantity, 0)} {t(language, 'items')})</span>
                  <span className="font-medium">{cartTotal.toFixed(2)}€</span>
                </div>
                
                {deliveryOption === 'entrega' && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm sm:text-base">{t(language, 'deliveryFee')}</span>
                    <span className="font-medium">
                      {deliveryFee.toFixed(2)}€
                      {customerInfo.localidade && (
                        <span className="text-xs text-gray-500 ml-1">({customerInfo.localidade})</span>
                      )}
                    </span>
                  </div>
                )}
                
                {selosUsados > 0 && (
                  <div className="flex justify-between text-[#016730]">
                    <span className="text-sm sm:text-base">{t(language, 'stampsUsed')}</span>
                    <span className="font-medium">
                      -{(cartTotal + deliveryFee - finalTotal).toFixed(2)}€ ({selosUsados} {t(language, 'stamps')})
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between py-2 sm:py-3 border-t border-gray-200 mt-1 sm:mt-2">
                <div>
                  <span className="font-bold text-sm sm:text-base">{t(language, 'estimatedTotal')}:</span>
                  <div className="flex items-center text-xs sm:text-sm text-gray-500 mt-1">
                    <FaRegClock className="mr-1" />
                    <span>{t(language, 'estimatedTime')}: {estimatedTime}</span>
                  </div>
                </div>
                <span className="font-bold text-xl sm:text-2xl text-[#016730]">
                  {finalTotal.toFixed(2)}€
                </span>
              </div>
              
              <div className="mt-4 bg-white p-3 rounded-lg border border-gray-200 flex items-center">
                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center mr-3">
                  <FaMotorcycle className="text-[#016730]" size={16} />
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-sm sm:text-base">{t(language, deliveryOption === 'retirada' ? 'pickup' : 'delivery')}</p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {deliveryOption === 'retirada' ? 
                      t(language, 'pickupAddress') : 
                      customerInfo.endereco ? `${customerInfo.endereco}, ${customerInfo.localidade}` : t(language, 'addressPlaceholder')}
                  </p>
                </div>
              </div>

              {includeNif && nifNumber && (
                <div className="mt-4 bg-white p-3 rounded-lg border border-gray-200">
                  <p className="font-medium text-gray-800 text-sm sm:text-base">NIF na fatura</p>
                  <p className="text-xs sm:text-sm text-gray-500">{nifNumber}</p>
                </div>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium flex-1 sm:flex-none text-sm sm:text-base"
              >
                {t(language, 'back')}
              </button>
             <button
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              onClick={() => {
                console.log('🛵 DeliveryOption:', deliveryOption);
                console.log('📍 SelectedZone:', selectedZone);
                finalizarPedido(valorPago, deliveryOption, selectedZone);
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Finalizar Pedido'}
            </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">
              {step === 1 ? t(language, 'yourCart') : 
               step === 2 ? t(language, 'deliveryInfo') : 
               step === 3 ? t(language, 'paymentMethod') : t(language, 'orderConfirmed')}
            </h3>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
              <X size={20} />
            </button>
          </div>
          
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

const InterfaceClienteInner = () => {
  const [activeCategory, setActiveCategory] = useState('todos');
  const [showCheckout, setShowCheckout] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState('retirada');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [customerInfo, setCustomerInfo] = useState({
    nome: '',
    telefone: '',
    endereco: '',
    localidade: '',
    codigoPostal: '',
    nif: '',
    observacoes: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('mbway');
  const [trocoPara, setTrocoPara] = useState('');
  const [mbwayNumber, setMbwayNumber] = useState('');
  const [selosDisponiveis, setSelosDisponiveis] = useState(0);
  const [selectedZone, setSelectedZone] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState("15-25 min");
  const [user] = useAuthState(auth);
  const [isZonesExpanded, setIsZonesExpanded] = useState(false);
  const [isAddressFocused, setIsAddressFocused] = useState(false);
  const [showAddedNotification, setShowAddedNotification] = useState(false);
  const [addedItemName, setAddedItemName] = useState('');
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const { language, t } = useLanguage();
  const [canCheckout, setCanCheckout] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoadingStamps, setIsLoadingStamps] = useState(true);
  const [orders, setOrders] = useState([]);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [itemsWithStamps, setItemsWithStamps] = useState({});
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [includeNif, setIncludeNif] = useState(false);
  const [nifNumber, setNifNumber] = useState('');
  const [codigoPostal, setCodigoPostal] = useState('');
  const [valorPago, setValorPago] = useState('');

  const categories = [
    { id: 'todos', name: t(language, 'todos'), icon: <Wine size={24} />, color: 'bg-purple-500' },
    { id: 'tradicionais', name: t(language, 'tradicionais'), icon: <Pizza size={24} />, color: 'bg-red-500' },
    { id: 'vegetarianas', name: t(language, 'vegetarianas'), icon: <Leaf size={24} />, color: 'bg-green-500' },
    { id: 'entradas', name: t(language, 'entradas'), icon: <FaBreadSlice />, color: 'bg-amber-500' },
    { id: 'petiscos', name: t(language, 'petiscos'), icon: <Hamburger size={24} />, color: 'bg-orange-500' },
    { id: 'doces', name: t(language, 'doces'), icon: <IceCream size={24} />, color: 'bg-pink-500' },
    { id: 'bordas', name: t(language, 'bordas'), icon: <FaPizzaSlice />, color: 'bg-yellow-500' },
    { id: 'massas', name: t(language, 'massas'), icon: <FaPizzaSlice />, color: 'bg-blue-500' },
    { id: 'sobremesas', name: t(language, 'sobremesas'), icon: <FaIceCream />, color: 'bg-indigo-500' },
    { id: 'bebidas', name: t(language, 'bebidas'), icon: <FaWineGlassAlt />, color: 'bg-blue-500' },
    { id: 'vinhos', name: t(language, 'vinhos'), icon: <FaWineGlassAlt />, color: 'bg-rose-500' },
  ];

  // Persistir carrinho no localStorage
  const [cart, setCart] = useState(() => {
    const savedCart = typeof window !== 'undefined' ? localStorage.getItem('pizzaNostraCart') : null;
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('pizzaNostraCart', JSON.stringify(cart));
    } catch (error) {
      console.error("Erro ao salvar carrinho:", error);
    }
  }, [cart]);

  // Notificação de item adicionado (3 segundos)
  useEffect(() => {
    if (showAddedNotification) {
      const timer = setTimeout(() => {
        setShowAddedNotification(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showAddedNotification]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const unsubscribeUser = onSnapshot(userRef, async (doc) => {
          try {
            if (doc.exists()) {
              const userData = doc.data();
              setSelosDisponiveis(userData.selos || 0);
            } else {
              await setDoc(userRef, {
                selos: 0,
                criadoEm: serverTimestamp(),
                userId: user.uid,
                email: user.email
              });
              setSelosDisponiveis(0);
            }
          } catch (error) {
            console.error("Erro ao carregar selos:", error);
          } finally {
            setIsLoadingStamps(false);
          }
        });
        return () => unsubscribeUser();
      } else {
        setSelosDisponiveis(0);
        setIsLoadingStamps(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const basicCheck = customerInfo.nome && 
                     customerInfo.telefone?.length === 9;
    
    const deliveryCheck = deliveryOption === 'entrega' 
      ? customerInfo.endereco && 
        customerInfo.localidade && 
        customerInfo.codigoPostal
      : true;
    
    setCanCheckout(basicCheck && deliveryCheck && cart.length > 0);
  }, [customerInfo, deliveryOption, cart]);

const addToCart = (product, selection) => {
  const { size, border, quantity, extras, halfAndHalf, halfPizza1, halfPizza2, borderType } = selection;

  const getPizzaName = (id) => {
    const pizza = [...menuData.tradicionais, ...menuData.vegetarianas].find(p => p.id === id);
    return typeof pizza?.name === 'object' ? pizza.name[language] : pizza?.name || 'Desconhecido';
  };

  const createBaseItem = (itemProduct, itemSize, itemQuantity, itemExtras) => ({
    ...itemProduct,
    quantity: itemQuantity,
    price: itemProduct.sizes ? (itemProduct.sizes[itemSize] || itemProduct.sizes.media) : itemProduct.price,
    selectedSize: itemSize,
    extras: itemExtras,
    originalPrice: itemProduct.sizes ? (itemProduct.sizes[itemSize] || itemProduct.sizes.media) : itemProduct.price,
    category: itemProduct.category || 'outros',
    isBorder: false
  });

  if (halfAndHalf && size === 'familia') {
    setCart(prevCart => {
      const pizza1 = menuData.tradicionais.concat(menuData.vegetarianas).find(p => p.id === halfPizza1);
      const pizza2 = menuData.tradicionais.concat(menuData.vegetarianas).find(p => p.id === halfPizza2);
      const avgPrice = (pizza1?.sizes?.[size] + pizza2?.sizes?.[size]) / 2;

      const halfHalfItem = {
        id: `${halfPizza1}-${halfPizza2}-${size}-${Date.now()}`,
        name: {
          pt: `½ ${pizza1?.name?.pt || pizza1?.name} + ½ ${pizza2?.name?.pt || pizza2?.name}`,
          en: `½ ${pizza1?.name?.en || pizza1?.name} + ½ ${pizza2?.name?.en || pizza2?.name}`,
          es: `½ ${pizza1?.name?.es || pizza1?.name} + ½ ${pizza2?.name?.es || pizza2?.name}`
        },
        quantity,
        price: avgPrice,
        originalPrice: avgPrice,
        selectedSize: size,
        extras,
        halfAndHalf: true,
        halfPizza1: halfPizza1,
        halfPizza2: halfPizza2,
        borderType,
        category: 'pizzas',
        isBorder: false,
        stampsEligible: true // Adiciona flag para selos
      };

      const existingIndex = prevCart.findIndex(item =>
        item.id === halfHalfItem.id &&
        item.selectedSize === size &&
        JSON.stringify(item.extras) === JSON.stringify(extras) &&
        item.borderType === borderType
      );

      if (existingIndex >= 0) {
        const updatedCart = [...prevCart];
        updatedCart[existingIndex].quantity += quantity;
        return updatedCart;
      }

      // Adiciona borda se selecionada
      if (border && menuData.bordas.find(b => b.id === border)) {
        const borderItem = menuData.bordas.find(b => b.id === border);
        const borderPrice = borderItem.sizes[size] || borderItem.sizes.media;
        
        return [
          ...prevCart, 
          halfHalfItem,
          {
            ...borderItem,
            id: `${borderItem.id}-${halfPizza1}-${halfPizza2}`,
            quantity,
            price: borderPrice,
            selectedSize: size,
            isBorder: true,
            originalPrice: borderPrice,
            category: 'bordas'
          }
        ];
      }

      return [...prevCart, halfHalfItem];
    });

    setAddedItemName(`½ ${getPizzaName(halfPizza1)} + ½ ${getPizzaName(halfPizza2)}`);
    setShowAddedNotification(true);
    return;
  }

  // Lógica para produtos com tamanhos (pizzas normais)
  if (product.sizes) {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => 
        item.id === product.id && 
        item.selectedSize === size && 
        item.selectedBorder === border &&
        JSON.stringify(item.extras) === JSON.stringify(extras) &&
        !item.isBorder
      );
      
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id && 
          item.selectedSize === size && 
          item.selectedBorder === border &&
          JSON.stringify(item.extras) === JSON.stringify(extras) &&
          !item.isBorder
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const newItem = createBaseItem(product, size, quantity, extras);
        newItem.selectedBorder = border;
        newItem.stampsEligible = ['tradicionais', 'vegetarianas'].includes(product.category);

        if (border && menuData.bordas.find(b => b.id === border)) {
          const borderItem = menuData.bordas.find(b => b.id === border);
          const borderPrice = borderItem.sizes[size] || borderItem.sizes.media;
          
          return [
            ...prevCart, 
            newItem,
            {
              ...borderItem,
              id: `${borderItem.id}-${product.id}`,
              quantity,
              price: borderPrice,
              selectedSize: size,
              isBorder: true,
              originalPrice: borderPrice,
              category: 'bordas'
            }
          ];
        }
        
        return [...prevCart, newItem];
      }
    });
  } else {
    // Lógica para produtos sem tamanhos (bebidas, entradas)
    setCart(prevCart => {
      const existingItem = prevCart.find(item => 
        item.id === product.id &&
        JSON.stringify(item.extras) === JSON.stringify(extras) &&
        !item.isBorder
      );
      
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id &&
          JSON.stringify(item.extras) === JSON.stringify(extras) &&
          !item.isBorder
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const newItem = createBaseItem(product, null, quantity, extras);
        newItem.stampsEligible = product.category === 'entradas'; // Entradas usam selos
        return [...prevCart, newItem];
      }
    });
  }

  setAddedItemName(typeof product.name === 'object' ? product.name[language] : product.name);
  setShowAddedNotification(true);
};


const finalizarPedido = async (valorPagoAtual, entregaSelecionada, zonaSelecionada) => {
  if (isSubmitting) return;
  setIsSubmitting(true);

  try {
    if (cart.length === 0) {
      throw new Error(t(language, 'emptyCart'));
    }

    // Validações de meio a meio e borda
    cart.forEach(item => {
      if (item.halfAndHalf && item.selectedSize !== 'familia') {
        throw new Error('Opção meio a meio disponível apenas para pizzas de 41cm');
      }
      
      if (item.borderType && item.selectedSize !== 'familia') {
        throw new Error('Seleção de borda disponível apenas para pizzas de 41cm');
      }

      if (item.halfAndHalf && (!item.halfPizza1 || !item.halfPizza2)) {
        throw new Error('Por favor, selecione ambas as metades para a pizza meio a meio');
      }
    });

    // Função auxiliar para obter preço da pizza
    const getPizzaPrice = (pizzaId, size) => {
      const pizza = [...menuData.tradicionais, ...menuData.vegetarianas].find(p => p.id === pizzaId);
      return pizza?.sizes?.[size] || pizza?.price || 0;
    };

    // Cálculos do pedido
    const totalSemTaxa = cart.reduce((total, item) => {
      if (itemsWithStamps[item.id]) return total;
      
      let precoBase;
      if (item.halfAndHalf && item.selectedSize === 'familia') {
        // Calcula média de preço para pizza meio a meio
        const price1 = getPizzaPrice(item.halfPizza1 || item.id, item.selectedSize);
        const price2 = getPizzaPrice(item.halfPizza2, item.selectedSize);
        precoBase = (price1 + price2) / 2;
      } else {
        precoBase = item.price || item.sizes?.[item.selectedSize] || 0;
      }

      const extras = item.extras?.reduce((sum, extra) => sum + extra.price, 0) || 0;
      return total + ((precoBase + extras) * item.quantity);
    }, 0);

    const taxaEntrega = entregaSelecionada === 'entrega' && zonaSelecionada 
      ? (deliveryAreas[zonaSelecionada]?.taxa || 0) 
      : 0;

    const totalFinal = totalSemTaxa + taxaEntrega;

    const valorPagoNum = paymentMethod === 'dinheiro' && valorPagoAtual
      ? parseFloat(String(valorPagoAtual).replace(',', '.'))
      : null;

    const troco = Math.max(0, (valorPagoNum - totalFinal));

    const selosUsados = cart.reduce((total, item) => {
      if (!itemsWithStamps[item.id]) return total;
      if (item.selectedSize === 'individual') return total + (10 * item.quantity);
      if (item.selectedSize === 'media') return total + (11 * item.quantity);
      if (item.selectedSize === 'familia') return total + (12 * item.quantity);
      if (item.category === 'entradas') return total + (5 * item.quantity);
      return total;
    }, 0);

    const selosGanhos = user ? Math.floor(totalSemTaxa / 15) : 0;

    // Gerando número do pedido
    const timestamp = Date.now();
    const numeroPedido = String(timestamp).slice(-5).padStart(5, '0');
    setOrderNumber(numeroPedido);

    // Criando referência do documento
    const pedidoRef = doc(collection(db, 'pedidos'));

    // Preparando itens para o Firestore
    const itensFirestore = cart.map(item => {
      // Obter nomes das pizzas para meia a meia
      const getPizzaName = (id) => {
        const pizza = [...menuData.tradicionais, ...menuData.vegetarianas].find(p => p.id === id);
        return typeof pizza?.name === 'object' ? pizza.name[language] : pizza?.name || 'Desconhecido';
      };

      const itemData = {
        id: item.id,
        nome: typeof item.name === 'object' ? item.name[language] : item.name,
        quantidade: item.quantity,
        preco: itemsWithStamps[item.id] ? 0 : (item.price || item.sizes?.[item.selectedSize] || 0),
        tamanho: item.selectedSize || null,
        borda: item.selectedBorder || null,
        isBorder: item.isBorder || false,
        pagoComSelos: !!itemsWithStamps[item.id],
        selosUsados: itemsWithStamps[item.id]
          ? (item.category === 'entradas' ? 5 * item.quantity
             : item.selectedSize === 'individual' ? 10 * item.quantity
             : item.selectedSize === 'media' ? 11 * item.quantity
             : item.selectedSize === 'familia' ? 12 * item.quantity
             : 0)
          : 0,
        halfAndHalf: item.halfAndHalf || false,
        halfPizza1: item.halfAndHalf ? item.halfPizza1 : null,
        halfPizza2: item.halfAndHalf ? item.halfPizza2 : null,
        halfPizza1Name: item.halfAndHalf ? getPizzaName(item.halfPizza1 || item.id) : null,
        halfPizza2Name: item.halfAndHalf ? getPizzaName(item.halfPizza2) : null,
        borderType: item.borderType || 'fina',
        categoria: item.category || 'outros'
      };

      // Adiciona extras se existirem
      if (item.extras?.length > 0) {
        itemData.extras = item.extras.map(extra => ({
          id: extra.id,
          nome: typeof extra.name === 'object' ? extra.name[language] : extra.name,
          preco: itemsWithStamps[item.id] ? 0 : extra.price
        }));
      }

      return itemData;
    });

    const pedidoData = {
      cliente: {
        nome: customerInfo.nome,
        telefone: customerInfo.telefone,
        endereco: customerInfo.endereco || null,
        localidade: customerInfo.localidade || null,
        codigoPostal: customerInfo.codigoPostal || null,
        nif: customerInfo.nif || null,
        userId: user?.uid || null,
      },
      tipoEntrega: entregaSelecionada,
      enderecoCompleto: entregaSelecionada === 'entrega' 
        ? `${customerInfo.endereco}, ${customerInfo.localidade}, ${customerInfo.codigoPostal}`
        : null,
      zonaEntrega: entregaSelecionada === 'entrega' ? zonaSelecionada : null,
      itens: itensFirestore,
      subtotal: totalSemTaxa,
      taxaEntrega,
      total: totalFinal,
      selosUsados,
      selosGanhos,
      metodoPagamento: paymentMethod,
      status: 'pendente',
      criadoEm: serverTimestamp(),
      atualizadoEm: serverTimestamp(),
      numeroPedido,
      idFirebase: pedidoRef.id,
      userId: user?.uid || null,
      detalhesPagamento: {
        valorPago: paymentMethod === 'dinheiro' && valorPagoNum !== null ? valorPagoNum : null,
        troco: paymentMethod === 'dinheiro' && valorPagoNum !== null ? troco : null,
        taxaEntrega: taxaEntrega ?? 0,
        zonaEntrega: entregaSelecionada === 'entrega' ? zonaSelecionada : null
      },
      observacoes: customerInfo.observacoes || '',
    };

    // Salvando o pedido
    await setDoc(pedidoRef, pedidoData);

    // Atualizando selos do usuário
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        selos: increment(selosGanhos - selosUsados),
        selosAtualizadoEm: serverTimestamp()
      });
    }

    // Limpando o carrinho e mostrando confirmação
    setCart([]);
    setItemsWithStamps({});
    setShowOrderConfirmation(true);
    setShowCheckout(false);

    if (user) {
      setSelosDisponiveis(prev => prev + selosGanhos - selosUsados);
    }

    localStorage.removeItem('pizzaNostraCart');

  } catch (error) {
    console.error("❌ Erro ao finalizar pedido:", error);
    toast.error(`${t(language, 'orderError')}: ${error.message}`);
  } finally {
    setIsSubmitting(false);
  }
};

  const renderProducts = () => {
    if (activeCategory === 'todos') {
      return (
        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.filter(c => c.id !== 'todos').map(category => (
              <div key={category.id} className="space-y-6">
                <CategoryHeader category={category} language={language} />
                <ExpandableCategorySection
                  title={typeof category.name === 'object' ? category.name[language] : category.name}
                  products={menuData[category.id] || []}
                  language={language}
                  onAddToCart={addToCart}
                />
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    return (
      <div>
        <CategoryHeader category={categories.find(c => c.id === activeCategory)} language={language} />
        <div className="space-y-6">
          <ExpandableCategorySection
            title={typeof categories.find(c => c.id === activeCategory).name === 'object' 
              ? categories.find(c => c.id === activeCategory).name[language] 
              : categories.find(c => c.id === activeCategory).name}
            products={menuData[activeCategory] || []}
            language={language}
            onAddToCart={addToCart}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 relative overflow-x-hidden">
      <AnimatePresence>
        {showAddedNotification && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-[#016730] text-white px-4 py-3 rounded-lg shadow-lg flex items-center">
              <FaCheck className="mr-2" />
              <span className="font-medium">{addedItemName} {t(language, 'addedToCart')}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="bg-white shadow-sm sticky top-0 z-50 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-3 sm:py-4">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-full border-4 border-black overflow-hidden">
              <img 
                src={logo} 
                alt="Pizza Nostra" 
                className="w-full h-full object-cover rounded-full"
                loading="lazy"
              />
            </div>       
            <h1 
              className="text-xl sm:text-2xl font-bold text-black tracking-tight italic"
              style={{ fontFamily: "'Times New Roman', Times, serif" }}
            >
              <span>Pizza</span>
              <span className="ml-2 sm:ml-3">Nostra</span>
            </h1>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <LanguageSelector />
            
            {user ? (
              <button 
                onClick={() => navigate('/fidelidade')}
                className="relative flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-2 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors"
              >
                <FaUser className="text-gray-600 text-sm sm:text-base" />
              </button>
            ) : (
              <button
                onClick={() => navigate('/fidelidade')}
                className="flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
              >
                <FaUser className="text-gray-600 text-sm sm:text-base" />
              </button>
            )}
            
            <button 
              onClick={() => setShowCheckout(true)}
              className="relative p-1 sm:p-2 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="relative">
                <FaShoppingCart className="text-gray-700 text-sm sm:text-base" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full shadow-md">
                    {cart.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                )}
              </div>
              <span className="sr-only">Carrinho</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div 
          className="relative rounded-2xl p-6 sm:p-8 md:p-12 mb-8 sm:mb-12 text-white overflow-hidden shadow-2xl"
          ref={ref}
        >
          <img 
            src={categoryImages.tradicionais}
            alt="Pizza italiana" 
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30"></div>
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
              {t(language, 'title')}
            </h1>
            
            <p className="text-sm sm:text-base lg:text-xl opacity-90 mb-6 sm:mb-8 max-w-lg">
              A autêntica pizza italiana... com um abraço caloroso do Brasil!
            </p>
          </div>
          
          <div className="absolute right-4 sm:right-8 bottom-4 sm:bottom-8 opacity-20 md:opacity-100">
            <Pizza size={120} weight="fill" className="text-white" />
          </div>
        </div>

        <div className="mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
            {t(language, 'ourMenu')} 
          </h2>
          
          <div className="flex overflow-x-auto pb-4 sm:pb-6 gap-2 sm:gap-3 scrollbar-hide px-1 -mx-1">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center px-4 py-3 rounded-xl whitespace-nowrap transition-all text-sm sm:text-base bg-white border-2 border-[#016730] text-gray-800 hover:bg-gray-50 shadow-md`}
              >
                <span className="mr-2">{category.icon}</span>
                <span className="font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          {renderProducts()}
        </div>
      </div>

      <AnimatePresence>
        {showCheckout && (
          <CheckoutFlow
            cart={cart}
            setCart={setCart}
            deliveryAreas={deliveryAreas}
            language={language}
            t={t}
            customerInfo={customerInfo}
            setCustomerInfo={setCustomerInfo}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            mbwayNumber={mbwayNumber}
            setMbwayNumber={setMbwayNumber}
            trocoPara={trocoPara}
            setTrocoPara={setTrocoPara}
            selosDisponiveis={selosDisponiveis}
            setSelosDisponiveis={setSelosDisponiveis}
            finalizarPedido={finalizarPedido}
            onClose={() => setShowCheckout(false)}
            canCheckout={canCheckout}
            user={user}
            itemsWithStamps={itemsWithStamps}
            setItemsWithStamps={setItemsWithStamps}
          />
        )}
      </AnimatePresence>

      {showOrderConfirmation && (
        <OrderConfirmationModal
          orderNumber={orderNumber}
          onClose={() => setShowOrderConfirmation(false)}
          onNewOrder={() => {
            setShowOrderConfirmation(false);
            setCustomerInfo({
              nome: '',
              telefone: '',
              endereco: '',
              localidade: '',
              observacoes: ''
            });
            setCodigoPostal('');
            setIncludeNif(false);
            setNifNumber('');
          }}
          language={language}
          user={user}
          navigate={navigate}
        />
      )}
      <AnimatePresence>
        {showWelcomeModal && (
          <WelcomeModal onClose={() => setShowWelcomeModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

const InterfaceCliente = () => {
  return (
    <LanguageProvider>
      <InterfaceClienteInner />
    </LanguageProvider>
  );
};

export default InterfaceCliente;