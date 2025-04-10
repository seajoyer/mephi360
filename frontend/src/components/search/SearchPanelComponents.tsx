import React, { useRef, useEffect, useState, useCallback } from 'react';
import { SearchPanelGlobalStyles } from './searchPanelStyles';

interface FilterContainerProps {
  children: React.ReactNode;
  className?: string;
  isHidden?: boolean; // To hide when search is expanded
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
  const contentRef = useRef<HTMLDivElement>(null);
  const [expandFilters, setExpandFilters] = useState(false);

  // Measure if content fits container
  const measureContainers = useCallback(() => {
    if (containerRef.current && contentRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const contentWidth = contentRef.current.scrollWidth;

      // If content width is less than container width, expand filters
      setExpandFilters(contentWidth <= containerWidth);
    }
  }, []);

  // Set up ResizeObserver to detect width changes
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (!isHidden) {
        measureContainers();
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Initial measurement
    if (!isHidden) {
      measureContainers();
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [measureContainers, isHidden]);

  // Re-measure when visibility changes
  useEffect(() => {
    if (!isHidden) {
      setTimeout(measureContainers, 0);
    }
  }, [isHidden, measureContainers]);

  if (isHidden) {
    return null;
  }

  // Count React children to distribute width evenly
  const childCount = React.Children.count(children);
  const childrenArray = React.Children.toArray(children);

  if (expandFilters) {
    // Static layout with evenly distributed buttons
    return (
      <div
        ref={containerRef}
        className={`flex-1 ${className} transition-all duration-200 ease-in-out`}
      >
        <div className="flex gap-2 w-full">
          {childrenArray.map((child, index) => (
            <div
              key={index}
              style={{ flex: `1 1 ${100 / childCount}%` }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    // Scrollable layout - critical for touch scrolling to work properly
    return (
      <div
        ref={containerRef}
        className={`flex-1 ${className}`}
        style={{
          position: 'relative',
          width: '100%',
        }}
      >
        <div
          ref={contentRef}
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            paddingBottom: '4px',
          }}
          className="scroll-container"
        >
          {childrenArray.map((child, index) => (
            <div
              key={index}
              style={{
                display: 'inline-block',
                flexShrink: 0,
              }}
            >
              {child}
            </div>
          ))}
        </div>
        <style jsx>{`
          .scroll-container::-webkit-scrollbar {
            display: none;
            width: 0;
            height: 0;
          }
        `}</style>
      </div>
    );
  }
};
