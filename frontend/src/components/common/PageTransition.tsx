import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
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
    const skipTransition = location.state && (location.state as any).skipTransition;

    // Skip transition for initial render, explicit skip flags, or TabBar navigation
    if (
      isInitialRenderRef.current ||
      skipTransition ||
      isTabBarNavigation(prevPathRef.current, currentPath)
    ) {
      isInitialRenderRef.current = false;
      prevPathRef.current = currentPath;
      return;
    }

    // Start transition
    setTransitionClass('page-transition-enter');

    // After a small delay, add the active class to trigger CSS transition
    const timer = setTimeout(() => {
      setTransitionClass('page-transition-enter page-transition-enter-active');
    }, 10);

    // Clear transition class after animation completes
    const endTimer = setTimeout(() => {
      setTransitionClass('');
    }, 100); // Match to your CSS transition duration

    // Update previous path reference
    prevPathRef.current = currentPath;

    return () => {
      clearTimeout(timer);
      clearTimeout(endTimer);
    };
  }, [location]);

  return (
    <div className={`page-transition-wrapper ${transitionClass}`}>
      {children}
    </div>
  );
};
