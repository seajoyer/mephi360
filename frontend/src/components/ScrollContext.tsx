import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ScrollContextType {
  isSearchSticky: boolean;
  setIsSearchSticky: (value: boolean) => void;
}

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

export const ScrollProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isSearchSticky, setIsSearchSticky] = useState(false);

  return (
    <ScrollContext.Provider value={{ isSearchSticky, setIsSearchSticky }}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScroll = (): ScrollContextType => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error('useScroll must be used within a ScrollProvider');
  }
  return context;
};
