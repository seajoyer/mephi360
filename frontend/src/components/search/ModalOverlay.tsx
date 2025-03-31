import React, { useEffect, useRef } from 'react';
import { List, Cell, Section } from '@telegram-apps/telegram-ui';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const navigate = useNavigate();
  const location = useLocation();
  const prevBackHandlerRef = useRef<(() => boolean) | null>(null);
  const isHandlerSetRef = useRef(false);

  // Handle back button visibility and handler
  useEffect(() => {
    if (isVisible) {
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
      if (window.history && window.history.pushState) {
        // Add a history entry without actually navigating
        window.history.pushState(
          { isModal: true },
          document.title,
          `${location.pathname}?modal=filter`
        );

        // Listen for back button via history
        const popstateHandler = () => {
          if (isVisible) {
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
      };
    }
  }, [isVisible, onClose, parentHasBackButton, location.pathname]);

  // Handle selection
  const handleSelect = (option: string | null) => {
    onSelect(option);
    onClose();
  };

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
        background: 'var(--tgui--bg_color)',
        overflow: 'auto'
      }}
    >
      <div style={{
        padding: '16px',
        borderBottom: '1px solid var(--tgui--divider)',
        fontWeight: 'bold',
        fontSize: '18px'
      }}>
        {title}
      </div>
      <List>
        <Section>
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
