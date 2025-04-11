import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Component that resets scroll position when the route changes.
 * IMPORTANT: This component must be used inside a Router context.
 */
export const ScrollReset: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Use a short delay to ensure this happens after the transition begins
    // but before it completes, for a smoother experience
    const timer = setTimeout(() => {
      // Reset scroll position when pathname changes
      window.scrollTo(0, 0);
      console.log('ScrollReset: Scroll position reset for', pathname);
    }, 50);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null; // This is a utility component with no UI
};
