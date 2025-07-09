import React, { useState } from 'react';
import { X, Storefront, Pizza, Bicycle, Gift } from 'phosphor-react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AnimatedPizza = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);
  const scale = useTransform(x, [-100, 100], [0.95, 1.05]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        width: '120px',
        height: '120px',
        position: 'relative',
        margin: '0 auto',
        rotateX,
        rotateY,
        scale
      }}
    >
      {/* Base da pizza */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-300 to-amber-400 shadow-lg border-8 border-amber-200"></div>
      
      {/* Queijo derretido */}
      <div className="absolute inset-2 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 opacity-90"></div>
      
      {/* Calabresa - fatias animadas */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.5 + i * 0.1, type: 'spring' }}
          className="absolute rounded-full bg-gradient-to-br from-red-700 to-red-800 shadow-sm"
          style={{
            width: '20px',
            height: '20px',
            top: `${50 + 35 * Math.sin((i * 45) * (Math.PI / 180))}%`,
            left: `${50 + 35 * Math.cos((i * 45) * (Math.PI / 180))}%`,
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}
      
      {/* Catupiry central com efeito 3D */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.2, type: 'spring' }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white bg-opacity-90 flex items-center justify-center shadow-inner"
      >
        <div className="w-14 h-14 rounded-full bg-amber-50 bg-opacity-80 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="text-amber-600 text-xs font-bold absolute"
            style={{ width: '100%', textAlign: 'center' }}
          >
            Catupiry
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const PremiumLoyaltyModal = ({ onClose }) => {
  const navigate = useNavigate();
  const [hoveredOption, setHoveredOption] = useState(null);

  const handleJoin = () => {
    onClose();
    navigate('/fidelidade');
  };

  const consumptionOptions = [
    {
      id: 1,
      title: "Comer no Restaurante",
      description: "Viva a experiência completa em nosso ambiente",
      icon: <Storefront size={36} className="text-amber-500" />,
      color: "bg-amber-50",
      highlight: "from-amber-100 to-amber-50"
    },
    {
      id: 2,
      title: "Take Away",
      description: "Leve nosso sabor autêntico para qualquer lugar",
      icon: <Pizza size={36} className="text-red-500" />,
      color: "bg-red-50",
      highlight: "from-red-100 to-red-50"
    },
    {
      id: 3,
      title: "Delivery",
      description: "Entregamos quentinha na sua casa",
      icon: <Bicycle size={36} className="text-green-500" />,
      color: "bg-green-50",
      highlight: "from-green-100 to-green-50"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="relative w-full max-w-md mx-4 bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100"
      >
        {/* Botão Fechar */}
        <motion.button
          whileHover={{ rotate: 90, scale: 1.1 }}
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white hover:bg-gray-100 transition-all shadow-md border border-gray-200"
          aria-label="Fechar modal"
        >
          <X size={16} weight="bold" className="text-gray-600" />
        </motion.button>

        {/* Cabeçalho Elegante */}
        <div className="relative pt-10 pb-4 px-5 sm:px-6 text-center">
          <motion.h1
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 leading-tight"
          >
            Prove a <span className="text-red-600">#1 da Casa</span>
          </motion.h1>

          <motion.p 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xs sm:text-sm text-gray-600 max-w-xs mx-auto mb-3 leading-snug"
          >
            Calabresa com Catupiry. Simplesmente a mais pedida.
          </motion.p>

          <div className="relative h-28 -mt-2 mb-0 flex justify-center">
            <AnimatedPizza />
          </div>
        </div>

        {/* Opções de Consumo */}
        <div className="px-5 sm:px-6 pb-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 gap-3 mb-6"
          >
            {consumptionOptions.map((option) => (
              <motion.div
                key={option.id}
                whileHover={{ y: -3 }}
                onHoverStart={() => setHoveredOption(option.id)}
                onHoverEnd={() => setHoveredOption(null)}
                className={`relative p-4 ${option.color} rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden group`}
              >
                <AnimatePresence>
                  {hoveredOption === option.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`absolute inset-0 bg-gradient-to-br ${option.highlight}`}
                    />
                  )}
                </AnimatePresence>
                
                <div className="relative flex flex-col items-center text-center h-full">
                  <motion.div 
                    animate={{ 
                      y: hoveredOption === option.id ? -3 : 0,
                      scale: hoveredOption === option.id ? 1.1 : 1
                    }}
                    className="mb-3 transition-all"
                  >
                    {option.icon}
                  </motion.div>
                  <h3 className="text-base font-semibold text-gray-800 mb-1 leading-tight">{option.title}</h3>
                  <p className="text-xs text-gray-500 flex-grow leading-snug">{option.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Botões de Ação */}
          <div className="space-y-3">
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleJoin}
              className="w-full py-3 sm:py-4 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl text-white font-bold flex items-center justify-center shadow-lg hover:shadow-xl transition-all group"
            >
              <Gift size={18} weight="fill" className="mr-2 text-amber-100 group-hover:text-white transition-colors" />
              <span className="text-sm sm:text-base group-hover:scale-105 transition-transform">Quero experimentar</span>
            </motion.button>

            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="w-full py-2.5 sm:py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-all text-sm sm:text-base"
            >
              Continuar sem cadastro
            </motion.button>
          </div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-[10px] sm:text-xs text-center text-gray-400 mt-4 leading-tight"
          >
            Ao continuar, você concorda com nossos{' '}
            <a href="/termos" className="text-amber-600 hover:underline font-medium">Termos</a> e{' '}
            <a href="/politica" className="text-amber-600 hover:underline font-medium">Política</a>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default PremiumLoyaltyModal;