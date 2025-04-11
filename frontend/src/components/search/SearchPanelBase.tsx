import React, { useState, useEffect, forwardRef, ReactNode } from 'react';

interface SearchPanelBaseProps {
  children: ReactNode;
  className?: string;
  dataAttr?: string;
  shadowReferenceElement?: React.RefObject<HTMLElement>; // Add reference element prop
}

/**
 * Simple search panel base component that applies sticky positioning using CSS
 * and adds shadow based on scroll position
 */
export const SearchPanelBase = forwardRef<HTMLDivElement, SearchPanelBaseProps>(
  ({ children, className = '', dataAttr = 'default', shadowReferenceElement }, ref) => {
    const [hasShadow, setHasShadow] = useState(false);

    // Add shadow when scrolled
    useEffect(() => {
      const handleScroll = () => {
        if (shadowReferenceElement?.current) {
          // Check if reference element has scrolled past the viewport top
          const refRect = shadowReferenceElement.current.getBoundingClientRect();
          // Show shadow when the bottom of the reference element is above the viewport
          setHasShadow(refRect.bottom <= 0);
        } else {
          // Default behavior - show shadow after 10px scroll
          setHasShadow(window.scrollY > 10);
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll(); // Check initial state

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, [shadowReferenceElement]);

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
