import { useRef, useEffect, useState, useCallback } from 'react';

interface ScrollManagerOptions {
  /**
   * Whether to preserve scroll position when content height changes
   */
  preserveOnHeightChange?: boolean;

  /**
   * Element to observe for height changes
   * If not provided, the document body will be used
   */
  element?: React.RefObject<HTMLElement>;

  /**
   * Debounce interval in ms for height change detection
   */
  debounceInterval?: number;
}

/**
 * Hook for managing scroll position across content changes
 */
export const useScrollManager = ({
  preserveOnHeightChange = true,
  element,
  debounceInterval = 100
}: ScrollManagerOptions = {}) => {
  // Track current scroll position
  const [scrollPosition, setScrollPosition] = useState(0);

  // Reference to previous content height
  const previousHeightRef = useRef<number>(0);

  // Reference to the most recent scroll position before height changes
  const lastScrollPositionRef = useRef<number>(0);

  // Timeout for debouncing
  const timeoutRef = useRef<number | null>(null);

  // Check if user is actively scrolling
  const isScrollingRef = useRef(false);

  // Function to update scroll position state
  const updateScrollPosition = useCallback(() => {
    const currentPosition = window.scrollY;
    setScrollPosition(currentPosition);
    lastScrollPositionRef.current = currentPosition;
  }, []);

  // Function to measure element height
  const measureHeight = useCallback(() => {
    const target = element?.current || document.body;
    return target.scrollHeight;
  }, [element]);

  // Check for height changes and adjust scroll position
  const checkHeightChanges = useCallback(() => {
    if (!preserveOnHeightChange) return;

    const currentHeight = measureHeight();
    const previousHeight = previousHeightRef.current;

    if (previousHeight > 0 && currentHeight !== previousHeight) {
      // Height has changed, adjust scroll position
      const heightDifference = currentHeight - previousHeight;

      // Only adjust if height decreased (content was removed)
      if (heightDifference < 0 && !isScrollingRef.current) {
        // Maintain the same relative position
        window.scrollTo({
          top: Math.max(0, lastScrollPositionRef.current + heightDifference),
          behavior: 'auto' // Use 'auto' to avoid animation
        });
      }
    }

    previousHeightRef.current = currentHeight;
  }, [preserveOnHeightChange, measureHeight]);

  // Debounced height check
  const debouncedHeightCheck = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      checkHeightChanges();
      timeoutRef.current = null;
    }, debounceInterval);
  }, [checkHeightChanges, debounceInterval]);

  // Initialize and set up event listeners
  useEffect(() => {
    // Initial measurements
    previousHeightRef.current = measureHeight();
    updateScrollPosition();

    // Scroll event handler
    const handleScroll = () => {
      isScrollingRef.current = true;
      updateScrollPosition();

      // Reset scrolling flag after a delay
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        isScrollingRef.current = false;
        timeoutRef.current = null;
      }, debounceInterval);
    };

    // Listen for scroll events
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Set up mutation observer to detect DOM changes
    if (preserveOnHeightChange) {
      const observer = new MutationObserver(debouncedHeightCheck);
      const targetNode = element?.current || document.body;

      observer.observe(targetNode, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true
      });

      return () => {
        window.removeEventListener('scroll', handleScroll);
        observer.disconnect();
        if (timeoutRef.current) {
          window.clearTimeout(timeoutRef.current);
        }
      };
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [preserveOnHeightChange, updateScrollPosition, measureHeight, debouncedHeightCheck, debounceInterval, element]);

  // Manual functions for saving/restoring scroll position
  const saveScrollPosition = useCallback(() => {
    lastScrollPositionRef.current = window.scrollY;
    return lastScrollPositionRef.current;
  }, []);

  const restoreScrollPosition = useCallback((adjustmentOffset = 0) => {
    window.scrollTo({
      top: lastScrollPositionRef.current + adjustmentOffset,
      behavior: 'auto'
    });
  }, []);

  return {
    scrollPosition,
    saveScrollPosition,
    restoreScrollPosition
  };
};
