import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FaPizzaSlice, FaLeaf, FaIceCream, FaBreadSlice, FaWineGlassAlt, FaShoppingCart, FaMapMarkerAlt, FaMoneyBillWave, FaCreditCard, FaQrcode, FaRegStar, FaStar, FaChevronDown, FaChevronUp, FaRegClock, FaMotorcycle, FaGlobe, FaPhone, FaCheck, FaCoins, FaTicketAlt, FaTimes, FaCheckCircle, FaExclamationTriangle, FaGift, FaInfoCircle, FaUser, FaStore, FaAngleDown, FaAngleRight } from 'react-icons/fa';
import { Pizza, Leaf, IceCream, Hamburger, Wine, X, Check, Plus, Minus, MapPin, CreditCard, CurrencyEur, DeviceMobile, Money } from '@phosphor-icons/react';
import { motion, AnimatePresence, useAnimation, useInView } from 'framer-motion';
import { useNavigate, } from 'react-router-dom';
import { db, auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, setDoc, getDoc, getDocs, updateDoc, arrayUnion, serverTimestamp, Timestamp, arrayRemove , increment ,onSnapshot,  query, orderBy, limit,addDoc,writeBatch } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { LanguageProvider, useLanguage } from './LanguageContext';
import { menuData, deliveryAreas } from './menuData';
import logo from './logo.jpg';
import { t } from './translations';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import WelcomeModal from './WelcomeModal';


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
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCheckCircle className="text-green-600 text-2xl" />
          </div>
          
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {t(language, 'orderSentSuccess')}!
          </h3>
          
          <p className="text-gray-600 mb-4">
            {t(language, 'orderNumber')}: <span className="font-mono font-bold">#{orderNumber}</span>
          </p>

          {!user && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 text-left">
              <h4 className="font-bold text-blue-800 mb-2 flex items-center">
                <FaCoins className="mr-2 text-blue-600" />
                {t(language, 'registerToEarn')}
              </h4>
              <p className="text-sm text-blue-700">
                {t(language, 'registerToEarnDescription')}
              </p>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors flex-1"
            >
              {t(language, 'close')}
            </button>
            <button
              onClick={onNewOrder}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-green-600 rounded-xl text-white font-bold hover:from-red-700 hover:to-green-700 transition-colors flex-1"
            >
              {t(language, 'newOrder')}
            </button>
            {!user && (
              <button
                onClick={() => {
                  onClose();
                  navigate('/fidelidade');
                }}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl text-white font-bold hover:from-blue-700 hover:to-blue-800 transition-colors flex-1"
              >
                {t(language, 'registerNow')}
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
    extras: []
  }
}) => {
  const [selection, setSelection] = useState(initialSelection);
  const [activeTab, setActiveTab] = useState('size');
  const basePrice = product.sizes ? (product.sizes[selection.size] || product.sizes.media) : product.price;
  const extrasTotal = selection.extras.reduce((sum, extra) => sum + extra.price, 0);
  const totalPrice = (basePrice + extrasTotal) * selection.quantity;
  
  const handleSizeChange = (size) => {
    setSelection(prev => ({ ...prev, size }));
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
  
  const handleQuantityChange = (newQuantity) => {
    setSelection(prev => ({ ...prev, quantity: Math.max(1, newQuantity) }));
  };
  
  const handleAddToCart = () => {
    onAddToCart(product, selection);
    onClose();
  };
  
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
          className="w-full py-3 bg-gradient-to-r from-red-600 to-[#016730] rounded-xl text-white font-bold hover:from-red-700 hover:to-[#02803c] transition-colors flex items-center justify-center"
        >
          <FaShoppingCart className="mr-2" size={16} />
          {t(language, 'addToCart')}
        </button>
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
  const isEligibleForStamps = ['tradicionais', 'vegetarianas', 'entradas'].includes(item.category) && 
                            !item.isBorder;
 const calculateStampsNeeded = () => {
    if (item.category === 'entradas') return 5 * item.quantity;
    if (item.selectedSize === 'individual') return 10 * item.quantity;
    if (item.selectedSize === 'media') return 11 * item.quantity;
    if (item.selectedSize === 'familia') return 12 * item.quantity;
    return 0;
  };

  const stampsNeeded = calculateStampsNeeded();
  const useStamps = itemsWithStamps[item.id] || false;
  

  const handleToggleUseStamps = () => {
    const needed = calculateStampsNeeded();
    if (!useStamps && needed > selosDisponiveis) {
      toast.error(t(language, 'notEnoughStamps'));
      return;
    }
    onToggleUseStamps(item.id, !useStamps, needed);
  };
  
  const basePrice = item.price || 0;
  const extrasTotal = item.extras?.reduce((sum, extra) => sum + extra.price, 0) || 0;
  const itemTotal = (basePrice + extrasTotal) * item.quantity;
  
  return (
    <div className="py-3 sm:py-4 flex justify-between items-center">
      <div className="flex items-center">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg overflow-hidden mr-3 sm:mr-4 relative">
          <div className="w-full h-full bg-gradient-to-br from-red-600 to-[#016730] flex items-center justify-center">
            <Pizza size={20} className="text-white" />
          </div>
          <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full">
            {item.quantity}
          </div>
        </div>
        <div>
          <h3 className="font-medium text-gray-800 text-sm sm:text-base">
            {typeof item.name === 'object' ? item.name[language] : item.name}
            {item.isBorder && ` (${t(language, 'border')})`}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500">
            {useStamps ? (
              <span className="text-[#016730] font-medium">
                {t(language, 'paidWithStamps')} ({stampsNeeded} {t(language, 'stamps')})
              </span>
            ) : (
              <>
                {itemTotal.toFixed(2)}€
                {extrasTotal > 0 && (
                  <span className="text-xs text-gray-400 ml-1 line-through">
                    {(basePrice * item.quantity).toFixed(2)}€
                  </span>
                )}
              </>
            )}
          </p>
          {item.selectedSize && (
            <p className="text-xs text-gray-500">
              {t(language, 'size')}: {t(language, item.selectedSize)}
            </p>
          )}
          {item.extras?.length > 0 && (
            <p className="text-xs text-gray-500">
              {t(language, 'extras')}: {item.extras.map(extra => 
                typeof extra.name === 'object' ? extra.name[language] : extra.name
              ).join(', ')}
            </p>
          )}
        </div>
      </div>
      
      <div className="flex items-center">
        {isEligibleForStamps && (
          <div className="mr-2 sm:mr-4 flex items-center">
            <input
              type="checkbox"
              id={`use-stamps-${item.id}`}
              checked={useStamps}
              onChange={handleToggleUseStamps}
              className="mr-2 h-4 w-4 text-[#016730] focus:ring-[#016730] border-gray-300 rounded"
            />
            <label htmlFor={`use-stamps-${item.id}`} className="text-xs text-gray-700">
              {t(language, 'useStampsForItem', { selos: calculateStampsNeeded() })}
            </label>
          </div>
        )}
        
        {!useStamps && (
          <>
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
              <button 
                onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Minus size={12} />
              </button>
              <span className="w-8 h-7 sm:w-10 sm:h-8 flex items-center justify-center border-l border-r border-gray-200 text-xs sm:text-sm">
                {item.quantity}
              </span>
              <button 
                onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Plus size={12} />
              </button>
            </div>
            <button 
              onClick={() => onRemove(item.id)}
              className="ml-2 sm:ml-4 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <X size={16} />
            </button>
          </>
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
      
      const basePrice = (item.price || item.sizes?.media || 0) * item.quantity;
      const extrasTotal = item.extras?.reduce((sum, extra) => sum + (extra.price * item.quantity), 0) || 0;
      return total + basePrice + extrasTotal;
    }, 0);
  }, [cart, itemsWithStamps]);
  
  const deliveryFee = deliveryOption === 'entrega' && customerInfo.localidade ? 
    (deliveryAreas[selectedZone]?.taxa || 0) : 0;
  
  const finalTotal = cartTotal + deliveryFee;
  
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
  const value = e.target.value.replace(/\D/g, '').slice(0, 7); // Aceita apenas números, máximo 7 dígitos
  setCodigoPostal(value);
  
  // Formata automaticamente com hífen após 4 dígitos
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
  // Validações básicas (nome e telefone)
  const hasBasicInfo = customerInfo.nome && customerInfo.telefone?.length === 9;
  
  // Se for entrega, valida endereço completo
  if (deliveryOption === 'entrega') {
    return hasBasicInfo && 
           customerInfo.endereco && 
           customerInfo.localidade && 
           customerInfo.codigoPostal;
  }
  
  // Se for retirada, só precisa dos básicos
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
              {user && (
                <span className="text-xs sm:text-sm bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                  {selosDisponiveis} {t(language, 'stampsAvailable')}
                </span>
              )}
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
                    <div className="flex justify-between py-1 sm:py-2 text-[#016730] text-sm sm:text-base">
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
                        <div className="flex items-center justify-between">
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
                        <p className="text-sm text-amber-700 mt-2 flex items-center">
                          <FaInfoCircle className="mr-2" />
                          {t(language, 'onlyChargeDelivery')}
                        </p>
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
        // Validação robusta dos campos
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
              codigoPostal.length === 7 // Código postal português tem 7 dígitos
            );
          }
          return dadosObrigatorios;
        };

        return (
          <div className="space-y-6">
            {/* Título e Progresso */}
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <span className="hidden md:inline">Passo 2 de 3</span>
              <span className="mx-2 hidden md:inline">•</span>
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center mr-2">
                  2
                </div>
                <span className="font-medium text-gray-700">Informações de Entrega</span>
              </div>
            </div>

            {/* Opções de Retirada/Entrega */}
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

            {/* Campos do Formulário */}
            <div className="space-y-4">
              {/* Nome e Telefone (sempre visíveis) */}
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

              {/* Campos específicos para entrega */}
              {deliveryOption === 'entrega' && (
                <>
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Endereço Completo*</label>
                    <input
                      type="text"
                      value={customerInfo.endereco}
                      onChange={(e) => setCustomerInfo({...customerInfo, endereco: e.target.value})}
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="Rua, número, complemento, apartamento..."
                      required
                    />
                  
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
                    
                    <label className="block text-gray-700 mb-2 font-medium">Bairro*</label>
                    <select
                      value={customerInfo.localidade}
                      onChange={(e) => {
                        const bairro = e.target.value;
                        const zona = Object.keys(deliveryAreas).find(
                          (z) => deliveryAreas[z].bairros[language].includes(bairro)
                        );
                        setSelectedZone(zona);
                        setCustomerInfo({...customerInfo, localidade: bairro});
                      }}
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      required
                    >
                      <option value="">Selecione seu bairro</option>
                      {Object.entries(deliveryAreas).map(([zona, dados]) => (
                        <optgroup key={zona} label={`${zona} (${dados.taxa.toFixed(2)}€)`}>
                          {dados.bairros[language].map((bairro) => (
                            <option key={bairro} value={bairro}>
                              {bairro}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>

                  {showZoneAlert && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-start">
                        <FaInfoCircle className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
                        <p className="text-blue-700 text-sm">
                          Por favor, insira corretamente o seu endereço e selecione a freguesia ou localidade correspondente.
                        </p>
                      </div>
                    </div>
                  )}
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


              {/* Campo de observações (opcional) */}
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

            {/* Botões de navegação */}
            <div className="flex justify-between gap-4 pt-6 border-t border-gray-200">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Voltar
              </button>
              <button
              onClick={() => setStep(3)}
              disabled={!canProceedToPayment()}
              className={`flex-1 py-3 rounded-xl text-white font-bold transition-colors ${
                canProceedToPayment()
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
            <div className="flex items-center justify-between">
              <div className="hidden sm:flex items-center text-sm text-gray-500">
                <span className="hidden sm:inline">Passo 2 de 3</span>
                <span className="mx-2 hidden sm:inline">•</span>
                <div className="flex items-center opacity-50">
                  <div className="w-5 h-5 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center mr-2">
                    1
                  </div>
                  <span>{t(language, 'deliveryInfo')}</span>
                </div>
                <span className="mx-2 text-gray-300">›</span>
                <div className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-[#016730] text-white flex items-center justify-center mr-2">
                    2
                  </div>
                  <span className="font-medium text-gray-700">{t(language, 'paymentMethod')}</span>
                </div>
                <span className="mx-2 text-gray-300">›</span>
                <div className="flex items-center opacity-50">
                  <div className="w-5 h-5 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center mr-2">
                    3
                  </div>
                  <span>{t(language, 'orderConfirmed')}</span>
                </div>
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
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
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
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <label className="block text-gray-700 mb-2 font-medium text-sm sm:text-base">{t(language, 'changeFor')}</label>
                <div className="flex items-center border border-green-300 bg-white rounded-lg overflow-hidden">
                  <span className="px-3 py-2 bg-green-100 text-green-800">
                    <CurrencyEur size={18} />
                  </span>
                  <input
                    type="number"
                    value={trocoPara}
                    onChange={(e) => setTrocoPara(e.target.value)}
                    className="flex-1 p-2 sm:p-3 focus:outline-none text-sm sm:text-base"
                    placeholder={t(language, 'changeExample')}
                    required
                  />
                </div>
                <p className="text-xs sm:text-sm text-green-700 mt-2">
                  {t(language, 'cashDescription')}
                </p>
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
                onClick={finalizarPedido}
                disabled={!canCheckout || isSubmitting}
                className={`w-full py-3 rounded-lg text-white font-bold ${
                  (canCheckout && !isSubmitting)
                    ? 'bg-gradient-to-r from-[#016730] to-blue-600 hover:from-[#02803c] hover:to-blue-700'
                    : 'bg-gray-400 cursor-not-allowed'
                } transition-colors flex items-center justify-center`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t(language, 'processing')}
                  </>
                ) : (
                  <>
                    <FaCheckCircle className="mr-2" />
                    {t(language, 'confirmOrder')}
                  </>
                )}
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
  codigoPostal: '', // Campo adicionado
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

  

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

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
      customerInfo.codigoPostal // Apenas verifica se tem valor
    : true;
  
  setCanCheckout(basicCheck && deliveryCheck && cart.length > 0);
}, [customerInfo, deliveryOption, cart]);

  const addToCart = (product, selection) => {
    const { size, border, quantity, extras } = selection;
    
    const createBaseItem = (itemProduct, itemSize, itemQuantity, itemExtras) => ({
      ...itemProduct,
      quantity: itemQuantity,
      price: itemProduct.sizes ? (itemProduct.sizes[itemSize] || itemProduct.sizes.media) : itemProduct.price,
      selectedSize: itemSize,
      extras: itemExtras,
      originalPrice: itemProduct.sizes ? (itemProduct.sizes[itemSize] || itemProduct.sizes.media) : itemProduct.price,
      category: itemProduct.category || 'outros'
    });

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
          return [...prevCart, createBaseItem(product, null, quantity, extras)];
        }
      });
    }
    
    setAddedItemName(typeof product.name === 'object' ? product.name[language] : product.name);
    setShowAddedNotification(true);
  };

  const finalizarPedido = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // 1. VALIDAÇÃO INICIAL
      if (cart.length === 0) {
        throw new Error(t(language, 'emptyCart'));
      }

      // 2. CÁLCULO DOS SELOS USADOS (CORREÇÃO DEFINITIVA)
      const selosUsados = cart.reduce((total, item) => {
        if (!itemsWithStamps[item.id]) return total;
        
        // Pizza individual = 10 selos
        if (item.selectedSize === 'individual') return total + (10 * item.quantity);
        
        // Pizza média = 11 selos
        if (item.selectedSize === 'media') return total + (11 * item.quantity);
        
        // Pizza família = 12 selos
        if (item.selectedSize === 'familia') return total + (12 * item.quantity);
        
        // Entradas = 5 selos
        if (item.category === 'entradas') return total + (5 * item.quantity);
        
        return total;
      }, 0);

      // 3. CÁLCULO DO TOTAL PAGO (EXCLUINDO ITENS COM SELOS)
      const totalPago = cart.reduce((total, item) => {
        if (itemsWithStamps[item.id]) return total;
        
        const precoBase = item.price || item.sizes?.[item.selectedSize] || 0;
        const extras = item.extras?.reduce((sum, extra) => sum + extra.price, 0) || 0;
        return total + ((precoBase + extras) * item.quantity);
      }, 0);

      // 4. TAXA DE ENTREGA (SE APLICÁVEL)
      const taxaEntrega = deliveryOption === 'entrega' ? (deliveryAreas[selectedZone]?.taxa || 0) : 0;

      // 5. SELOS GANHOS (1 SELO A CADA 15€ GASTOS)
      const selosGanhos = user ? Math.floor(totalPago / 15) : 0;

      // 6. ATUALIZAÇÃO DOS SELOS NO FIREBASE (OPERAÇÃO ATÔMICA)
      if (user?.uid) {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          selos: increment(selosGanhos - selosUsados),
          atualizadoEm: serverTimestamp()
        });
      }

      // 7. PREPARAÇÃO DOS DADOS DO PEDIDO
      const numeroPedido = (Math.random() * 1000000).toFixed(0).padStart(6, '0');
      setOrderNumber(numeroPedido);

      const pedidoData = {
        // INFORMAÇÕES DO CLIENTE
          cliente: {
          nome: customerInfo.nome,
          telefone: customerInfo.telefone,
          endereco: customerInfo.endereco || null,
          localidade: customerInfo.localidade || null,
          codigoPostal: customerInfo.codigoPostal || null, // Já formatado com hífen
          nif: customerInfo.nif || null,
          userId: user?.uid || null,
        },
        

        // DETALHES DO PEDIDO
        tipoEntrega: deliveryOption,
         enderecoCompleto: deliveryOption === 'entrega' 
    ? `${customerInfo.endereco}, ${customerInfo.localidade}, ${codigoPostal ? `${codigoPostal.slice(0, 4)}-${codigoPostal.slice(4)}` : ''}`
    : null,
        zonaEntrega: deliveryOption === 'entrega' ? selectedZone : null,

        // ITENS DO PEDIDO
        itens: cart.map(item => {
          const usandoSelos = !!itemsWithStamps[item.id];
          
          return {
            id: item.id,
            nome: typeof item.name === 'object' ? item.name[language] : item.name,
            quantidade: item.quantity,
            preco: usandoSelos ? 0 : (item.price || item.sizes?.[item.selectedSize] || 0),
            tamanho: item.selectedSize || null,
            borda: item.selectedBorder || null,
            extras: item.extras?.map(extra => ({
              id: extra.id,
              nome: typeof extra.name === 'object' ? extra.name[language] : extra.name,
              preco: usandoSelos ? 0 : extra.price
            })) || [],
            isBorder: item.isBorder || false,
            pagoComSelos: usandoSelos,
            selosUsados: usandoSelos
              ? (item.category === 'entradas' ? 5 * item.quantity
                 : item.selectedSize === 'individual' ? 10 * item.quantity
                 : item.selectedSize === 'media' ? 11 * item.quantity
                 : item.selectedSize === 'familia' ? 12 * item.quantity
                 : 0)
              : 0
          };
        }),

        // VALORES E PAGAMENTO
        total: totalPago + taxaEntrega,
        subtotal: totalPago,
        taxaEntrega,
        selosUsados,
        selosGanhos,
        metodoPagamento: paymentMethod,
        status: 'pendente',
        criadoEm: serverTimestamp(),
        atualizadoEm: serverTimestamp(),
        numeroPedido,
        userId: user?.uid || null,

        // INFORMAÇÕES ADICIONAIS
        ...(paymentMethod === 'dinheiro' && { trocoPara: parseFloat(trocoPara) || 0 }),
        ...(paymentMethod === 'mbway' && { mbwayNumber }),
        observacoes: customerInfo.observacoes || null
      };
      
     console.log('Dados sendo enviados:', customerInfo);

      // 8. SALVAR PEDIDO NO FIRESTORE
      await addDoc(collection(db, 'pedidos'), pedidoData);

      // 9. LIMPAR ESTADOS E MOSTRAR CONFIRMAÇÃO
      setCart([]);
      setItemsWithStamps({});
      setShowOrderConfirmation(true);
      setShowCheckout(false);

      // 10. ATUALIZAR SELOS DISPONÍVEIS LOCALMENTE
      if (user) {
        setSelosDisponiveis(prev => prev + selosGanhos - selosUsados);
      }
     localStorage.removeItem('pizzaNostraCart');
    } catch (error) {
      console.error("Erro ao finalizar pedido:", error);
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