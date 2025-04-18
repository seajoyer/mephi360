import { useNavigate } from 'react-router-dom';
import { backButton } from '@telegram-apps/sdk-react';
import { PropsWithChildren, useEffect } from 'react';
import { ScrollUpButton } from '@/components/common/ScrollUpButton';
import { TabBar } from './layout/TabBar';

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
 * a consistent page structure.
 */
export function Page({
  children,
  back = true,
  className = '',
}: PropsWithChildren<PageProps>) {
  const navigate = useNavigate();

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

      // Set the handler in the SDK
      const cleanup = backButton.onClick(handleBack);

      return () => {
        // Clean up handler
        cleanup();
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

      {/* <ScrollUpButton /> */}
    </div>
  );
}
