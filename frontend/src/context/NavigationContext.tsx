import React, { createContext, useContext, useState } from 'react';

interface NavigationContextType {
    isNavigationSticky: boolean;
    setIsNavigationSticky: (isSticky: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType>({
    isNavigationSticky: false,
    setIsNavigationSticky: () => {},
});

export const NavigationProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [isNavigationSticky, setIsNavigationSticky] = useState(false);

    return (
        <NavigationContext.Provider value={{ isNavigationSticky, setIsNavigationSticky }}>
            {children}
        </NavigationContext.Provider>
    );
};

export const useNavigationContext = () => useContext(NavigationContext);
