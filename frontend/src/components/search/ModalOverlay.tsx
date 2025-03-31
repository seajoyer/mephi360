import React, { useEffect, useRef } from 'react';
import { List, Cell, Section } from '@telegram-apps/telegram-ui';
import { backButton } from '@telegram-apps/sdk-react';

interface ModalOverlayProps {
  title: string;
  options: { id: string; name: string }[];
  selectedOption: string | null;
  onSelect: (option: string | null) => void;
  onClose: () => void;
  isVisible: boolean;
  parentHasBackButton?: boolean;
}

export const ModalOverlay: React.FC<ModalOverlayProps> = ({
  title,
  options,
  selectedOption,
  onSelect,
  onClose,
  isVisible,
  parentHasBackButton = false
}) => {
  const prevBackHandlerRef = useRef<(() => boolean) | null>(null);
  const isHandlerSetRef = useRef(false);
  const didPushStateRef = useRef(false);
  const isCleaningUpRef = useRef(false);

  // Handle back button visibility and handler
  useEffect(() => {
    if (isVisible && !isCleaningUpRef.current) {
      // Show back button when overlay is visible
      backButton.show();

      try {
        // Store previous handler if any
        const currentHandler = backButton._onClick;
        if (currentHandler && typeof currentHandler === 'function') {
          prevBackHandlerRef.current = currentHandler;
        }
      } catch (e) {
        console.error("Error accessing back button handler", e);
      }

      // Set custom back button handler
      const backButtonHandler = () => {
        onClose();
        return true; // Prevent default back navigation
      };

      // Set our handler
      const cleanup = backButton.onClick(backButtonHandler);
      isHandlerSetRef.current = true;

      // Add history state for browsers that support it
      if (window.history && window.history.pushState && !didPushStateRef.current) {
        // Add a history entry without actually navigating
        const currentUrl = window.location.href;
        window.history.pushState(
          { isModal: true, url: currentUrl },
          document.title,
          currentUrl
        );
        didPushStateRef.current = true;

        // Listen for back button via history
        const popstateHandler = (event: PopStateEvent) => {
          // Only handle if our overlay is still visible
          if (isVisible && !isCleaningUpRef.current) {
            onClose();
          }
        };

        window.addEventListener('popstate', popstateHandler);

        return () => {
          // Restore previous back button handler
          cleanup();
          isHandlerSetRef.current = false;

          // Hide back button if parent doesn't need it
          if (!parentHasBackButton) {
            backButton.hide();
          } else if (prevBackHandlerRef.current) {
            // Restore previous handler if parent needs back button
            backButton.onClick(prevBackHandlerRef.current);
          }

          // Remove popstate listener
          window.removeEventListener('popstate', popstateHandler);
          didPushStateRef.current = false;
        };
      }

      // If history API not available, just handle the cleanup
      return () => {
        cleanup();
        isHandlerSetRef.current = false;

        // Hide back button if parent doesn't need it
        if (!parentHasBackButton) {
          backButton.hide();
        } else if (prevBackHandlerRef.current) {
          // Restore previous handler if parent needs back button
          backButton.onClick(prevBackHandlerRef.current);
        }

        didPushStateRef.current = false;
      };
    }
  }, [isVisible, onClose, parentHasBackButton]);

  // Handle selection and proper cleanup
  const handleSelect = (option: string | null) => {
    isCleaningUpRef.current = true;

    // Clean up history state if we added one
    if (didPushStateRef.current && window.history) {
      window.history.go(-1); // Remove our history entry
      didPushStateRef.current = false;
    }

    // Apply selection and close modal
    onSelect(option);
    onClose();

    // Reset cleanup flag after a short delay
    setTimeout(() => {
      isCleaningUpRef.current = false;
    }, 100);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      // Ensure we clean up when unmounting
      isHandlerSetRef.current = false;
      didPushStateRef.current = false;
      isCleaningUpRef.current = false;
    };
  }, []);

  // Don't render anything if not visible
  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        background: 'var(--tgui--secondary_bg_color)',
        overflow: 'auto'
      }}
    >
      <List>
        <Section
            header={title}
        >
          {/* "All" option */}
          <Cell
            onClick={() => handleSelect(null)}
            after={selectedOption === null ? (
              <span style={{ color: 'var(--tgui--link_color)' }}>✓</span>
            ) : undefined}
          >
            Все
          </Cell>

          {options.map(option => (
            <Cell
              key={option.id}
              onClick={() => handleSelect(option.id)}
              after={selectedOption === option.id ? (
                <span style={{ color: 'var(--tgui--link_color)' }}>✓</span>
              ) : undefined}
            >
              {option.name}
            </Cell>
          ))}
        </Section>
      </List>
    </div>
  );
};
