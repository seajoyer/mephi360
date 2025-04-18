import React, { useRef, useEffect, useState, useCallback } from 'react';
import { SearchPanelGlobalStyles } from './searchPanelStyles';

interface FilterContainerProps {
  children: React.ReactNode;
  className?: string;
  isHidden?: boolean; // To control visibility when search is expanded
}

/**
 * Export SearchPanelStyles as an alias for backward compatibility
 */
export const SearchPanelStyles = SearchPanelGlobalStyles;

/**
 * A responsive container for filter buttons that automatically switches between
 * static (evenly spaced) and scrollable layouts depending on available width.
 */
export const FilterContainer: React.FC<FilterContainerProps> = ({
  children,
  className = '',
  isHidden = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const measurementRef = useRef<HTMLDivElement>(null);
  const scrollableContainerRef = useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const childArray = React.Children.toArray(children);
  const childCount = childArray.length;

  // Function to calculate if content should be scrollable
  const calculateLayout = useCallback(() => {
    if (!containerRef.current || !measurementRef.current || childCount === 0) return;

    const containerWidth = containerRef.current.getBoundingClientRect().width;
    const totalContentWidth = measurementRef.current.getBoundingClientRect().width;
    setIsScrollable(totalContentWidth > containerWidth);
  }, [childCount]);

  // Helper function to ensure last element is scrollable to view
  const adjustScrollableContainer = useCallback(() => {
    if (isScrollable && scrollableContainerRef.current) {
      const children = scrollableContainerRef.current.children;
      if (children.length > 0) {
        const lastChild = children[children.length - 1] as HTMLElement;
        if (containerRef.current && lastChild) {
          const containerWidth = containerRef.current.offsetWidth;
          const lastChildWidth = lastChild.offsetWidth;
          if (lastChildWidth < containerWidth) {
            scrollableContainerRef.current.style.paddingRight = `${containerWidth - lastChildWidth}px`;
          } else {
            scrollableContainerRef.current.style.paddingRight = '16px';
          }
        }
      }
    }
  }, [isScrollable]);

  // Setup layout calculations
  useEffect(() => {
    // Initial calculation
    const initialTimer = setTimeout(() => {
      calculateLayout();
      adjustScrollableContainer();
    }, 50);

    // ResizeObserver for layout changes
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        calculateLayout();
        adjustScrollableContainer();
      });

      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }
    }

    return () => {
      clearTimeout(initialTimer);
      resizeObserver?.disconnect();
    };
  }, [calculateLayout, adjustScrollableContainer, childCount]);

  return (
    <div
      ref={containerRef}
      className={`filter-container ${className}`}
      style={{
        width: '100%',
        position: 'relative',
        transition: 'all 0.2s ease-in-out',
        overflowX: 'hidden',
        opacity: isHidden ? 0.7 : 1,
        visibility: isHidden ? 'hidden' : 'visible',
        pointerEvents: isHidden ? 'none' : 'auto'
      }}
    >
      {/* Hidden container for measurement */}
      <div
        ref={measurementRef}
        style={{
          position: 'absolute',
          visibility: 'hidden',
          display: 'flex',
          whiteSpace: 'nowrap',
          gap: '8px',
          pointerEvents: 'none',
          height: 0,
          overflow: 'hidden'
        }}
      >
        {childArray.map((child, index) => (
          <div key={`measure-${index}`} style={{ flexShrink: 0 }}>
            {child}
          </div>
        ))}
      </div>

      {isScrollable ? (
        // Scrollable layout
        <div
          ref={scrollableContainerRef}
          className="scrollable-container no-scrollbar"
          style={{
            display: 'flex',
            overflowX: 'auto',
            overflowY: 'hidden',
            whiteSpace: 'nowrap',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            gap: '8px',
            width: '100%',
            paddingRight: '16px',
            boxSizing: 'content-box'
          }}
        >
          {childArray.map((child, index) => (
            <div
              key={index}
              className="scrollable-item"
              style={{
                display: 'inline-block',
                flexShrink: 0
              }}
            >
              {child}
            </div>
          ))}
        </div>
      ) : (
        // Static layout with equal-width buttons
        <div
          className="static-container"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${childCount}, 1fr)`,
            gap: '8px',
            width: '100%'
          }}
        >
          {childArray.map((child, index) => (
            <div
              key={index}
              className="static-item"
              style={{
                width: '100%'
              }}
            >
              {/* Clone child with forced width */}
              {React.isValidElement(child) &&
                React.cloneElement(child, {
                  ...child.props,
                  style: {
                    ...(child.props.style || {}),
                    width: '100%',
                    minWidth: '0'
                  }
                })
              }
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
