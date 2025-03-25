import React from 'react';
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
  return (
    <Page back={true}>
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
