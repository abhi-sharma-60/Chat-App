import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  // persist theme on localStorage
  useEffect(() => {
    const stored = localStorage.getItem("app-theme");
    if (stored) setTheme(stored);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "light" ? "warm" : "light";
      localStorage.setItem("app-theme", next);
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={theme === "light" ? "theme-light" : "theme-warm"}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
