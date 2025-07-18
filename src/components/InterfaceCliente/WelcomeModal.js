import React, { useState, useEffect } from 'react';
import { X, Storefront, Pizza, Bicycle, Gift, Flame, Crown, Medal } from 'phosphor-react';
import { motion, useAnimation } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const PizzaDisplay = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="relative w-full h-56 xs:h-64 sm:h-72 md:h-80 bg-gradient-to-br from-[#016730] to-[#016730]/90 flex items-center justify-center overflow-hidden rounded-t-2xl">
      {/* Premium texture overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9IiMwMTY3MzAiLz48cGF0aCBkPSJNMzAgMTVMMTUgMzBMMzAgNDVMNDUgMzBMMzAgMTVaIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMTY3MzAiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] opacity-10"></div>
      
      {/* Italian flag accent - responsive */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 xs:h-2 flex">
        <div className="w-1/3 h-full bg-[#016730]"></div>
        <div className="w-1/3 h-full bg-white"></div>
        <div className="w-1/3 h-full bg-[#CE2B37]"></div>
      </div>

      {/* Responsive pizza container */}
      <div className={`relative ${isMobile ? 'w-40 h-40 xs:w-44 xs:h-44' : 'w-48 h-48 sm:w-52 sm:h-52 md:w-56 md:h-56'}`}>
        {/* Premium pizza shadow */}
        <div className="absolute inset-0 rounded-full bg-black/20 blur-md"></div>
        
        {/* Main pizza - responsive */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-300 to-amber-400 shadow-xl border-[6px] xs:border-[8px] border-amber-200/80">
          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-amber-100 to-amber-50 opacity-90"></div>
          
          {/* Cheese center - responsive */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${isMobile ? 'w-20 h-20 xs:w-24 xs:h-24' : 'w-28 h-28'} rounded-full bg-white/95 flex items-center justify-center shadow-inner border border-amber-100`}>
            <div className={`${isMobile ? 'w-16 h-16 xs:w-20 xs:h-20' : 'w-24 h-24'} rounded-full bg-amber-50 flex items-center justify-center border border-amber-200/50`}>
              <span className={`${isMobile ? 'text-[10px] xs:text-xs' : 'text-sm'} font-bold text-amber-700 tracking-widest`}>CATUPIRY</span>
            </div>
          </div>
          
          {/* Pepperoni slices - responsive count */}
          {[...Array(isMobile ? 10 : 12)].map((_, i) => {
            const angle = (i * (360 / (isMobile ? 10 : 12))) * (Math.PI / 180);
            const distance = isMobile ? 30 : 36;
            const size = isMobile ? 12 : 14 + (i % 2) * 2;

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
                  border: '1px solid #7f1d1d'
                }}
              />
            );
          })}
        </div>
        
        {/* Glow effect */}
        <div className="absolute top-1/4 left-1/4 w-20 h-20 xs:w-24 xs:h-24 rounded-full bg-amber-200/30 blur-xl"></div>
      </div>

      {/* Premium badge - responsive */}
      <div className="absolute bottom-4 xs:bottom-6 left-0 right-0 flex justify-center px-2">
        <div className={`flex items-center bg-gradient-to-r from-[#016730] to-[#016730]/90 text-white ${isMobile ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'} rounded-full shadow-lg font-bold tracking-wide border border-white/20 whitespace-nowrap`}>
          {!isMobile && <Crown size={16} className="mr-1 xs:mr-2 text-amber-300" weight="fill" />}
          <Medal size={16} className={`${isMobile ? 'mr-1' : 'mr-2'} text-amber-300`} weight="fill" />
          <span className="truncate">A MAIS PEDIDA DA PIZZA NOSTRA</span>
          {!isMobile && <Medal size={16} className="ml-2 text-amber-300" weight="fill" />}
        </div>
      </div>
    </div>
  );
};

const OptionCard = ({ icon, title, description, delay, isMobile }) => {
  const controls = useAnimation();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + delay * 0.1, type: 'spring', stiffness: 300 }}
      whileHover={!isMobile ? { y: -5, scale: 1.02 } : {}}
      whileTap={isMobile ? { scale: 0.98 } : {}}
      className="p-3 xs:p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
      onHoverStart={() => !isMobile && controls.start({ scale: 1.05 })}
      onHoverEnd={() => !isMobile && controls.start({ scale: 1 })}
    >
      {/* Premium hover effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#016730]/5 to-[#CE2B37]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="flex items-start gap-2 xs:gap-3 relative z-10">
        <motion.div 
          animate={controls}
          className={`${isMobile ? 'p-1.5' : 'p-2.5'} rounded-lg bg-gradient-to-br from-[#016730]/10 to-[#CE2B37]/10 group-hover:from-[#016730]/20 group-hover:to-[#CE2B37]/20 transition-all`}
        >
          {icon}
        </motion.div>
        <div>
          <h3 className={`${isMobile ? 'text-xs xs:text-sm' : 'text-sm'} font-semibold text-gray-800 group-hover:text-[#016730] transition-colors`}>{title}</h3>
          <p className={`${isMobile ? 'text-[10px] xs:text-xs' : 'text-xs'} text-gray-500 mt-0.5 xs:mt-1 leading-snug group-hover:text-gray-600 transition-colors`}>{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

const WelcomeModal = ({ onClose }) => {
  const navigate = useNavigate();
  const [isClosing, setIsClosing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
      icon: <Storefront size={isMobile ? 18 : 20} className="text-[#016730]" weight="duotone" />,
      title: 'Comer no Local',
      description: 'Ambiente premium com atmosfera italiana autêntica',
    },
    {
      icon: <Pizza size={isMobile ? 18 : 20} className="text-[#CE2B37]" weight="duotone" />,
      title: 'Para Viagem',
      description: 'Embalagem térmica que preserva o sabor artesanal',
    },
    {
      icon: <Bicycle size={isMobile ? 18 : 20} className="text-amber-600" weight="duotone" />,
      title: 'Delivery Premium',
      description: 'Entrega rápida em embalagem especial Pizza Nostra',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 xs:p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={isClosing ? { opacity: 0, scale: 0.98 } : { opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-xs xs:max-w-sm sm:max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl border border-gray-200/80"
      >
        {/* Premium close button - responsive */}
        <button
          onClick={handleClose}
          className={`absolute ${isMobile ? 'top-2 right-2 p-1.5' : 'top-3 right-3 p-2'} rounded-full bg-white hover:bg-gray-100 transition-all shadow-lg border border-gray-200 hover:border-[#CE2B37] group`}
        >
          <X size={isMobile ? 16 : 18} className="text-gray-600 group-hover:text-[#CE2B37] transition-colors" weight="bold" />
        </button>

        <PizzaDisplay />

        <div className={`${isMobile ? 'p-3 xs:p-4' : 'p-5 sm:p-6'} flex flex-col gap-y-3 xs:gap-y-4 sm:gap-y-5`}>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`text-center ${isMobile ? 'text-xl xs:text-2xl' : 'text-2xl sm:text-3xl'} font-bold tracking-tight text-gray-900`}
          >
            <span className="text-[#CE2B37]">Calabresa</span> com <span className="text-amber-600">Catupiry</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className={`text-center ${isMobile ? 'text-xs xs:text-sm' : 'text-sm'} text-gray-500 leading-relaxed max-w-md mx-auto`}
          >
            A obra-prima da Pizza Nostra. Massa artesanal, calabresa premium e nosso exclusivo catupiry cremoso.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col gap-y-2 xs:gap-y-3"
          >
            {options.map((option, index) => (
              <OptionCard key={index} {...option} delay={index} isMobile={isMobile} />
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col gap-y-2 xs:gap-y-3 mt-1 xs:mt-2 sm:mt-3"
          >
            <button
              onClick={handleJoin}
              className={`w-full ${isMobile ? 'min-h-12 text-sm' : 'min-h-14 text-lg'} font-bold bg-gradient-to-r from-[#016730] to-[#CE2B37] text-white rounded-xl flex items-center justify-center gap-x-2 xs:gap-x-3 shadow-lg hover:shadow-xl transition-all hover:from-[#016730]/95 hover:to-[#CE2B37]/95 relative overflow-hidden group`}
            >
              {/* Premium button effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity"></span>
              <Gift size={isMobile ? 18 : 22} weight="fill" className="text-amber-300" />
              <span>{isMobile ? 'Recompensas Exclusivas' : 'Ganhe Recompensas Exclusivas'}</span>
            </button>

            <button
              onClick={handleClose}
              className={`w-full ${isMobile ? 'min-h-12 text-sm' : 'min-h-14 text-lg'} font-medium bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-[#016730] transition-colors hover:text-[#016730]`}
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