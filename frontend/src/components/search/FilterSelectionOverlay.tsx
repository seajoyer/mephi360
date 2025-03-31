import React, { useEffect, useRef } from 'react';
import { backButton } from '@telegram-apps/sdk-react';
import { List, Cell, Section } from '@telegram-apps/telegram-ui';

interface FilterSelectionOverlayProps {
  title: string;
  options: { id: string; name: string }[];
  selectedOption: string | null;
  onSelect: (option: string | null) => void;
  onClose: () => void;
  isVisible: boolean;
  parentHasBackButton?: boolean;
}

export const FilterSelectionOverlay: React.FC<FilterSelectionOverlayProps> = ({
  title,
  options,
  selectedOption,
  onSelect,
  onClose,
  isVisible,
  parentHasBackButton = false
}) => {
  // Use ref to track if we've handled the back button
  const handlerSetRef = useRef(false);
  const prevHandlerRef = useRef<(() => boolean) | null>(null);

  // Handle back button for the overlay - with improved reference tracking
  useEffect(() => {
    // Only run this effect when visibility changes
    if (isVisible) {
      // Store the current back button handler (if any)
      try {
        // Save any existing handler so we can restore it later
        const currentHandler = backButton._onClick;
        if (currentHandler && typeof currentHandler === 'function') {
          prevHandlerRef.current = currentHandler;
        } else {
          prevHandlerRef.current = null;
        }
      } catch (e) {
        console.error("Error accessing back button handler", e);
        prevHandlerRef.current = null;
      }

      // Show back button and set our custom handler
      backButton.show();

      // Create our handler that intercepts back button press
      const handleBackButton = () => {
        // Close the overlay
        onClose();
        return true; // Prevent navigation
      };

      // Set our handler and mark as set
      backButton.onClick(handleBackButton);
      handlerSetRef.current = true;

      // Cleanup function
      return () => {
        // Only run cleanup if we have set our handler
        if (handlerSetRef.current) {
          handlerSetRef.current = false;

          // Reset to previous handler if any
          if (prevHandlerRef.current) {
            backButton.onClick(prevHandlerRef.current);
          } else {
            // If no previous handler, remove our handler
            backButton.onClick(() => false);
          }

          // Hide back button if parent doesn't need it
          if (!parentHasBackButton) {
            backButton.hide();
          }
        }
      };
    }
  }, [isVisible, onClose, parentHasBackButton]);

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
            onClick={() => {
              onSelect(null);
              onClose();
            }}
            after={selectedOption === null ? (
              <span style={{ color: 'var(--tgui--link_color)' }}>✓</span>
            ) : undefined}
          >
            Все
          </Cell>

          {options.map(option => (
            <Cell
              key={option.id}
              onClick={() => {
                onSelect(option.id);
                onClose();
              }}
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
