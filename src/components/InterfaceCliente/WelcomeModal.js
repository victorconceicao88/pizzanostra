import React, { useState } from 'react';
import { X, Storefront, Pizza, Bicycle, Gift, Flame } from 'phosphor-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const PizzaDisplay = () => {
  return (
    <div className="relative w-full h-48 md:h-56 bg-gradient-to-br from-red-900 to-red-800 flex items-center justify-center overflow-hidden">
      {/* Efeito de textura sutil */}
      <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmZmYiIG9wYWNpdHk9IjAuMDUiPjwvcmVjdD48L3N2Zz4=')]"></div>
      
      {/* Pizza */}
      <div className="relative w-36 h-36 sm:w-40 sm:h-40 md:w-44 md:h-44">
        {/* Massa */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-300 to-amber-400 shadow-lg border-[6px] border-amber-200">
          {/* Queijo */}
          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-amber-100 to-amber-50 opacity-90"></div>
          
          {/* Catupiry */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white bg-opacity-90 flex items-center justify-center shadow-inner">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-amber-50 flex items-center justify-center">
              <span className="text-[10px] sm:text-xs font-bold text-amber-700 tracking-wider">CATUPIRY</span>
            </div>
          </div>
          
          {/* Calabresa */}
          {[...Array(10)].map((_, i) => {
            const angle = (i * 36) * (Math.PI / 180);
            const distance = 32;
            const size = 12 + (i % 2) * 2;
            
            return (
              <div
                key={i}
                className="absolute rounded-sm shadow-sm"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  top: `${50 + distance * Math.sin(angle)}%`,
                  left: `${50 + distance * Math.cos(angle)}%`,
                  transform: 'translate(-50%, -50%) rotate(45deg)',
                  background: 'linear-gradient(135deg, #7f1d1d, #991b1b)'
                }}
              />
            );
          })}
        </div>
        
        {/* Brilho */}
        <div className="absolute top-1/4 left-1/4 w-20 h-20 rounded-full bg-amber-200 opacity-20 blur-lg"></div>
      </div>
      
      {/* Destaque */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <div className="flex items-center bg-red-600 text-white px-3 py-1 rounded-full shadow-md">
          <Flame size={16} className="mr-1 text-amber-300" />
          <span className="text-xs sm:text-sm font-bold">A MAIS PEDIDA</span>
        </div>
      </div>
    </div>
  );
};

const OptionCard = ({ icon, title, description, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + delay * 0.1 }}
      whileHover={{ y: -3 }}
      className="p-3 bg-white rounded-lg border border-gray-100 shadow-xs hover:shadow-sm transition-all"
    >
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-md bg-gradient-to-br from-red-50 to-amber-50">
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
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
      icon: <Storefront size={20} className="text-amber-500" />,
      title: "Comer no Local",
      description: "Ambiente climatizado e premium"
    },
    {
      icon: <Pizza size={20} className="text-red-500" />,
      title: "Para Viagem",
      description: "Embalagem especial que mantém o sabor"
    },
    {
      icon: <Bicycle size={20} className="text-green-500" />,
      title: "Delivery",
      description: "Entregamos rápido e sempre quentinha"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={isClosing ? { opacity: 0, scale: 0.98 } : { opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-xs sm:max-w-sm bg-white rounded-xl overflow-hidden shadow-xl"
      >
        {/* Botão Fechar */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white hover:bg-gray-100 transition-all shadow-sm border border-gray-200"
        >
          <X size={16} className="text-gray-600" />
        </button>

        {/* Seção da Pizza */}
        <PizzaDisplay />

        {/* Conteúdo */}
        <div className="p-4 sm:p-5">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl sm:text-2xl font-bold text-center text-gray-900 mb-1"
          >
            <span className="text-red-600">Calabresa</span> com <span className="text-amber-600">Catupiry</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-center text-xs sm:text-sm text-gray-500 mb-4"
          >
            A combinação perfeita de sabores tradicionais
          </motion.p>

          {/* Opções */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-2 mb-4 sm:mb-5"
          >
            {options.map((option, index) => (
              <OptionCard key={index} {...option} delay={index} />
            ))}
          </motion.div>

          {/* Botões */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-2"
          >
            <button
              onClick={handleJoin}
              className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-red-600 to-amber-600 rounded-lg text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center"
            >
              <Gift size={18} className="mr-2" />
              Experimente Agora
            </button>

            <button
              onClick={handleClose}
              className="w-full py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm sm:text-base hover:bg-gray-50 transition-colors"
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