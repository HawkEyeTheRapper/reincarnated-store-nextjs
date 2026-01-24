import React, { createContext, useState, useContext } from 'react';

type WPThemeContextType = {
  theme: string;
  setTheme: (theme: string) => void;
};

const WPThemeContext = createContext<WPThemeContextType | undefined>(undefined);

export const WPThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState('wp-dos');

  return (
    <WPThemeContext.Provider value={{ theme, setTheme }}>
      <div className={theme}>{children}</div>
    </WPThemeContext.Provider>
  );
};

export const useWPTheme = () => {
  const context = useContext(WPThemeContext);
  if (!context) {
    throw new Error('useWPTheme must be used within a WPThemeProvider');
  }
  return context;
};
