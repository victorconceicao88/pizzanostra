import React from 'react';
import { motion } from 'framer-motion';

const Produtos = ({ category, menuData, onAddToCart }) => {
  const categoryData = menuData[category] || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categoryData.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden border border-gray-100"
        >
          <div className="p-5">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
              {item.isPopular && (
                <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                  Popular
                </span>
              )}
            </div>

            {item.description && (
              <p className="text-gray-600 text-sm mb-4">{item.description}</p>
            )}

            {item.sizes ? (
              <div className="mb-4">
                <div className="grid gap-2">
                  {Object.entries(item.sizes).map(([size, price]) => (
                    <div
                      key={size}
                      className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                    >
                      <span className="font-medium">
                        {size.charAt(0).toUpperCase() + size.slice(1)}
                      </span>
                      <div className="flex items-center">
                        <span className="font-bold text-italy-red mr-4">
                          {price}€
                        </span>
                        <motion.button
                          onClick={() => onAddToCart(item, size, price)}
                          className="bg-italy-green text-white p-1 rounded-full"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </motion.button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-italy-red text-lg">
                  {item.price}€
                </span>
                <motion.button
                  onClick={() => onAddToCart(item)}
                  className="bg-italy-green text-white px-4 py-2 rounded-lg flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="mr-2">Adicionar</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Produtos;