import React from 'react';
import { X, Crown, Gift, Bread, Pizza } from 'phosphor-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import pizzaAnimation from './pizza-animation.json'; // Certifique-se de ter este arquivo

const ElitePizzaModal = ({ onClose }) => {
  const navigate = useNavigate();
  
  const handleAction = () => {
    onClose();
    navigate('/fidelidade');
  };

  // Bordas da bandeira italiana (verde, branco, vermelho)
  const ItalianFlagBorder = () => (
    <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
      <div className="absolute top-0 left-0 h-full w-2 bg-[#009246]"></div> {/* Verde */}
      <div className="absolute top-0 left-2 h-full w-2 bg-white"></div>       {/* Branco */}
      <div className="absolute top-0 left-4 h-full w-2 bg-[#CE2B37]"></div>   {/* Vermelho */}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative bg-white rounded-xl w-full max-w-md overflow-hidden shadow-2xl"
      >
        {/* Borda da bandeira italiana */}
        <ItalianFlagBorder />
        
        {/* Close button premium */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full bg-white/90 hover:bg-gray-100 transition-colors z-10 text-gray-500 shadow-sm border border-gray-200"
          aria-label="Fechar modal"
        >
          <X size={18} weight="bold" />
        </button>
        
        <div className="p-8 pt-12">
          {/* Pizza Animation Container */}
          <div className="flex justify-center mb-2">
            <div className="w-40 h-40 relative">
              <Lottie 
                animationData={pizzaAnimation} 
                loop={true}
                style={{ width: '100%', height: '100%' }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-amber-400/20 blur-md"></div>
              </div>
            </div>
          </div>

          {/* Logo com sombra sutil */}
          <h1 
            className="text-3xl font-bold text-center text-gray-900 tracking-tight italic mb-6 drop-shadow-sm"
            style={{ 
              fontFamily: "'Times New Roman', Times, serif",
              textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
            }}
          >
            Pizza Nostra
          </h1>
          
          {/* Program Benefits - Cards modernos */}
          <div className="space-y-3 mb-8">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex items-start bg-gradient-to-r from-gray-50 to-white rounded-lg p-3 border border-gray-100 shadow-sm"
            >
              <div className="bg-[#016730]/10 p-2 rounded-lg mr-3 flex-shrink-0 shadow-inner">
                <div className="w-6 h-6 bg-[#016730] rounded-full flex items-center justify-center text-white text-xs font-bold">
                  1
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800">1 selo a cada €15 gastos</h3>
                <p className="text-xs text-gray-500 mt-1">Acumule e desfrute</p>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex items-start bg-gradient-to-r from-gray-50 to-white rounded-lg p-3 border border-gray-100 shadow-sm"
            >
              <div className="bg-amber-100 p-2 rounded-lg mr-3 flex-shrink-0 shadow-inner">
                <Crown size={20} weight="fill" className="text-amber-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800">10 selos = Pizza Grátis</h3>
                <p className="text-xs text-gray-500 mt-1">Sabor tradicional ou premium</p>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex items-start bg-gradient-to-r from-gray-50 to-white rounded-lg p-3 border border-gray-100 shadow-sm"
            >
              <div className="bg-green-100 p-2 rounded-lg mr-3 flex-shrink-0 shadow-inner">
                <Pizza size={20} weight="fill" className="text-green-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800">5 selos = Pão de Alho</h3>
                <p className="text-xs text-gray-500 mt-1">Recheado com queijo especial</p>
              </div>
            </motion.div>
          </div>
          
          {/* CTA Button Premium */}
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAction}
              className="w-full py-3.5 bg-gradient-to-r from-[#016730] to-gray-900 rounded-lg text-white font-medium hover:from-[#02803c] hover:to-gray-800 transition-all flex items-center justify-center shadow-lg relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                <span className="group-hover:translate-x-1 transition-transform">
                  Entrar no Programa
                </span>
                <Gift size={18} weight="fill" className="ml-2 opacity-90" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#016730]/80 to-gray-900/80 opacity-0 hover:opacity-100 transition-opacity"></div>
            </motion.button>
            
            <button
              onClick={onClose}
              className="w-full text-center text-xs text-gray-400 hover:text-gray-600 transition-colors underline underline-offset-2 font-medium"
            >
              Continuar sem cadastro
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ElitePizzaModal;