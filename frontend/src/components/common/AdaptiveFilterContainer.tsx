import React, { useState, useRef, useEffect, ReactNode } from 'react';

interface AdaptiveFilterContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * A container that automatically switches between scrollable and static layouts
 * based on whether the content fits within the container width.
 *
 * When content fits: Filters are evenly spaced across the available width
 * When content doesn't fit: Container becomes horizontally scrollable
 */
export const AdaptiveFilterContainer: React.FC<AdaptiveFilterContainerProps> = ({
  children,
  className = '',
}) => {
  const [contentFits, setContentFits] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Measure if content fits container width
  const measureContainers = () => {
    if (containerRef.current && contentRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const contentWidth = contentRef.current.scrollWidth;
      setContentFits(contentWidth <= containerWidth);
    }
  };

  // Set up resize observer to measure whenever dimensions change
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      measureContainers();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Perform initial measurement
    measureContainers();

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`flex-1 flex-shrink-0 ${contentFits ? '' : 'overflow-x-auto no-scrollbar'} ${className}`}
    >
      <div
        ref={contentRef}
        className={`flex ${contentFits ? 'justify-between w-full' : 'gap-2'}`}
        style={{
          minWidth: contentFits ? 'auto' : 'max-content'
        }}
      >
        {children}
      </div>
    </div>
  );
};
