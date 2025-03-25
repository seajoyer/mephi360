import React, { useEffect, useRef } from 'react';
import { backButton } from '@telegram-apps/sdk-react';
import { Page } from '@/components/Page';
import { Cell, List, Section } from '@telegram-apps/telegram-ui';

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
  // Track if we've already handled the back button to prevent double-handling
  const hasHandledBack = useRef(false);

  // Handle back button directly via the Telegram SDK
  useEffect(() => {
    // Make sure we show the back button
    backButton.show();

    // Register the back button handler
    const unsubscribe = backButton.onClick(() => {
      // Only handle the back button once to prevent double-triggering
      if (!hasHandledBack.current) {
        hasHandledBack.current = true;

        // Close the filter selection with the current selection
        onSelect(selectedOption);
      }

      // Always prevent default navigation by returning true
      return true;
    });

    // Clean up when unmounting
    return () => {
      unsubscribe();
      hasHandledBack.current = false;
    };
  }, [onSelect, selectedOption]);

  return (
    <Page back={false}>
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
    </Page>
  );
};
