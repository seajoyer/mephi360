import React, { useEffect, useRef } from 'react';
import { backButton } from '@telegram-apps/sdk-react';
import { Cell, List, Section } from '@telegram-apps/telegram-ui';
import { ScrollUpButton } from '@/components/common/ScrollUpButton';

interface FilterSelectionPageProps {
  title: string;
  options: { id: string; name: string }[];
  selectedOption: string | null;
  onSelect: (option: string | null) => void;
}

export const FilterSelectionPage: React.FC<FilterSelectionPageProps> = ({
  title,
  options,
  selectedOption,
  onSelect
}) => {
  // Reference to keep track of previous back button handler
  const previousHandlerRef = useRef<(() => boolean) | null>(null);

  // Handle back button
  useEffect(() => {
    // Store the current back button handler
    try {
      const currentHandler = backButton.onClick();
      if (currentHandler) {
        previousHandlerRef.current = currentHandler;
      }
    } catch (e) {
      console.warn("Failed to get current back button handler:", e);
    }

    // Set our handler
    backButton.show();
    const cleanup = backButton.onClick(() => {
      // Close the filter selection with current selection
      onSelect(selectedOption);
      return true; // Prevent default navigation
    });

    // Clean up
    return () => {
      cleanup();
      
      // Restore previous handler if it exists
      if (previousHandlerRef.current) {
        try {
          backButton.onClick(previousHandlerRef.current);
        } catch (e) {
          console.warn("Failed to restore previous back button handler:", e);
        }
      }
    };
  }, [onSelect, selectedOption]);

  // Reset scroll position when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'var(--tgui--bg_color)',
        zIndex: 1000,
        overflow: 'auto'
      }}
    >
      <div className="page-container">
        <div className="page-content">
          <List>
            <Section header={title}>
              {/* "All" option */}
              <Cell
                onClick={() => onSelect(null)}
                after={selectedOption === null ? (
                  <span style={{ color: 'var(--tgui--link_color)' }}>✓</span>
                ) : undefined}
              >
                Все
              </Cell>

              {options.map(option => (
                <Cell
                  key={option.id}
                  onClick={() => onSelect(option.id)}
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

        {/* Add sufficient bottom padding to prevent scroll jumps */}
        <div
          className="page-bottom-space"
          style={{
            height: '300px',
            width: '100%'
          }}
          aria-hidden="true"
        />
      </div>
      <ScrollUpButton />
    </div>
  );
};
