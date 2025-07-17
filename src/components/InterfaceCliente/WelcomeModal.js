import React, { useState } from 'react';
import { X, Storefront, Pizza, Bicycle, Gift, Flame } from 'phosphor-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const PizzaDisplay = () => {
  return (
    <div className="relative w-full h-52 sm:h-60 bg-gradient-to-br from-red-900 to-red-800 flex items-center justify-center overflow-hidden rounded-t-2xl">
      <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmZmYiIG9wYWNpdHk9IjAuMDUiPjwvcmVjdD48L3N2Zz4=')]"></div>

      <div className="relative w-36 h-36 sm:w-44 sm:h-44">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-300 to-amber-400 shadow-lg border-[6px] border-amber-200">
          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-amber-100 to-amber-50 opacity-90"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white bg-opacity-90 flex items-center justify-center shadow-inner">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-50 flex items-center justify-center">
              <span className="text-xs sm:text-sm font-bold text-amber-700 tracking-wider">CATUPIRY</span>
            </div>
          </div>
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
                  background: 'linear-gradient(135deg, #7f1d1d, #991b1b)',
                }}
              />
            );
          })}
        </div>
        <div className="absolute top-1/4 left-1/4 w-20 h-20 rounded-full bg-amber-200 opacity-20 blur-lg"></div>
      </div>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <div className="flex items-center bg-red-600 text-white px-4 py-1.5 rounded-full shadow-md text-xs sm:text-sm font-semibold">
          <Flame size={16} className="mr-1 text-amber-300" />
          A MAIS PEDIDA
        </div>
      </div>
    </div>
  );
};

const OptionCard = ({ icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 + delay * 0.1 }}
    whileHover={{ y: -3 }}
    className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
  >
    <div className="flex items-start gap-3">
      <div className="p-2 rounded-md bg-gradient-to-br from-red-50 to-amber-50">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        <p className="text-xs text-gray-500 mt-0.5 leading-snug">{description}</p>
      </div>
    </div>
  </motion.div>
);

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
      title: 'Comer no Local',
      description: 'Ambiente climatizado e premium',
    },
    {
      icon: <Pizza size={20} className="text-red-500" />,
      title: 'Para Viagem',
      description: 'Embalagem especial que mantém o sabor',
    },
    {
      icon: <Bicycle size={20} className="text-green-500" />,
      title: 'Delivery',
      description: 'Entregamos rápido e sempre quentinha',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={isClosing ? { opacity: 0, scale: 0.98 } : { opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 22, stiffness: 280 }}
        className="relative w-full max-w-md sm:max-w-sm bg-white rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Botão Fechar */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white hover:bg-gray-100 transition-all shadow border border-gray-200"
        >
          <X size={18} className="text-gray-600" />
        </button>

        <PizzaDisplay />

        <div className="p-5 sm:p-6 flex flex-col gap-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center text-xl sm:text-2xl font-bold tracking-tight text-gray-900"
          >
            <span className="text-red-600">Calabresa</span> com <span className="text-amber-600">Catupiry</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-center text-sm text-gray-500 leading-relaxed text-pretty"
          >
            A combinação perfeita de sabores tradicionais.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col gap-y-2"
          >
            {options.map((option, index) => (
              <OptionCard key={index} {...option} delay={index} />
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col gap-y-3 mt-2"
          >
            <button
              onClick={handleJoin}
              className="w-full min-h-12 text-base sm:text-lg font-semibold bg-gradient-to-r from-red-600 to-amber-600 text-white rounded-xl flex items-center justify-center gap-x-2 shadow-md hover:shadow-lg transition-all"
            >
              <Gift size={20} />
              Ganhe Recompensas Agora
            </button>

            <button
              onClick={handleClose}
              className="w-full min-h-12 text-base sm:text-lg font-medium bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
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
