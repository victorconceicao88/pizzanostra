// src/components/InterfaceCliente/ThemeContext.js
import React, { createContext, useContext, useState } from 'react';

// Cria o contexto
const ThemeContext = createContext();

// Provider que envolve sua aplicação
export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// ✅ Este é o hook que estava faltando:
export const useTheme = () => useContext(ThemeContext);

// Exporta por padrão o contexto (opcional)
export default ThemeContext;
