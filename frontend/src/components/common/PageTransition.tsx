import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

export const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const [transitionClass, setTransitionClass] = useState('');
  const prevPathRef = useRef<string | null>(null);
  const isInitialRenderRef = useRef(true);

  // TabBar paths (to detect and skip transitions between tab navigation)
  const tabBarPaths = ['wiki', 'circles', 'active', 'stuff'];

  // Helper to determine if navigation is between TabBar items
  const isTabBarNavigation = (prevPath: string | null, currentPath: string): boolean => {
    if (!prevPath) return false;

    const prevBase = prevPath.split('/')[1] || '';
    const currentBase = currentPath.split('/')[1] || '';

    return (
      tabBarPaths.includes(prevBase) &&
      tabBarPaths.includes(currentBase) &&
      prevBase !== currentBase
    );
  };

  useEffect(() => {
    const currentPath = location.pathname;
    const isBackNavigation = navigationType === 'POP';
    const isTabNav = isTabBarNavigation(prevPathRef.current, currentPath);
    const skipTransition =
      isBackNavigation ||
      isTabNav ||
      isInitialRenderRef.current ||
      (location.state && (location.state as any).skipTransition);

    // For first render or skipped transitions, don't animate
    if (skipTransition) {
      setTransitionClass('no-transition');
      isInitialRenderRef.current = false;
      prevPathRef.current = currentPath;
      return;
    }

    // Set the entering state immediately to start from the lower position
    setTransitionClass('page-entering');

    // Need a small delay before applying the active class to ensure the browser registers the initial state
    const timer = setTimeout(() => {
      setTransitionClass('page-entering page-active');
    }, 10);

    // Clear transition class after animation completes
    const endTimer = setTimeout(() => {
      setTransitionClass('');
    }, 350); // Slightly longer than transition duration to ensure completion

    // Update previous path reference
    prevPathRef.current = currentPath;
    isInitialRenderRef.current = false;

    return () => {
      clearTimeout(timer);
      clearTimeout(endTimer);
    };
  }, [location, navigationType]);

  return (
    <div className={`page-transition-wrapper ${transitionClass}`}>
      {children}
    </div>
  );
};
