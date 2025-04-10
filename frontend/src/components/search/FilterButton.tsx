import React from 'react';
import { Button } from '@telegram-apps/telegram-ui';
import { Icon24Close } from '@/icons/24/close';
import { Icon16Chevron } from '@/icons/16/chevron';

interface FilterButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  onClear?: () => void;
  expandable?: boolean;
}

/**
 * A standardized filter button with selection state and clear functionality
 */
export const FilterButton: React.FC<FilterButtonProps> = ({
  label,
  selected,
  onClick,
  onClear,
  expandable = true
}) => {
  return (
    <Button
      mode="gray"
      size="m"
      style={{
        justifyContent: "space-between",
        paddingLeft: '10px',
        paddingRight: '10px',
        background: 'var(--tgui--section_bg_color)',
        width: '100%',
        minWidth: selected ? '110px' : label.length <= 8 ? '80px' : '110px',
        transition: 'all 0.2s ease-in-out',
        display: 'flex',
        flexShrink: 0,
      }}
      onClick={onClick}
      after={
        selected ? (
          <Icon24Close
            style={{
              cursor: 'pointer',
              marginRight: '-2px',
              transition: 'opacity 0.15s ease-in-out',
              flexShrink: 0,
            }}
            onClick={onClear ? (e) => {
              e.stopPropagation();
              onClear();
            } : undefined}
          />
        ) : (
          <Icon16Chevron
            style={{
              transition: 'opacity 0.15s ease-in-out',
              flexShrink: 0,
            }}
          />
        )
      }
    >
      <div
        style={{
          color: selected ? 'var(--tgui--text_color)' : 'var(--tgui--hint_color)',
          fontWeight: !selected ? 'normal' : '',
          transition: 'color 0.15s ease-in-out, font-weight 0.15s ease-in-out',
          whiteSpace: 'nowrap',
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
