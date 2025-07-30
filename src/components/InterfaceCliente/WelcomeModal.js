import React, { useState, useEffect, useRef } from 'react';
import { X, Storefront, Pizza, Bicycle, Gift, Flame, Crown, Medal, Star, Plus, Check, Leaf } from 'phosphor-react';
import { motion, useAnimation, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ParticleBackground = () => {
  const particles = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 2,
    duration: Math.random() * 3 + 2
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ opacity: 0, y: -10 }}
          animate={{
            opacity: [0, 0.6, 0],
            y: [0, 100],
            x: [particle.x, particle.x + (Math.random() * 20 - 10)]
          }}
          transition={{
            delay: particle.delay,
            duration: particle.duration,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'linear'
          }}
          style={{
            position: 'absolute',
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: '#CE2B37',
            borderRadius: '50%',
            filter: 'blur(1px)'
          }}
        />
      ))}
    </div>
  );
};

const PopularBadge = ({ isMobile }) => {
  return (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.5, type: 'spring' }}
      className="absolute bottom-4 xs:bottom-6 left-0 right-0 flex justify-center px-2"
    >
      <div className="relative">
        <div className={`flex items-center bg-gradient-to-r from-[#016730] to-[#016730]/90 text-white ${isMobile ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'} rounded-full shadow-lg font-bold tracking-wide border border-white/20 whitespace-nowrap overflow-hidden`}>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9IiMwMTY3MzAiLz48cGF0aCBkPSJNMzAgMTVMMTUgMzBMMzAgNDVMNDUgMzBMMzAgMTVaIiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMC41IiBzdHJva2Utb3BhY2l0eT0iMC4yIi8+PC9zdmc+')] opacity-10"></div>
          {!isMobile && <Crown size={16} className="mr-1 xs:mr-2 text-amber-300" weight="fill" />}
          <Medal size={16} className={`${isMobile ? 'mr-1' : 'mr-2'} text-amber-300`} weight="fill" />
          <span className="truncate">A MAIS PEDIDA DA PIZZA NOSTRA</span>
          {!isMobile && <Medal size={16} className="ml-2 text-amber-300" weight="fill" />}
        </div>
        <div className="absolute -top-1 -right-1">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            style={{ originX: 0.5, originY: 0.5 }}
          >
            <Star size={14} className="text-amber-300" weight="fill" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const PizzaDisplay = ({ mouseX, mouseY, isMobile }) => {
  const pizzaRef = useRef(null);
  const [pizzaBounds, setPizzaBounds] = useState({ left: 0, top: 0, width: 0, height: 0 });
  
  useEffect(() => {
    if (pizzaRef.current) {
      const rect = pizzaRef.current.getBoundingClientRect();
      setPizzaBounds({
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height
      });
    }
  }, []);

  const calculateTilt = (mousePos, bounds, maxTilt) => {
    if (!mousePos || !bounds.width) return 0;
    
    const centerX = bounds.left + bounds.width / 2;
    const centerY = bounds.top + bounds.height / 2;
    
    const relativeX = mousePos.x - centerX;
    const relativeY = mousePos.y - centerY;
    
    const tiltX = (relativeY / centerY) * maxTilt;
    const tiltY = -(relativeX / centerX) * maxTilt;
    
    return { x: tiltX, y: tiltY };
  };

  const tilt = calculateTilt({ x: mouseX, y: mouseY }, pizzaBounds, 15);

  return (
    <div className="relative w-full h-56 xs:h-64 sm:h-72 md:h-80 bg-gradient-to-br from-[#016730] to-[#016730]/90 flex items-center justify-center overflow-hidden rounded-t-2xl">
      <ParticleBackground />
      
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9IiMwMTY3MzAiLz48cGF0aCBkPSJNMzAgMTVMMTUgMzBMMzAgNDVMNDUgMzBMMzAgMTVaIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMTY3MzAiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] opacity-10"></div>
      
      <div className="absolute bottom-0 left-0 right-0 h-1.5 xs:h-2 flex">
        <div className="w-1/3 h-full bg-[#016730]"></div>
        <div className="w-1/3 h-full bg-white"></div>
        <div className="w-1/3 h-full bg-[#CE2B37]"></div>
      </div>

      <div 
        ref={pizzaRef}
        className={`relative ${isMobile ? 'w-40 h-40 xs:w-44 xs:h-44' : 'w-48 h-48 sm:w-52 sm:h-52 md:w-56 md:h-56'}`}
      >
        <motion.div 
          className="absolute inset-0 rounded-full bg-black/20 blur-md"
          style={{
            rotateX: tilt.x,
            rotateY: tilt.y,
            transition: 'transform 0.1s ease-out'
          }}
        />
        
        <motion.div 
          className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-300 to-amber-400 shadow-xl border-[6px] xs:border-[8px] border-amber-200/80"
          style={{
            rotateX: tilt.x,
            rotateY: tilt.y,
            transition: 'transform 0.1s ease-out'
          }}
        >
          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-amber-100 to-amber-50 opacity-90"></div>
          
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${isMobile ? 'w-20 h-20 xs:w-24 xs:h-24' : 'w-28 h-28'} rounded-full bg-white/95 flex items-center justify-center shadow-inner border border-amber-100`}>
            <div className={`${isMobile ? 'w-16 h-16 xs:w-20 xs:h-20' : 'w-24 h-24'} rounded-full bg-amber-50 flex items-center justify-center border border-amber-200/50`}>
              <motion.span 
                className={`${isMobile ? 'text-[10px] xs:text-xs' : 'text-sm'} font-bold text-amber-700 tracking-widest`}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                CATUPIRY
              </motion.span>
            </div>
          </div>
          
          {[...Array(isMobile ? 10 : 12)].map((_, i) => {
            const angle = (i * (360 / (isMobile ? 10 : 12))) * (Math.PI / 180);
            const distance = isMobile ? 30 : 36;
            const size = isMobile ? 12 : 14 + (i % 2) * 2;

            return (
              <motion.div
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
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [45, 50, 45]
                }}
                transition={{
                  delay: i * 0.05,
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'reverse'
                }}
              />
            );
          })}

          {[...Array(8)].map((_, i) => {
            const angle = (i * (360 / 8)) * (Math.PI / 180);
            const distance = isMobile ? 42 : 48;
            
            return (
              <motion.div
                key={`herb-${i}`}
                className="absolute"
                style={{
                  top: `${50 + distance * Math.sin(angle)}%`,
                  left: `${50 + distance * Math.cos(angle)}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                animate={{ 
                  rotate: [0, 5, 0],
                  y: [0, -2, 0]
                }}
                transition={{
                  delay: i * 0.1,
                  duration: 3,
                  repeat: Infinity,
                  repeatType: 'reverse'
                }}
              >
                <Leaf 
                  size={isMobile ? 12 : 14} 
                  className="text-[#016730]/70" 
                  weight="fill" 
                />
              </motion.div>
            );
          })}
        </motion.div>
        
        <motion.div 
          className="absolute top-1/4 left-1/4 w-20 h-20 xs:w-24 xs:h-24 rounded-full bg-amber-200/30 blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      </div>

      <PopularBadge isMobile={isMobile} />
    </div>
  );
};

const OptionCard = ({ icon, title, description, delay, isMobile, isSelected, onClick }) => {
  const controls = useAnimation();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + delay * 0.1, type: 'spring', stiffness: 300 }}
      whileHover={!isMobile ? { y: -5, scale: 1.02 } : {}}
      whileTap={isMobile ? { scale: 0.98 } : {}}
      className={`p-3 xs:p-4 rounded-xl border ${isSelected ? 'border-[#016730] bg-[#016730]/5' : 'border-gray-100 bg-white'} shadow-sm hover:shadow-md transition-all group relative overflow-hidden cursor-pointer`}
      onHoverStart={() => !isMobile && controls.start({ scale: 1.05 })}
      onHoverEnd={() => !isMobile && controls.start({ scale: 1 })}
      onClick={onClick}
    >
      <div className="flex items-start gap-2 xs:gap-3 relative z-10">
        <motion.div 
          animate={controls}
          className={`${isMobile ? 'p-1.5' : 'p-2.5'} rounded-lg ${isSelected ? 'bg-gradient-to-br from-[#016730]/20 to-[#CE2B37]/20' : 'bg-gradient-to-br from-[#016730]/10 to-[#CE2B37]/10'} group-hover:from-[#016730]/20 group-hover:to-[#CE2B37]/20 transition-all relative`}
        >
          {icon}
          {isSelected && (
            <motion.div 
              className="absolute -top-1 -right-1 bg-[#016730] rounded-full p-0.5"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
            >
              <Check size={12} className="text-white" weight="bold" />
            </motion.div>
          )}
        </motion.div>
        <div>
          <h3 className={`${isMobile ? 'text-xs xs:text-sm' : 'text-sm'} font-semibold ${isSelected ? 'text-[#016730]' : 'text-gray-800'} group-hover:text-[#016730] transition-colors`}>{title}</h3>
          <p className={`${isMobile ? 'text-[10px] xs:text-xs' : 'text-xs'} ${isSelected ? 'text-gray-600' : 'text-gray-500'} mt-0.5 xs:mt-1 leading-snug group-hover:text-gray-600 transition-colors`}>{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

const WelcomeModal = ({ onClose }) => {
  const navigate = useNavigate();
  const [isClosing, setIsClosing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const modalRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleMouseMove = (e) => {
      if (modalRef.current) {
        const rect = modalRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    if (!isMobile) {
      modalRef.current.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
      if (modalRef.current) {
        modalRef.current.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [isMobile]);

  const handleJoin = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      navigate('/fidelidade');
    }, 300);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  };

  const options = [
    {
      id: 'dine-in',
      icon: <Storefront size={isMobile ? 18 : 20} className="text-[#016730]" weight="duotone" />,
      title: 'Comer no Local',
      description: 'Ambiente aconchegante com atmosfera italiana autêntica'
    },
    {
      id: 'takeaway',
      icon: <Pizza size={isMobile ? 18 : 20} className="text-[#CE2B37]" weight="duotone" />,
      title: 'Para Viagem',
      description: 'Embalagem especial que preserva o sabor artesanal'
    },
    {
      id: 'delivery',
      icon: <Bicycle size={isMobile ? 18 : 20} className="text-amber-600" weight="duotone" />,
      title: 'Entrega Rápida',
      description: 'Entregamos quentinha na sua porta'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 xs:p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={isClosing ? { opacity: 0, scale: 0.98 } : { opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-xs xs:max-w-sm sm:max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl border border-gray-200/80"
      >
        <motion.button
          onClick={handleClose}
          className={`absolute ${isMobile ? 'top-2 right-2 p-1.5' : 'top-3 right-3 p-2'} rounded-full bg-white hover:bg-gray-100 transition-all shadow-lg border border-gray-200 hover:border-[#CE2B37] group z-50`}
          whileHover={{ rotate: 90 }}
          whileTap={{ scale: 0.9 }}
        >
          <X size={isMobile ? 16 : 18} className="text-gray-600 group-hover:text-[#CE2B37] transition-colors" weight="bold" />
        </motion.button>

        <PizzaDisplay mouseX={mousePosition.x} mouseY={mousePosition.y} isMobile={isMobile} />

        <div className={`${isMobile ? 'p-3 xs:p-4' : 'p-5 sm:p-6'} flex flex-col gap-y-3 xs:gap-y-4 sm:gap-y-5`}>          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-center"
          >
            <h2 className={`${isMobile ? 'text-lg xs:text-xl' : 'text-2xl'} font-bold text-[#016730] mb-2`}>Calabresa com Catupiry</h2>
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className={`${isMobile ? 'px-2 text-xs' : 'px-3 text-sm'} bg-white text-gray-500 font-medium`}>
                  A COMBINAÇÃO PERFEITA
                </span>
              </div>
            </div>
            <p className={`${isMobile ? 'text-xs xs:text-sm' : 'text-sm'} text-gray-600 mt-3 leading-relaxed`}>
              O equilíbrio perfeito entre o sabor marcante da calabresa e a cremosidade do autêntico catupiry.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col gap-y-2 xs:gap-y-3"
          >
            {options.map((option, index) => (
              <OptionCard 
                key={option.id}
                icon={option.icon}
                title={option.title}
                description={option.description}
                delay={index}
                isMobile={isMobile}
                isSelected={selectedOption === option.id}
                onClick={() => setSelectedOption(option.id)}
              />
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
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  transition: { duration: 1, repeat: Infinity }
                }}
              >
                <Gift size={isMobile ? 18 : 22} weight="fill" className="text-amber-300" />
              </motion.div>
              <span>{isMobile ? 'Recompensas Exclusivas' : 'Ganhe Recompensas Exclusivas'}</span>
              <motion.div
                className="absolute -right-2 -top-2"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity
                }}
              >
                <Flame size={16} className="text-amber-400" weight="fill" />
              </motion.div>
            </button>

            <button
              onClick={handleClose}
              className={`w-full ${isMobile ? 'min-h-12 text-sm' : 'min-h-14 text-lg'} font-medium bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-[#016730] transition-colors hover:text-[#016730]`}
              whileHover={{ 
                scale: 1.01,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
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