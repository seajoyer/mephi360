import React from 'react';
import { Button } from '@telegram-apps/telegram-ui';
import { Icon16Chevron } from '@/icons/16/chevron';
import { Icon16Cancel } from '@/icons/16/cancel';

interface FilterButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  onClear?: () => void;
  expandable?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * A standardized filter button with selection state and clear functionality
 */
export const FilterButton: React.FC<FilterButtonProps> = ({
  label,
  selected,
  onClick,
  onClear,
  expandable = true,
  style = {},
  className = ''
}) => {
  return (
    <Button
      mode="gray"
      size="m"
      className={`filter-button ${selected ? 'filter-button-selected' : ''} ${className}`}
      style={{
        justifyContent: "space-between",
        paddingLeft: '10px',
        paddingRight: '10px',
        background: 'var(--tgui--section_bg_color)',
        // When in scrollable mode, set natural width based on content
        transition: 'all 0.2s ease-in-out',
        whiteSpace: 'nowrap',
        ...style
      }}
      onClick={onClick}
      after={
        selected ? (
          <Icon16Cancel
            style={{
              cursor: 'pointer',
            }}
            onClick={onClear ? (e) => {
              e.stopPropagation();
              onClear();
            } : undefined}
          />
        ) : (
          expandable && (
            <Icon16Chevron />
          )
        )
      }
    >
      <div
        style={{
          color: selected ? 'var(--tgui--text_color)' : 'var(--tgui--hint_color)',
          transition: 'color 0.15s ease-in-out, font-weight 0.15s ease-in-out',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          marginRight: '4px',
          flexShrink: 1,
        }}
      >
        {label}
      </div>
    </Button>
  );
};
