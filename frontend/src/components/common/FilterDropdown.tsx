import React, { useState, useEffect, useRef } from 'react';
import { Button, Cell, Divider, Tappable } from '@telegram-apps/telegram-ui';
import { Icon24Close } from '@/icons/24/close';
import { Icon20Chevron_vertical } from '@/icons/20/chevron_vertical';
import { Icon20Check } from '@/icons/20/check';

// Define dropdown option type
export interface DropdownOption {
  id: string;
  name: string;
}

interface FilterDropdownProps {
  options: DropdownOption[];
  selectedOption: string | null;
  onSelect: (optionId: string | null) => void;
  placeholder?: string;
  label?: string;
  loading?: boolean;
  position?: 'bottom' | 'top'; // Default is bottom
  maxHeight?: number;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  options,
  selectedOption,
  onSelect,
  placeholder = 'Выберите',
  label,
  loading = false,
  position = 'bottom',
  maxHeight = 300
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Get selected option name
  const getSelectedName = () => {
    if (!selectedOption) return placeholder;
    const option = options.find(opt => opt.id === selectedOption);
    return option ? option.name : placeholder;
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Handle option select
  const handleSelect = (optionId: string) => {
    // If selecting the same option, clear the selection
    if (optionId === selectedOption) {
      onSelect(null);
    } else {
      onSelect(optionId);
    }
    setIsOpen(false);
  };

  // Handle clear selection
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(null);
  };

  return (
    <div className="filter-dropdown relative">
      {/* Filter button */}
      <div ref={buttonRef}>
        <Button
          mode="gray"
          size="m"
          onClick={toggleDropdown}
          style={{
            background: 'var(--tgui--section_bg_color)',
            justifyContent: 'space-between',
            width: '100%',
            textAlign: 'left',
            position: 'relative'
          }}
          after={
            <div className="flex items-center">
              {selectedOption ? (
                <Tappable
                  onClick={handleClear}
                  style={{
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Icon24Close style={{ color: 'var(--tgui--section_fg_color)' }} />
                </Tappable>
              ) : (
                <Icon20Chevron_vertical style={{ color: 'var(--tgui--hint_color)' }} />
              )}
            </div>
          }
        >
          <div
            style={{
              color: selectedOption ? 'var(--tgui--text_color)' : 'var(--tgui--hint_color)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontWeight: selectedOption ? 500 : 400
            }}
          >
            {label && <span className="mr-1">{label}:</span>}
            {getSelectedName()}
          </div>
        </Button>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 shadow-lg rounded-md overflow-hidden"
          style={{
            background: 'var(--tgui--bg_color)',
            maxHeight: `${maxHeight}px`,
            overflowY: 'auto',
            top: position === 'bottom' ? '100%' : 'auto',
            bottom: position === 'top' ? '100%' : 'auto',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}
        >
          {/* "Все" option always present */}
          <Cell
            onClick={() => handleSelect('all')}
            style={{
              background: selectedOption === null ? 'var(--tgui--tertiary_bg_color)' : undefined
            }}
            after={selectedOption === null ? <Icon20Check style={{ color: 'var(--tgui--link_color)' }} /> : null}
          >
            Все
          </Cell>

          <Divider />

          {loading ? (
            <div className="p-4 text-center">
              <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] text-link" />
            </div>
          ) : (
            options.map((option) => (
              <Cell
                key={option.id}
                onClick={() => handleSelect(option.id)}
                style={{
                  background: selectedOption === option.id ? 'var(--tgui--tertiary_bg_color)' : undefined
                }}
                after={selectedOption === option.id ? <Icon20Check style={{ color: 'var(--tgui--link_color)' }} /> : null}
              >
                {option.name}
              </Cell>
            ))
          )}
        </div>
      )}
    </div>
  );
};
