import React, { useState, useEffect, useRef } from 'react';
import { X, Storefront, Pizza, Bicycle, Gift, Flame, Crown, Medal, Star, Check } from 'phosphor-react';
import { motion,useAnimation} from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ParticleBackground = () => {
  const particles = Array.from({ length: 15 }).map((_, i) => ({
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

const PopularBadge = () => {
  return (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.5, type: 'spring' }}
      className="absolute bottom-4 left-0 right-0 flex justify-center px-2"
    >
      <div className="relative">
        <div className="flex items-center bg-gradient-to-r from-[#016730] to-[#016730]/90 text-white px-3 py-1.5 text-xs sm:text-sm rounded-full shadow-lg font-bold tracking-wide border border-white/20 whitespace-nowrap">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9IiMwMTY3MzAiLz48cGF0aCBkPSJNMzAgMTVMMTUgMzBMMzAgNDVMNDUgMzBMMzAgMTVaIiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMC41IiBzdHJva2Utb3BhY2l0eT0iMC4yIi8+PC9zdmc+')] opacity-10"></div>
          <Medal size={14} className="mr-2 text-amber-300" weight="fill" />
          <span>A MAIS PEDIDA DA PIZZA NOSTRA</span>
          <Medal size={14} className="ml-2 text-amber-300" weight="fill" />
        </div>
        <div className="absolute -top-1 -right-1">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          >
            <Star size={12} className="text-amber-300" weight="fill" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const PizzaDisplay = () => {
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        // Ajuste dinâmico baseado na largura do container
        const height = Math.min(width * 0.6, window.innerHeight * 0.35);
        setContainerSize({ width, height });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full bg-gradient-to-br from-[#016730] to-[#016730]/90 flex items-center justify-center overflow-hidden rounded-t-2xl"
      style={{ height: `${containerSize.height}px` }}
    >
      <ParticleBackground />
      
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9IiMwMTY3MzAiLz48cGF0aCBkPSJNMzAgMTVMMTUgMzBMMzAgNDVMNDUgMzBMMzAgMTVaIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMTY3MzAiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] opacity-10"></div>
      
      <div className="absolute bottom-0 left-0 right-0 h-1.5 flex">
        <div className="w-1/3 h-full bg-[#016730]"></div>
        <div className="w-1/3 h-full bg-white"></div>
        <div className="w-1/3 h-full bg-[#CE2B37]"></div>
      </div>

      <div className="relative w-full h-full flex items-center justify-center p-4">
        <motion.img
          src="https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
          alt="Pizza Calabresa com Catupiry"
          className="w-full h-full object-cover"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        />
        
        <motion.div 
          className="absolute top-1/4 left-1/4 w-16 h-16 rounded-full bg-amber-200/30 blur-xl"
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

      <PopularBadge />
    </div>
  );
};

const OptionCard = ({ icon, title, description, delay, isSelected, onClick }) => {
  const controls = useAnimation();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + delay * 0.1, type: 'spring', stiffness: 300 }}
      whileHover={{ y: -3, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`p-3 sm:p-3 rounded-xl border ${isSelected ? 'border-[#016730] bg-[#016730]/5' : 'border-gray-100 bg-white'} shadow-sm hover:shadow-md transition-all group relative cursor-pointer`}
      onHoverStart={() => controls.start({ scale: 1.05 })}
      onHoverEnd={() => controls.start({ scale: 1 })}
      onClick={onClick}
    >
      <div className="flex items-start gap-3 relative z-10">
        <motion.div 
          animate={controls}
          className={`p-2 rounded-lg ${isSelected ? 'bg-gradient-to-br from-[#016730]/20 to-[#CE2B37]/20' : 'bg-gradient-to-br from-[#016730]/10 to-[#CE2B37]/10'} group-hover:from-[#016730]/20 group-hover:to-[#CE2B37]/20 transition-all relative`}
        >
          {React.cloneElement(icon, { size: 18 })}
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
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-semibold ${isSelected ? 'text-[#016730]' : 'text-gray-800'} group-hover:text-[#016730] transition-colors truncate`}>{title}</h3>
          <p className={`text-xs ${isSelected ? 'text-gray-600' : 'text-gray-500'} mt-1 leading-snug group-hover:text-gray-600 transition-colors`}>{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

const WelcomeModal = ({ onClose }) => {
  const navigate = useNavigate();
  const [isClosing, setIsClosing] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const modalRef = useRef(null);

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
      icon: <Storefront size={18} className="text-[#016730]" weight="duotone" />,
      title: 'Consumir no Local',
      description: 'Saboreie cada momento num ambiente acolhedor com o verdadeiro espírito do Brasil.'
    },
    {
      id: 'takeaway',
      icon: <Pizza size={18} className="text-[#CE2B37]" weight="duotone" />,
      title: 'Levantamento',
      description: 'Recolha o seu pedido com toda a comodidade, mantendo o sabor artesanal de sempre.'
    },
    {
      id: 'delivery',
      icon: <Bicycle size={18} className="text-amber-600" weight="duotone" />,
      title: 'Delivery',
      description: 'Receba a sua encomenda em casa, com rapidez e qualidade garantida.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={isClosing ? { opacity: 0, scale: 0.98 } : { opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl border border-gray-200/80 flex flex-col"
        style={{ maxHeight: '90vh' }}
      >
        <motion.button
          onClick={handleClose}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-white hover:bg-gray-100 transition-all shadow-lg border border-gray-200 hover:border-[#CE2B37] group z-50"
          whileHover={{ rotate: 90 }}
          whileTap={{ scale: 0.9 }}
        >
          <X size={16} className="text-gray-600 group-hover:text-[#CE2B37] transition-colors" weight="bold" />
        </motion.button>

        <PizzaDisplay />

        <div className="flex-1 flex flex-col p-4 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-center"
          >
            <h2 className="text-xl font-bold text-[#016730] mb-2">Calabresa com Catupiry</h2>
            <div className="relative mb-3">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 text-xs bg-white text-gray-500 font-medium">
                  A COMBINAÇÃO PERFEITA
                </span>
              </div>
            </div>
          </motion.div>

          <div className="flex-1 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col gap-y-3 mb-3"
            >
              {options.map((option, index) => (
                <OptionCard 
                  key={option.id}
                  icon={option.icon}
                  title={option.title}
                  description={option.description}
                  delay={index}
                  isSelected={selectedOption === option.id}
                  onClick={() => setSelectedOption(option.id)}
                />
              ))}
            </motion.div>

            <p className="text-xs text-gray-600 mb-3 leading-relaxed px-1">
              O equilíbrio perfeito entre o sabor marcante da calabresa e a cremosidade do autêntico catupiry.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col gap-y-3 pt-2"
          >
            <button
              onClick={handleJoin}
              className="w-full min-h-12 text-sm font-bold bg-gradient-to-r from-[#016730] to-[#CE2B37] text-white rounded-xl flex items-center justify-center gap-x-2 shadow-lg hover:shadow-xl transition-all hover:from-[#016730]/95 hover:to-[#CE2B37]/95 relative overflow-hidden group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  transition: { duration: 1, repeat: Infinity }
                }}
              >
                <Gift size={18} weight="fill" className="text-amber-300" />
              </motion.div>
              <span>Ganhe Recompensas Exclusivas</span>
              <motion.div
                className="absolute -right-1 -top-1"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity
                }}
              >
                <Flame size={14} className="text-amber-400" weight="fill" />
              </motion.div>
            </button>

            <button
              onClick={handleClose}
              className="w-full min-h-12 text-sm font-medium bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-[#016730] transition-colors hover:text-[#016730]"
              whileHover={{ scale: 1.01 }}
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