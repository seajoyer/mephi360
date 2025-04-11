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
  isHidden = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const measurementRef = useRef<HTMLDivElement>(null);
  const scrollableContainerRef = useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const childArray = React.Children.toArray(children);
  const childCount = childArray.length;

  // Function to accurately calculate if content should be scrollable
  const calculateLayout = useCallback(() => {
    if (!containerRef.current || !measurementRef.current || childCount === 0) return;

    // Get container width - account for any padding
    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;

    // Get the total width needed for all buttons including gaps
    const measurementRect = measurementRef.current.getBoundingClientRect();
    const totalContentWidth = measurementRect.width;

    // Add a small buffer to prevent premature switching (8px as a safety margin)
    const shouldScroll = totalContentWidth > containerWidth;

    setIsScrollable(shouldScroll);
  }, [childCount]);

  // Helper function to ensure last element is scrollable to view
  const adjustScrollableContainer = useCallback(() => {
    if (isScrollable && scrollableContainerRef.current) {
      // Get the last child element
      const children = scrollableContainerRef.current.children;
      if (children.length > 0) {
        const lastChild = children[children.length - 1] as HTMLElement;

        // Ensure the container has enough room to scroll to the end
        // by adding right padding equal to container width minus last element width
        if (containerRef.current && lastChild) {
          const containerWidth = containerRef.current.offsetWidth;
          const lastChildWidth = lastChild.offsetWidth;

          // Set padding to allow scrolling the last element fully into view
          // Only apply if the last element is smaller than container (otherwise not needed)
          if (lastChildWidth < containerWidth) {
            scrollableContainerRef.current.style.paddingRight = `${containerWidth - lastChildWidth}px`;
          } else {
            scrollableContainerRef.current.style.paddingRight = '16px'; // Minimum padding
          }
        }
      }
    }
  }, [isScrollable]);

  // Run calculation when component mounts and when container size changes
  useEffect(() => {
    if (isHidden) return;

    // Initial calculation with a slight delay to ensure proper rendering
    const initialTimer = setTimeout(() => {
      calculateLayout();
      adjustScrollableContainer();
    }, 50);

    // Use ResizeObserver for modern browsers
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

    // Standard resize event as fallback
    const handleResize = () => {
      calculateLayout();
      adjustScrollableContainer();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(initialTimer);
      resizeObserver?.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [calculateLayout, adjustScrollableContainer, isHidden, childCount]);

  // Adjustments after scrollable state changes
  useEffect(() => {
    if (isScrollable) {
      adjustScrollableContainer();
    }
  }, [isScrollable, adjustScrollableContainer]);

  // Recalculate when visibility changes
  useEffect(() => {
    if (!isHidden) {
      // Delay to ensure proper rendering
      const timer = setTimeout(() => {
        calculateLayout();
        adjustScrollableContainer();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isHidden, calculateLayout, adjustScrollableContainer]);

  // Don't render anything when hidden
  if (isHidden) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`filter-container ${className}`}
      style={{
        width: '100%',
        position: 'relative',
        transition: 'all 0.2s ease-in-out',
        overflowX: 'hidden' // Ensures container doesn't cause horizontal scroll
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
          overflow: 'hidden',
          padding: 0,
          margin: 0
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
            paddingRight: '16px', // Initial padding, will be adjusted by code
            boxSizing: 'content-box', // Ensures padding doesn't affect width calculation
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

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }

        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .static-container {
          width: 100%;
        }

        .static-item, .static-item > * {
          width: 100% !important;
        }
      `}</style>
    </div>
  );
};
