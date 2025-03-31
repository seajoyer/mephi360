import { useNavigate } from 'react-router-dom';
import { backButton } from '@telegram-apps/sdk-react';
import { PropsWithChildren, useEffect, useRef } from 'react';
import { ScrollUpButton } from '@/components/common/ScrollUpButton';

export interface PageProps {
  /**
   * True if it is allowed to go back from this page.
   */
  back?: boolean;

  /**
   * Additional class names for the page container
   */
  className?: string;
}

/**
 * Page component that handles back button functionality and provides
 * a consistent page structure with minimal scroll height.
 */
export function Page({
  children,
  back = true,
  className = '',
}: PropsWithChildren<PageProps>) {
  const navigate = useNavigate();
  const backHandlerRef = useRef<(() => boolean) | null>(null);

  // Handle back button functionality
  useEffect(() => {
    if (back) {
      // Show back button
      backButton.show();

      // Create a navigation handler
      const handleBack = () => {
        navigate(-1);
        return false; // Let default navigation happen
      };

      // Save a reference to our handler
      backHandlerRef.current = handleBack;

      // Set the handler in the SDK
      const cleanup = backButton.onClick(handleBack);

      return () => {
        // Clean up handler and make sure we don't interfere with other handlers
        cleanup();
        backHandlerRef.current = null;
      };
    } else {
      // Hide back button if not needed
      backButton.hide();
    }
  }, [back, navigate]);

  // Reset scroll position when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={`page-container ${className}`}>
      {/* Main content */}
      <div className="page-content">
        {children}
      </div>

      {/* Add sufficient bottom padding to prevent scroll jumps */}
      <div
        className="page-bottom-space"
        style={{
          height: '300px',
          width: '100%'
        }}
        aria-hidden="true"
      />

      <ScrollUpButton />
    </div>
  );
}
