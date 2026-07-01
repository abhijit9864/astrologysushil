import { createContext, useContext } from "react";

const ThemeContext = createContext({ darkMode: false, setDarkMode: () => {} });

export const ThemeProvider = ({ children }) => {
  return (
    <ThemeContext.Provider value={{ darkMode: false, setDarkMode: () => {} }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
