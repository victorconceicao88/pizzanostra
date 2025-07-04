import React, { useState } from 'react';
import { X, Storefront, Pizza, Bicycle, Gift } from 'phosphor-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const PremiumLoyaltyModal = ({ onClose }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('options');

  const handleJoin = () => {
    onClose();
    navigate('/fidelidade');
  };

  const consumptionOptions = [
    {
      id: 1,
      title: "Comer no Restaurante",
      description: "Sente o ambiente italiano autêntico",
      icon: <Storefront size={36} className="text-amber-500" />,
      color: "bg-amber-50"
    },
    {
      id: 2,
      title: "Take Away",
      description: "Leva contigo o sabor da casa",
      icon: <Pizza size={36} className="text-red-500" />,
      color: "bg-red-50"
    },
    {
      id: 3,
      title: "Em Tua Casa",
      description: "Entrega rápida e quentinha",
      icon: <Bicycle size={36} className="text-green-500" />,
      color: "bg-green-50"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="relative w-full max-w-xl bg-white rounded-3xl overflow-hidden shadow-2xl"
      >
        {/* Botão Fechar */}
        <motion.button
          whileHover={{ rotate: 90 }}
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white hover:bg-gray-100 transition-all shadow-sm border border-gray-200"
          aria-label="Fechar modal"
        >
          <X size={18} weight="bold" className="text-gray-600" />
        </motion.button>

        {/* Cabeçalho */}
        <div className="pt-10 pb-6 px-6 sm:px-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
            Como Queres a Tua Pizza?
          </h1>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            Escolhe como queres saborear a tua pizza favorita. Cada opção acumula pontos no nosso programa de fidelidade!
          </p>
        </div>

        {/* Opções */}
        <div className="px-6 sm:px-8 pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {consumptionOptions.map((option) => (
              <motion.div
                key={option.id}
                whileHover={{ y: -2, scale: 1.02 }}
                className={`p-4 ${option.color} rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-3">{option.icon}</div>
                  <h3 className="text-base font-semibold text-gray-800 mb-1">{option.title}</h3>
                  <p className="text-xs text-gray-500">{option.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Botões de Ação */}
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleJoin}
              className="w-full py-3 bg-white border-[3px] border-[#02803c] rounded-xl text-black font-bold flex items-center justify-center shadow-md hover:shadow-lg transition-all"
            >
              <Gift size={20} weight="fill" className="mr-2 text-[#02803c]" />
              Entrar no Programa
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="w-full py-3 bg-white border-[3px] border-[#02803c] rounded-xl text-black font-bold hover:bg-gray-50 transition-all"
            >
              Continuar sem cadastro
            </motion.button>
          </div>

          <p className="text-xs text-center text-gray-400 mt-5">
            Ao entrar, você concorda com nossos{' '}
            <a href="/termos" className="text-red-600 hover:underline">Termos</a> e{' '}
            <a href="/politica" className="text-red-600 hover:underline">Política</a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default PremiumLoyaltyModal;
