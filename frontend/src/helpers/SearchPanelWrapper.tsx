import React, { useEffect, useRef, useState } from 'react';
import { usePlatform } from '@telegram-apps/telegram-ui/dist/hooks/usePlatform';

interface SearchPanelWrapperProps {
  children: React.ReactNode;
}

export const SearchPanelWrapper: React.FC<SearchPanelWrapperProps> = ({ children }) => {
  const [isSticky, setIsSticky] = useState(false);
  const [isOverlapping, setIsOverlapping] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const platform = usePlatform();

  useEffect(() => {
    const container = containerRef.current;
    const sticky = stickyRef.current;

    if (!container || !sticky) return;

    const stickyObserver = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: '0px 0px 0px 0px' // Early trigger by vertical padding amount
      }
    );

    const overlapObserver = new IntersectionObserver(
      ([entry]) => {
        setIsOverlapping(entry.isIntersecting);
      },
      { threshold: 0 }
    );

    stickyObserver.observe(container);

    // Observe the bottom of sticky element for overlap
    if (sticky.nextElementSibling) {
      overlapObserver.observe(sticky.nextElementSibling);
    }

    return () => {
      stickyObserver.disconnect();
      overlapObserver.disconnect();
    };
  }, []);

  const horizontalPadding = platform === 'ios' ? '18px' : '0';

  return (
    <div style={{ position: 'relative' }}>
      {/* Intersection observer reference point */}
      <div ref={containerRef} style={{ height: '1px', margin: 0, padding: 0 }} />

      {/* Background overlay with gradient */}
      {isSticky && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: `calc(${stickyRef.current?.offsetHeight ?? 0}px)`,
            background: 'var(--tgui--secondary_bg_color)',
            zIndex: 9,
            pointerEvents: 'none'
          }}
        />
      )}

      {/* Sticky container */}
      <div
        ref={stickyRef}
        style={{
          position: isSticky ? 'fixed' : 'relative',
          top: isSticky ? '0px' : '0',
          left: 0,
          right: 0,
          zIndex: 10,
          padding: `0 ${horizontalPadding}`
        }}
      >
        {children}
      </div>

      {/* Placeholder to prevent layout jump */}
      {isSticky && (
        <div
          style={{
            height: `calc(${stickyRef.current?.offsetHeight ?? 0}px)`,
            visibility: 'hidden'
          }}
        />
      )}
    </div>
  );
};
