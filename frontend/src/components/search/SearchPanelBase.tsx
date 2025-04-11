import React, { useState, useEffect, forwardRef, ReactNode } from 'react';

interface SearchPanelBaseProps {
  children: ReactNode;
  className?: string;
  dataAttr?: string;
}

/**
 * Simple search panel base component that applies sticky positioning using CSS
 * and adds shadow based on scroll position
 */
export const SearchPanelBase = forwardRef<HTMLDivElement, SearchPanelBaseProps>(
  ({ children, className = '', dataAttr = 'default' }, ref) => {
    const [hasShadow, setHasShadow] = useState(false);

    // Add shadow when scrolled
    useEffect(() => {
      const handleScroll = () => {
        setHasShadow(window.scrollY > 10);
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll(); // Check initial state

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, []);

    return (
      <div
        ref={ref}
        className={`search-panel ${hasShadow ? 'has-shadow' : ''} ${className}`}
        data-searchpanel={dataAttr}
      >
        {children}
      </div>
    );
  }
);

SearchPanelBase.displayName = 'SearchPanelBase';
