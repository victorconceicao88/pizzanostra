import React, { useState } from 'react';
import { X, Storefront, Pizza, Bicycle, Gift, Flame } from 'phosphor-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const PizzaHeroSection = () => {
  return (
    <div className="relative w-full h-64 bg-gradient-to-br from-red-900 to-red-700 rounded-t-xl overflow-hidden">
      {/* Efeito de profundidade */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwMDAiIG9wYWNpdHk9IjAuMDMiPjwvcmVjdD48L3N2Zz4=')]"></div>
      
      {/* Pizza em destaque */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-48 h-48 sm:w-56 sm:h-56">
          {/* Base da pizza */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-300 to-amber-400 shadow-2xl border-8 border-amber-200">
            {/* Queijo derretido */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 opacity-90"></div>
            
            {/* Catupiry premium */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-white bg-opacity-90 flex items-center justify-center shadow-inner">
              <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center">
                <span className="text-xs font-bold text-amber-700 tracking-widest">CATUPIRY</span>
              </div>
            </div>
            
            {/* Fatias de calabresa premium */}
            {[...Array(12)].map((_, i) => {
              const angle = (i * 30) * (Math.PI / 180);
              const distance = 38;
              const size = 16;
              
              return (
                <div
                  key={i}
                  className="absolute rounded-lg shadow-md"
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    top: `${50 + distance * Math.sin(angle)}%`,
                    left: `${50 + distance * Math.cos(angle)}%`,
                    transform: 'translate(-50%, -50%) rotate(45deg)',
                    background: 'linear-gradient(135deg, #7f1d1d, #991b1b)'
                  }}
                >
                  <div className="absolute inset-0.5 rounded-sm bg-gradient-to-br from-red-800 to-red-700"></div>
                </div>
              );
            })}
          </div>
          
          {/* Efeito de brilho */}
          <div className="absolute inset-0 rounded-full pointer-events-none overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-amber-200 opacity-20 blur-xl"></div>
          </div>
        </div>
      </div>
      
      {/* Destaque inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/30 to-transparent flex items-end justify-center pb-2">
        <div className="flex items-center bg-red-600 text-white px-4 py-1 rounded-full shadow-lg">
          <Flame size={20} className="mr-2 text-amber-300" />
          <span className="font-bold text-sm tracking-wide">A MAIS PEDIDA DA CASA</span>
        </div>
      </div>
    </div>
  );
};

const OptionCard = ({ icon, title, description, color }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`p-4 rounded-xl ${color} border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer`}
    >
      <div className="flex items-center space-x-4">
        <div className="p-2 rounded-lg bg-white bg-opacity-80">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

const WelcomeModal = ({ onClose }) => {
  const navigate = useNavigate();
  const [isClosing, setIsClosing] = useState(false);

  const handleJoin = () => {
    onClose();
    navigate('/fidelidade');
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  };

  const options = [
    {
      icon: <Storefront size={24} className="text-amber-500" />,
      title: "Comer no Restaurante",
      description: "Ambiente climatizado e atendimento premium",
      color: "bg-amber-50"
    },
    {
      icon: <Pizza size={24} className="text-red-500" />,
      title: "Para Viagem",
      description: "Embalagem especial para manter o sabor",
      color: "bg-red-50"
    },
    {
      icon: <Bicycle size={24} className="text-green-500" />,
      title: "Delivery Express",
      description: "Entrega rápida e pizza sempre quentinha",
      color: "bg-green-50"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={isClosing ? { opacity: 0, scale: 0.95 } : { opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="relative w-full max-w-md bg-white rounded-xl overflow-hidden shadow-2xl"
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white hover:bg-gray-100 transition-all shadow-md border border-gray-200"
        >
          <X size={18} className="text-gray-600" />
        </button>

        <PizzaHeroSection />

        <div className="p-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-center text-gray-900 mb-2"
          >
            <span className="text-red-600">CALABRESA</span> <span className="text-amber-600">COM CATUPIRY</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center text-gray-600 mb-6"
          >
            A combinação perfeita de sabores tradicionais
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-3 mb-6"
          >
            {options.map((option, index) => (
              <OptionCard key={index} {...option} />
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-3"
          >
            <button
              onClick={handleJoin}
              className="w-full py-3 bg-gradient-to-r from-red-600 to-amber-600 rounded-lg text-white font-bold shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-center justify-center">
                <Gift size={20} className="mr-2" />
                EXPERIMENTE AGORA
              </div>
            </button>

            <button
              onClick={handleClose}
              className="w-full py-2.5 bg-white border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Continuar sem cadastro
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default WelcomeModal;