import React, { useState, useEffect } from 'react';
import { X, Storefront, Pizza, Bicycle, Gift, Crown, Star, Check } from 'phosphor-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const PizzaHero = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="relative w-full h-48 sm:h-56 md:h-64 bg-gradient-to-br from-[#016730] to-[#016730]/90 flex items-center justify-center overflow-hidden">
      {/* Efeito de textura */}
      <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PHBhdGggZD0iTTMwIDE1TDE1IDMwTDMwIDQ1TDQ1IDMwTDMwIDE1WiIgc3Ryb2tlPSIjMDE2NzMwIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiLz48L3N2Zz4=')]"></div>
      
      {/* Pizza */}
      <div className={`relative ${isMobile ? 'w-36 h-36' : 'w-44 h-44'}`}>
        {/* Sombra */}
        <div className="absolute inset-0 rounded-full bg-black/20 blur-md"></div>
        
        {/* Massa */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-300 to-amber-400 shadow-lg border-[6px] border-amber-200"
        >
          {/* Queijo */}
          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-amber-100 to-amber-50"></div>
          
          {/* Centro */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${isMobile ? 'w-20 h-20' : 'w-24 h-24'} rounded-full bg-white/95 flex items-center justify-center shadow-inner border border-amber-100`}>
            <div className={`${isMobile ? 'w-16 h-16' : 'w-20 h-20'} rounded-full bg-amber-50 flex items-center justify-center`}>
              <span className={`${isMobile ? 'text-[10px]' : 'text-xs'} font-bold text-amber-700`}>CATUPIRY</span>
            </div>
          </div>
          
          {/* Pepperonis */}
          {[...Array(isMobile ? 8 : 10)].map((_, i) => {
            const angle = (i * (360 / (isMobile ? 8 : 10))) * (Math.PI / 180);
            const distance = isMobile ? 28 : 32;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * i, type: 'spring' }}
                className="absolute w-3 h-3 rounded-full bg-[#991b1b] border border-[#7f1d1d]"
                style={{
                  top: `${50 + distance * Math.sin(angle)}%`,
                  left: `${50 + distance * Math.cos(angle)}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              />
            );
          })}
        </motion.div>
      </div>

      {/* Selo */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-4 left-0 right-0 flex justify-center"
      >
        <div className="flex items-center bg-gradient-to-r from-[#016730] to-[#016730]/90 text-white px-3 py-1 rounded-full text-xs font-bold shadow">
          <Star size={12} weight="fill" className="text-amber-300 mr-1" />
          MAIS PEDIDA
        </div>
      </motion.div>
    </div>
  );
};

const ServiceOption = ({ icon, title, active, onClick }) => {
  return (
    <motion.button
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex flex-col items-center p-3 rounded-xl transition-all ${active ? 'bg-white shadow-md border border-gray-100' : 'bg-gray-50'}`}
    >
      <div className={`p-2 rounded-lg mb-2 ${active ? 'bg-[#016730]/10 text-[#016730]' : 'bg-gray-200 text-gray-600'}`}>
        {icon}
      </div>
      <span className={`text-xs font-medium ${active ? 'text-[#016730]' : 'text-gray-600'}`}>{title}</span>
    </motion.button>
  );
};

const WelcomeModal = ({ onClose }) => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [selectedService, setSelectedService] = useState('delivery');

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleJoin = () => {
    navigate('/fidelidade');
    onClose();
  };

  const services = [
    { id: 'restaurant', icon: <Storefront size={20} />, title: 'No Local' },
    { id: 'takeaway', icon: <Pizza size={20} />, title: 'Takeaway' },
    { id: 'delivery', icon: <Bicycle size={20} />, title: 'Delivery' }
  ];

  const serviceDetails = {
    restaurant: 'Ambiente premium com atmosfera italiana',
    takeaway: 'Embalagem especial que mantém o sabor',
    delivery: 'Entrega rápida diretamente na sua casa'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-sm bg-white rounded-2xl overflow-hidden shadow-xl"
      >
        {/* Botão fechar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-white shadow border border-gray-200 z-10"
        >
          <X size={18} className="text-gray-600" />
        </button>

        {/* Pizza */}
        <PizzaHero />

        {/* Conteúdo */}
        <div className="p-4 sm:p-5">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl sm:text-2xl font-bold text-center mb-2"
          >
            <span className="text-[#CE2B37]">Calabresa</span> com <span className="text-amber-600">Catupiry</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xs sm:text-sm text-gray-500 text-center mb-4"
          >
            Massa artesanal, calabresa premium e catupiry cremoso
          </motion.p>

          {/* Opções de serviço */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-3 gap-2 mb-4"
          >
            {services.map((service) => (
              <ServiceOption
                key={service.id}
                icon={service.icon}
                title={service.title}
                active={selectedService === service.id}
                onClick={() => setSelectedService(service.id)}
              />
            ))}
          </motion.div>

          {/* Detalhe do serviço */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-start bg-gray-50 rounded-lg p-3 mb-4"
          >
            <Check size={16} className="text-[#016730] mt-0.5 mr-2 flex-shrink-0" />
            <span className="text-xs sm:text-sm text-gray-600">{serviceDetails[selectedService]}</span>
          </motion.div>

          {/* Botões */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col gap-2"
          >
            <button
              onClick={handleJoin}
              className="w-full py-3 bg-gradient-to-r from-[#016730] to-[#016730]/90 text-white rounded-lg font-bold flex items-center justify-center gap-2 shadow-md"
            >
              <Gift size={18} weight="fill" className="text-amber-300" />
              <span>Ganhe Recompensas</span>
            </button>

            <button
              onClick={onClose}
              className="w-full py-3 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Continuar
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default WelcomeModal;