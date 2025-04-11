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
  const [isScrollable, setIsScrollable] = useState(false);
  const childArray = React.Children.toArray(children);
  const childCount = childArray.length;

  // Function to accurately calculate if content should be scrollable
  const calculateLayout = useCallback(() => {
    if (!containerRef.current || !measurementRef.current || childCount === 0) return;

    // Get container width
    const containerWidth = containerRef.current.offsetWidth;

    // Get the total width when buttons have their natural size
    const totalButtonsWidth = measurementRef.current.scrollWidth;

    // Determine if scrollable mode is needed
    const shouldScroll = totalButtonsWidth > containerWidth;

    setIsScrollable(shouldScroll);
  }, [childCount]);

  // Run calculation when component mounts and when container size changes
  useEffect(() => {
    if (isHidden) return;

    // Initial calculation
    calculateLayout();

    // Use ResizeObserver for modern browsers
    let resizeObserver: ResizeObserver | null = null;

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        calculateLayout();
      });

      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
        // Also observe body for layout changes
        document.body.clientWidth && resizeObserver.observe(document.body);
      }
    }

    // Standard resize event as fallback
    window.addEventListener('resize', calculateLayout);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener('resize', calculateLayout);
    };
  }, [calculateLayout, isHidden, childCount]);

  // Recalculate when visibility changes
  useEffect(() => {
    if (!isHidden) {
      // Delay to ensure proper rendering
      setTimeout(calculateLayout, 100);
    }
  }, [isHidden, calculateLayout]);

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
        transition: 'all 0.2s ease-in-out'
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
          className="scrollable-container"
          style={{
            display: 'flex',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            gap: '8px',
            width: '100%',
            overflowY: 'hidden'
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
        .scrollable-container::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
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
